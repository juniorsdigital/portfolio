import type { ServiceValue } from "@/lib/offerings";
import { CASE_STUDIES } from "@/lib/projects";
import { PROCESS } from "@/lib/services";
import { SITE } from "@/lib/site";
import {
  abs,
  button,
  caseStudyText,
  escapeHtml,
  h1,
  h2,
  kicker,
  link,
  p,
  rows,
  rule,
  shell,
  small,
  workCard,
  type Email,
} from "@/lib/email/layout";

/** Case studies for the service they asked about first, then the strongest of the rest. */
function workFor(service: ServiceValue, count = 3) {
  const lead = ["ryzagrow", "ovani", "she-who-flies", "bgcb", "winter-heroes"];
  const ranked = [...CASE_STUDIES].sort(
    (a, b) =>
      Number(b.service === service) - Number(a.service === service) ||
      lead.indexOf(a.id) - lead.indexOf(b.id),
  );
  return ranked.slice(0, count);
}

/**
 * Sent to the client the moment their brief lands, so they know it arrived
 * and have something to look at while the quote is written.
 */
export function briefReceipt({
  name,
  service,
  serviceLabel,
  summary,
  brief,
}: {
  name: string;
  service: ServiceValue;
  serviceLabel: string;
  /** The same label/value rows that went into the notification. */
  summary: [string, string][];
  brief: string;
}): Email {
  const first = name.split(/\s+/)[0];
  const work = workFor(service);
  const subject = "I received your brief — here's some work while you wait";
  const previewText = `Thanks, ${first}. Your ${serviceLabel.toLowerCase()} brief is in. A fixed quote is on the way.`;
  const steps = PROCESS.slice(1);

  const body = [
    kicker("Brief received"),
    h1(`Got it, ${escapeHtml(first)}.`),
    p(
      `I received your briefing! Here's some of my work you can check out while you wait for a quote. I read every brief myself, so the quote comes straight from me.`,
    ),
    h2("What happens next"),
    steps
      .map((s, i) =>
        p(
          `<span style="color:#b83d0e;font-family:Menlo,Consolas,monospace;font-size:13px;">0${i + 2}</span>&nbsp; <strong>${s.title}.</strong> ${s.body}`,
        ),
      )
      .join(""),
    h2("While you wait"),
    small(`A few projects close to what you asked for.`),
    work.map((project) => workCard(project)).join(""),
    button("/work", "See all the work"),
    rule(),
    h2("What you sent"),
    rows(summary),
    small("Brief"),
    `<p style="margin:0 0 16px;color:#3a3934;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(brief)}</p>`,
    small(
      `Need to add something or fix a detail? Just reply to this email — it comes straight to me. Or ${link("/services", "look over services &amp; pricing")} in the meantime.`,
    ),
    p(`— John`),
  ].join("");

  const text = [
    `Got it, ${first}.`,
    "",
    "I received your briefing! Here's some of my work you can check out while you wait for a quote. I read every brief myself, so the quote comes straight from me.",
    "",
    "WHAT HAPPENS NEXT",
    ...steps.map((s, i) => `0${i + 2} ${s.title}. ${s.body}`),
    "",
    "WHILE YOU WAIT",
    ...work.map((project) => `${caseStudyText(project)}\n`),
    `All the work: ${abs("/work")}`,
    "",
    "WHAT YOU SENT",
    ...summary.map(([label, value]) => `${label}: ${value}`),
    "",
    "Brief:",
    brief,
    "",
    "Need to add something? Just reply to this email — it comes straight to me.",
    "",
    "— John",
    `${SITE.name} · ${SITE.url}`,
  ].join("\n");

  return {
    subject,
    previewText,
    html: shell({ label: `Brief received · ${serviceLabel}`, previewText, body }),
    text,
  };
}
