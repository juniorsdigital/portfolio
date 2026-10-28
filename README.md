# John Swanson — portfolio

Freelance graphic design, video editing, and marketing. Philadelphia.

## Develop

```bash
npm install
npm run dev
```

Contact form delivery uses Resend. Set `RESEND_API_KEY` in the environment. Mail is sent to `johnreidswanson@gmail.com` from `hello@johnswanson.co`, which must be verified in Resend (DNS records live at the Namecheap registrar for johnswanson.co).

Every brief also sends the client a receipt ("I received your briefing! Here's some of my work…") with three case studies picked for the service they chose. A failed receipt is logged and never blocks the brief.

## Mailing list

Sign-ups (footer and `/newsletter`) go to Resend as contacts in one segment, opted in to one or both topics:

| Env var | What it is |
| --- | --- |
| `RESEND_SEGMENT_ID` | A Resend segment for all subscribers, e.g. "Subscribers" |
| `RESEND_TOPIC_NEWSLETTER` | Topic for **The Desk**, the bi-weekly newsletter |
| `RESEND_TOPIC_UPDATES` | Topic for **Work updates** (open / waitlist / closed notices) |
| `BROADCAST_SECRET` | Any random string of 16+ characters; guards `/api/broadcast` |

Create the segment and both topics in the Resend dashboard (topics: default subscription *opt out*, so people only get what they ticked), then paste the ids into Vercel.

### Pre-made emails

| id | What |
| --- | --- |
| `newsletter-1` … `newsletter-5` | The Desk, issues 1–5 (`lib/email/newsletter.ts`). Send one every other week. |
| `open-for-work` | "I'm open for new work" — takes `from` and `spots` |
| `waitlist` | "Join the waitlist" — takes `from` and `spots` |
| `closed` | "No longer accepting new clients" — takes `until` |

Every notice also takes `note`, one extra sentence. Preview all of them, plus the brief receipt and welcome email, at `http://localhost:3000/api/broadcast` while `npm run dev` is running.

Send yourself a test first:

```bash
curl -X POST https://www.johnswanson.co/api/broadcast \
  -H "Authorization: Bearer $BROADCAST_SECRET" -H "Content-Type: application/json" \
  -d '{"id":"newsletter-1","test":"johnreidswanson@gmail.com"}'
```

Then create the broadcast. Without `"send": true` it lands as a **draft** in Resend → Broadcasts, to check and send from there:

```bash
curl -X POST https://www.johnswanson.co/api/broadcast \
  -H "Authorization: Bearer $BROADCAST_SECRET" -H "Content-Type: application/json" \
  -d '{"id":"open-for-work","from":"3 November","spots":2}'
```

Add `"send": true` to send straight away, and `"scheduledAt": "in 2 days"` (or an ISO date) to schedule it. Broadcasts go only to contacts opted in to that email's topic, and Resend fills in each one's unsubscribe link.
