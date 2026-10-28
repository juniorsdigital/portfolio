import { NEWSLETTER_ISSUES, newsletterIssue } from "@/lib/email/newsletter";
import { NOTICE_KINDS, notice, type NoticeKind, type NoticeOptions } from "@/lib/email/notices";
import type { Email } from "@/lib/email/layout";
import { TOPICS, type TopicKey } from "@/lib/email/topics";

export { TOPIC_KEYS, TOPICS, type TopicKey } from "@/lib/email/topics";

export function topicId(key: TopicKey) {
  return process.env[TOPICS[key].env];
}

export type BroadcastEntry = {
  id: string;
  topic: TopicKey;
  name: string;
  render: (options?: NoticeOptions) => Email;
};

const NOTICE_NAMES: Record<NoticeKind, string> = {
  "open-for-work": "Open for work",
  waitlist: "Join the waitlist",
  closed: "No longer accepting clients",
};

/** Every pre-made email that goes to the list, by the id the broadcast API takes. */
export const BROADCASTS: BroadcastEntry[] = [
  ...NEWSLETTER_ISSUES.map((issue) => ({
    id: `newsletter-${issue.number}`,
    topic: "newsletter" as const,
    name: `The Desk No. ${String(issue.number).padStart(2, "0")} — ${issue.subject}`,
    render: () => newsletterIssue(issue.number),
  })),
  ...NOTICE_KINDS.map((kind) => ({
    id: kind,
    topic: "availability" as const,
    name: NOTICE_NAMES[kind],
    render: (options?: NoticeOptions) => notice(kind, options),
  })),
];

export function findBroadcast(id: string) {
  return BROADCASTS.find((b) => b.id === id);
}
