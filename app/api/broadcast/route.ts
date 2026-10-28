import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { BROADCASTS, findBroadcast, topicId } from "@/lib/email/broadcasts";
import { UNSUBSCRIBE_URL, escapeHtml } from "@/lib/email/layout";
import { welcomeEmail } from "@/lib/email/newsletter";
import type { NoticeOptions } from "@/lib/email/notices";
import { briefReceipt } from "@/lib/email/receipt";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Sends the pre-made newsletter issues and availability notices to the list.
 * Owner-only: every request needs `Authorization: Bearer $BROADCAST_SECRET`.
 * Previews (GET) are also open on `next dev`. See README → Mailing list.
 */
function authorized(req: Request) {
  const secret = process.env.BROADCAST_SECRET;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || secret.length < 16) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function noticeOptions(source: Record<string, unknown> | URLSearchParams): NoticeOptions {
  const get = (k: string) =>
    source instanceof URLSearchParams ? source.get(k) ?? undefined : source[k];
  const str = (k: string) => {
    const v = get(k);
    return typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : undefined;
  };
  const spots = Number(get("spots"));
  return {
    from: str("from"),
    until: str("until"),
    note: str("note"),
    spots: Number.isInteger(spots) && spots > 0 ? spots : undefined,
  };
}

/** One-to-one emails, previewed with sample data. They never go to the list. */
const TRANSACTIONAL = {
  receipt: {
    name: "Brief receipt (sent to the client)",
    render: () =>
      briefReceipt({
        name: "Sam Rivera",
        service: "graphic-design",
        serviceLabel: "Graphic design",
        summary: [
          ["Name", "Sam Rivera"],
          ["Phone", "—"],
          ["Service", "Graphic design"],
          ["Specifics", "Product cover design"],
          ["Brand / project", "Nightfall Audio"],
          ["Timeline", "1–2 weeks"],
          ["Budget", "$500–1.5k"],
        ],
        brief: "Four covers for a new run of synthwave sample packs, plus 3D box renders for the store.",
      }),
  },
  welcome: {
    name: "Welcome (sent on sign-up)",
    render: () => welcomeEmail({ topics: ["newsletter", "availability"] }),
  },
};

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development" && !authorized(req)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    const transactional = Object.entries(TRANSACTIONAL).map(
      ([key, t]) =>
        `<li><a href="?id=${key}">${escapeHtml(t.name)}</a> <small>· <a href="?id=${key}&format=text">text</a></small></li>`,
    );
    const items = BROADCASTS.map(
      (b) =>
        `<li><a href="?id=${b.id}">${escapeHtml(b.name)}</a> <small>(${b.topic}) · <a href="?id=${b.id}&format=text">text</a></small></li>`,
    ).join("");
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Email previews</title><body style="font-family:system-ui;padding:24px;line-height:1.8"><h1>Email previews</h1><h2>To the list</h2><ul>${items}</ul><h2>One-to-one</h2><ul>${transactional.join("")}</ul><p>Notices take <code>?from=</code>, <code>?spots=</code>, <code>?until=</code> and <code>?note=</code>.</p></body>`,
      { headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const entry = Object.hasOwn(TRANSACTIONAL, id) ? TRANSACTIONAL[id as keyof typeof TRANSACTIONAL] : findBroadcast(id);
  if (!entry) return NextResponse.json({ error: `Unknown id "${id}".` }, { status: 404 });
  const email = entry.render(noticeOptions(url.searchParams));
  if (url.searchParams.get("format") === "text") {
    return new Response(`Subject: ${email.subject}\nPreview: ${email.previewText}\n\n${email.text}`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(email.html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const entry = typeof body.id === "string" ? findBroadcast(body.id) : undefined;
  if (!entry) {
    return NextResponse.json(
      { error: "Unknown id.", ids: BROADCASTS.map((b) => b.id) },
      { status: 400 },
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "RESEND_API_KEY is not set." }, { status: 503 });
  const resend = new Resend(key);
  const email = entry.render(noticeOptions(body));

  // A test goes to one inbox as a normal email. Resend only fills the
  // unsubscribe link on broadcasts, so point it at the sign-up page instead.
  if (typeof body.test === "string") {
    const fallback = `${SITE.url}/newsletter`;
    const { data, error } = await resend.emails.send({
      from: SITE.fromEmail,
      to: [body.test],
      replyTo: SITE.email,
      subject: `[Test] ${email.subject}`,
      html: email.html.replaceAll(UNSUBSCRIBE_URL, fallback),
      text: email.text.replaceAll(UNSUBSCRIBE_URL, fallback),
    });
    if (error) return NextResponse.json({ error }, { status: 502 });
    return NextResponse.json({ success: true, test: body.test, emailId: data?.id });
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const topic = topicId(entry.topic);
  if (!segmentId || !topic) {
    return NextResponse.json(
      { error: "Set RESEND_SEGMENT_ID and the RESEND_TOPIC_* ids first." },
      { status: 503 },
    );
  }

  const send = body.send === true;
  const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : undefined;
  const base = {
    name: entry.name,
    segmentId,
    topicId: topic,
    from: SITE.fromEmail,
    replyTo: SITE.email,
    subject: email.subject,
    previewText: email.previewText,
    html: email.html,
    text: email.text,
  };
  // Without `send: true` this only creates a draft, to check over in the
  // Resend dashboard and send from there.
  const { data, error } = send
    ? await resend.broadcasts.create({ ...base, send: true, scheduledAt })
    : await resend.broadcasts.create(base);
  if (error) return NextResponse.json({ error }, { status: 502 });

  return NextResponse.json({
    success: true,
    broadcastId: data?.id,
    status: send ? (scheduledAt ? `scheduled for ${scheduledAt}` : "sending") : "draft",
  });
}
