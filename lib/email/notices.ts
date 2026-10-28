import { SERVICES, serviceHref, startingPrice } from "@/lib/services";
import {
  abs,
  button,
  escapeHtml,
  h1,
  h2,
  kicker,
  link,
  list,
  listFooter,
  listFooterText,
  p,
  rule,
  shell,
  small,
  type Email,
} from "@/lib/email/layout";

/**
 * Availability notices for the "Work updates" list. Every field is optional:
 * leave them out and the notice still reads right, fill them in and it gets
 * specific ("Booking from 3 November · 2 spots").
 */
export type NoticeOptions = {
  /** When new work can start, e.g. "3 November". */
  from?: string;
  /** How many projects are open. */
  spots?: number;
  /** When the books reopen, e.g. "January". */
  until?: string;
  /** One extra sentence, set under the opener. */
  note?: string;
};

export const NOTICE_KINDS = ["open-for-work", "waitlist", "closed"] as const;
export type NoticeKind = (typeof NOTICE_KINDS)[number];

const FOOTER_REASON = "you asked for work updates";

const servicesHtml = list(
  SERVICES.map((s) => `${link(serviceHref(s), s.name)} — from $${startingPrice(s)}`),
);
const servicesText = SERVICES.map(
  (s) => `- ${s.name}, from $${startingPrice(s)}: ${abs(serviceHref(s))}`,
);

function build({
  label,
  subject,
  previewText,
  headline,
  paragraphs,
  extra = "",
  extraText = [],
  cta,
}: {
  label: string;
  subject: string;
  previewText: string;
  headline: string;
  paragraphs: string[];
  extra?: string;
  extraText?: string[];
  cta: { href: string; label: string };
}): Email {
  const body = [
    kicker(label),
    h1(headline),
    paragraphs.map((t) => p(escapeHtml(t))).join(""),
    extra,
    button(cta.href, cta.label),
    rule(),
    small(
      `Not ready yet? You'll hear from me the next time this changes. In the meantime there's ${link("/work", "plenty of work to look through")}.`,
    ),
    p("— John"),
  ].join("");
  const text = [
    label.toUpperCase(),
    "",
    headline,
    "",
    paragraphs.join("\n\n"),
    "",
    ...extraText,
    "",
    `${cta.label}: ${abs(cta.href)}`,
    "",
    "— John",
    "",
    listFooterText(FOOTER_REASON),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return {
    subject,
    previewText,
    html: shell({ label, previewText, body, footer: listFooter(FOOTER_REASON) }),
    text,
  };
}

const spotsLine = (spots?: number) =>
  spots ? `${spots} ${spots === 1 ? "spot" : "spots"}` : undefined;

export function openForWork({ from, spots, note }: NoticeOptions = {}): Email {
  const when = from ? `from ${from}` : "now";
  const detail = [from && `Starting ${from}`, spotsLine(spots)].filter(Boolean).join(" · ");
  return build({
    label: detail ? `Open for work · ${detail}` : "Open for work",
    subject: spots
      ? `I'm booking new projects — ${spotsLine(spots)} open`
      : "I'm booking new projects",
    previewText: `My calendar has room ${when}. First briefs in get first pick of the dates.`,
    headline: "I'm open for new work.",
    paragraphs: [
      `My calendar has room for new projects ${when}${spots ? ` — ${spotsLine(spots)}, and they go in the order briefs arrive` : ""}.`,
      ...(note ? [note] : []),
      "If you've been holding onto a project, now's the time. Send a brief and you'll get a fixed quote back by email — no calls needed unless you want one.",
    ],
    extra: `${h2("What I can take on")}${servicesHtml}`,
    extraText: ["WHAT I CAN TAKE ON", ...servicesText],
    cta: { href: "/contact", label: "Send a brief" },
  });
}

export function joinWaitlist({ from, spots, note }: NoticeOptions = {}): Email {
  const detail = [from && `Next opening ${from}`, spotsLine(spots)].filter(Boolean).join(" · ");
  return build({
    label: detail ? `Waitlist open · ${detail}` : "Waitlist open",
    subject: from ? `The waitlist is open — next start ${from}` : "The waitlist is open",
    previewText: "I'm fully booked for now, but the next spots go to the waitlist first.",
    headline: "Join the waitlist.",
    paragraphs: [
      `I'm fully booked right now, so new projects go on a waitlist${from ? ` for ${from}` : ""}${spots ? ` — ${spotsLine(spots)} when it opens` : ""}.`,
      ...(note ? [note] : []),
      "Getting on it is the same as starting a project: send a brief. I'll quote it, hold your place in line, and you'll get first pick of the dates before anything opens to the public.",
      "No deposit to join, and no obligation to book if the timing no longer suits you.",
    ],
    cta: { href: "/contact", label: "Join the waitlist" },
  });
}

export function noLongerAccepting({ until, note }: NoticeOptions = {}): Email {
  return build({
    label: until ? `Books closed · Until ${until}` : "Books closed",
    subject: until ? `Not taking new clients until ${until}` : "I'm not taking new clients right now",
    previewText: "My books are closed to new projects for now. Here's what that means for you.",
    headline: "No longer accepting new clients.",
    paragraphs: [
      `My calendar is full, so I've closed my books to new projects${until ? ` until ${until}` : " for now"}. Current clients aren't affected.`,
      ...(note ? [note] : []),
      "If you have something planned for later, send the brief anyway. I'll read it, and you'll be the first to hear when I reopen.",
      `You're still on this list, so you'll get an email the moment that happens.`,
    ],
    cta: { href: "/contact", label: "Send a brief for later" },
  });
}

export function notice(kind: NoticeKind, options?: NoticeOptions): Email {
  switch (kind) {
    case "open-for-work":
      return openForWork(options);
    case "waitlist":
      return joinWaitlist(options);
    case "closed":
      return noLongerAccepting(options);
  }
}
