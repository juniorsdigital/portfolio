#!/usr/bin/env node
/**
 * Content guard. Runs before every build (npm "prebuild") and on `npm run check:content`.
 *
 * FAILS the build when a cover's process note is empty or still contains
 * placeholder copy ("Add how this cover…"), so placeholder text can't ship again.
 *
 * WARNS (does not fail) for owner placeholders like [PRICE] or [REPLY_TIME],
 * so preview deploys still work while John fills them in.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const warnings = [];

// ---- Hard check: cover process notes ---------------------------------------
const coversFile = join(root, "lib/hero-covers.ts");
const coversSrc = readFileSync(coversFile, "utf8");
const coverCalls = [...coversSrc.matchAll(/^\s*cover\(\s*(\d+)\s*,\s*\{([\s\S]*?)\n\s*\}\),/gm)];

if (coverCalls.length === 0) {
  errors.push("lib/hero-covers.ts: no cover(...) entries found — guard pattern may be out of date.");
}

for (const [, num, body] of coverCalls) {
  const title = body.match(/title:\s*["'`](.*?)["'`]/)?.[1] ?? `cover ${num}`;
  const proc = body.match(/process:\s*(["'`])([\s\S]*?)\1\s*,/);
  if (!proc) {
    errors.push(`${title}: missing a process note.`);
    continue;
  }
  const text = proc[2].trim();
  if (text === "") errors.push(`${title}: process note is empty.`);
  if (/add how this cover/i.test(text)) errors.push(`${title}: process note is still placeholder copy.`);
  if (/^\[[A-Z0-9_ ]+\]$/.test(text)) errors.push(`${title}: process note is a [PLACEHOLDER].`);
}

// ---- Soft check: owner placeholders anywhere in source ---------------------
const PLACEHOLDER = /\[(PRICE|PERK|TURNAROUND|REPLY_TIME|N|PAYMENT_TERMS|METRIC_CONTEXT|PLATFORM)\]/g;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "public", "scripts"].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(name)) {
      const lines = readFileSync(full, "utf8").split("\n");
      lines.forEach((line, i) => {
        const hits = line.match(PLACEHOLDER);
        if (hits) warnings.push(`${relative(root, full)}:${i + 1}  ${[...new Set(hits)].join(" ")}`);
      });
    }
  }
}
walk(root);

if (warnings.length) {
  console.warn(`\n⚠  ${warnings.length} owner placeholder(s) still in source (not blocking):`);
  for (const w of warnings) console.warn(`   ${w}`);
}

if (errors.length) {
  console.error("\n✖ Content check failed:");
  for (const e of errors) console.error(`   ${e}`);
  process.exit(1);
}

console.log(`\n✓ Content check passed (${coverCalls.length} covers).`);
