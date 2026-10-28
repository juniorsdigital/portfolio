import { NextResponse } from "next/server";
import { Resend } from "resend";
import { TOPIC_KEYS, topicId, type TopicKey } from "@/lib/email/broadcasts";
import { welcomeEmail } from "@/lib/email/newsletter";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimited = rateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

/**
 * Adds someone to the mailing list: one Resend segment for everyone, plus a
 * topic per list they picked. Broadcasts go to the segment filtered by topic,
 * and Resend's unsubscribe page lets people drop either list on their own.
 */
export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many sign-ups from here. Try again later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ success: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 120) : "";
  const topics = Array.isArray(body.topics)
    ? TOPIC_KEYS.filter((key) => (body.topics as unknown[]).includes(key))
    : [];

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please add a valid email." }, { status: 400 });
  }
  if (!topics.length) {
    return NextResponse.json(
      { error: "Pick at least one thing to hear about." },
      { status: 400 },
    );
  }

  const key = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const topicIds = topics.map((t) => topicId(t));
  if (!key || !segmentId || topicIds.some((id) => !id)) {
    console.error("Mailing list is not configured: set RESEND_SEGMENT_ID and the RESEND_TOPIC_* ids");
    return NextResponse.json(
      { error: "Sign-ups aren't open yet. Email me directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(key);
  const optIn = topicIds.map((id) => ({ id: id as string, subscription: "opt_in" as const }));

  const created = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
    topics: optIn,
  });

  if (created.error) {
    // Usually the contact already exists. Re-subscribe them and add the lists
    // they ticked, leaving any list they're already on alone.
    const updated = await resend.contacts.update({ email, unsubscribed: false });
    if (updated.error) {
      console.error("Subscribe failed:", created.error, updated.error);
      return NextResponse.json(
        { error: "Could not sign you up. Email me directly." },
        { status: 500 },
      );
    }
    const [segment, topicUpdate] = await Promise.all([
      resend.contacts.segments.add({ email, segmentId }),
      resend.contacts.topics.update({ email, topics: optIn }),
    ]);
    if (topicUpdate.error) {
      console.error("Subscribe failed:", topicUpdate.error);
      return NextResponse.json(
        { error: "Could not sign you up. Email me directly." },
        { status: 500 },
      );
    }
    // Adding a contact to a segment it's already in is not worth failing over.
    if (segment.error) console.warn("Segment add:", segment.error);
  }

  const welcome = welcomeEmail({ topics: topics as TopicKey[] });
  const { error: welcomeError } = await resend.emails.send({
    from: SITE.fromEmail,
    to: [email],
    replyTo: SITE.email,
    subject: welcome.subject,
    html: welcome.html,
    text: welcome.text,
  });
  if (welcomeError) console.error("Welcome email not sent:", welcomeError);

  return NextResponse.json({ success: true });
}
