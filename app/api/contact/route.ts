import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_OPTIONS,
  SERVICE_NEEDS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  type ServiceValue,
} from "@/lib/offerings";
import { escapeHtml } from "@/lib/email/layout";
import { briefReceipt } from "@/lib/email/receipt";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimited = rateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

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
  const rows: [string, string][] = [
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
          <td style="padding:10px 0;border-bottom:1px solid #e8e4da;color:#55534d;font-family:Menlo,Consolas,monospace;font-size:13px;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e4da;color:#0f0f0d;font-size:16px;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const { error } = await resend.emails.send({
    from: SITE.fromEmail,
    to: [SITE.email],
    replyTo: email,
    subject: `New brief — ${brand || name} (${serviceLabel})`,
    html: `
      <div style="margin:0;background:#f3f0e9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #d3cec2;">
          <tr>
            <td style="padding:24px 28px;background:#0f0f0d;">
              <div style="color:#f3f0e9;font-size:20px;font-weight:800;letter-spacing:-0.01em;">John Swanson<span style="color:#ff5a1f;">.</span></div>
              <div style="color:#a9a59c;font-family:Menlo,Consolas,monospace;font-size:13px;margin-top:6px;">New project brief · ${escapeHtml(serviceLabel)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">${htmlRows}</table>
              <p style="margin:28px 0 8px;color:#55534d;font-family:Menlo,Consolas,monospace;font-size:13px;">Brief</p>
              <p style="margin:0;color:#3a3934;font-size:16px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(brief)}</p>
              <p style="margin:28px 0 0;"><a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#ff5a1f;color:#0f0f0d;font-weight:700;font-size:16px;text-decoration:none;padding:14px 22px;">Reply to ${escapeHtml(name)} →</a></p>
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

  // The brief is already in my inbox, so a failed receipt is logged, not
  // reported. Links stay out of it: this goes to whatever address was typed.
  const receipt = briefReceipt({
    name,
    service: service as ServiceValue,
    serviceLabel,
    summary: rows.filter(([label]) => label !== "Email" && label !== "Links"),
    brief,
  });
  const { error: receiptError } = await resend.emails.send({
    from: SITE.fromEmail,
    to: [email],
    replyTo: SITE.email,
    subject: receipt.subject,
    html: receipt.html,
    text: receipt.text,
  });
  if (receiptError) console.error("Receipt not sent:", receiptError);

  return NextResponse.json({ success: true });
}
