/**
 * The two things people can sign up for. Each maps to a Resend topic whose id
 * lives in the named env var. Safe to import from client components.
 */
export const TOPICS = {
  newsletter: {
    label: "The Desk — bi-weekly newsletter",
    hint: "One project from the inside and one thing you can use, every other week.",
    env: "RESEND_TOPIC_NEWSLETTER",
  },
  availability: {
    label: "Work updates",
    hint: "A short note when I open up for projects, start a waitlist or close my books.",
    env: "RESEND_TOPIC_UPDATES",
  },
} as const;
export type TopicKey = keyof typeof TOPICS;
export const TOPIC_KEYS = Object.keys(TOPICS) as TopicKey[];
