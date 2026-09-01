import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_OPTIONS,
  SERVICE_NEEDS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  type ServiceValue,
} from "@/lib/offerings";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hits = new Map<string, number[]>();

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asString(value: unknown, max = 4000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

const serviceValues = SERVICE_OPTIONS.map((s) => s.value);
const allNeeds = Array.from(
  new Set(Object.values(SERVICE_NEEDS).flat()),
);

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many messages. Email me directly." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (asString(body.company_website, 200)) {
    return NextResponse.json({ success: true });
  }

  const name = asString(body.name, 80);
  const email = asString(body.email, 120).toLowerCase();
  const phone = asString(body.phone, 40);
  const service = asString(body.service, 40) as ServiceValue | "";
  const brand = asString(body.brand, 120);
  const brief = asString(body.brief, 5000);
  const timeline = asString(body.timeline, 40);
  const budget = asString(body.budget, 40);
  const links = asString(body.links, 2000);
  const needs = Array.isArray(body.needs)
    ? body.needs
        .filter((n): n is string => typeof n === "string")
        .map((n) => n.trim())
        .filter((n) => allNeeds.includes(n))
        .slice(0, 12)
    : [];

  if (name.length < 2) {
    return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please add a valid email." },
      { status: 400 },
    );
  }
  if (!serviceValues.includes(service as ServiceValue)) {
    return NextResponse.json(
      { error: "Please choose a service." },
      { status: 400 },
    );
  }
  if (brief.length < 10) {
    return NextResponse.json(
      { error: "Please add a bit more in the brief." },
      { status: 400 },
    );
  }
  if (timeline && !(TIMELINE_OPTIONS as readonly string[]).includes(timeline)) {
    return NextResponse.json({ error: "Invalid timeline." }, { status: 400 });
  }
  if (budget && !(BUDGET_OPTIONS as readonly string[]).includes(budget)) {
    return NextResponse.json({ error: "Invalid budget." }, { status: 400 });
  }

  const serviceLabel =
    SERVICE_OPTIONS.find((s) => s.value === service)?.label || service;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Mail is not configured yet. Email me directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(key);
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Service", serviceLabel],
    ["Specifics", needs.length ? needs.join(", ") : "—"],
    ["Brand / project", brand || "—"],
    ["Timeline", timeline || "—"],
    ["Budget", budget || "—"],
    ["Links", links || "—"],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#8a8680;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#e6e1d6;font-size:15px;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from: SITE.fromEmail,
    to: [SITE.email],
    replyTo: email,
    subject: `New brief — ${brand || name} (${serviceLabel})`,
    html: `
      <div style="margin:0;background:#070809;padding:32px 16px;font-family:Arial,sans-serif;">
        <table role="presentation" style="max-width:640px;margin:0 auto;background:#101114;border:1px solid rgba(196,163,90,0.35);">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid rgba(196,163,90,0.25);">
              <div style="color:#c4a35a;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">John Swanson</div>
              <div style="color:#e6e1d6;font-size:22px;font-weight:800;margin-top:8px;">New project brief</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">${htmlRows}</table>
              <p style="margin:24px 0 8px;color:#8a8680;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Brief</p>
              <p style="margin:0;color:#e6e1d6;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(brief)}</p>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: [
      `New project brief from ${name} <${email}>`,
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Brief:",
      brief,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Could not send. Email me directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
