import { SITE } from "@/lib/site";
import {
  abs,
  button,
  caseStudy,
  caseStudyText,
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
  stat,
  workCard,
  type Email,
} from "@/lib/email/layout";

/**
 * The bi-weekly newsletter. Five ready-to-send issues, each built the same way:
 * a short opener, one project told from the inside, one thing the reader can
 * use on their own work, and a line on how to book.
 *
 * Copy is plain text with *emphasis* and [links](/path); the renderer turns it
 * into HTML for the email and keeps it readable in the text part.
 */
type Issue = {
  number: number;
  subject: string;
  previewText: string;
  headline: string;
  opener: string[];
  feature: {
    project: string;
    title: string;
    paragraphs: string[];
    stat?: { value: string; label: string };
  };
  takeaway: { title: string; paragraphs: string[]; points?: string[] };
  closer: string;
  cta: { href: string; label: string };
};

export const NEWSLETTER_ISSUES: Issue[] = [
  {
    number: 1,
    subject: "Two pods, twice the sales",
    previewText: "How a grow kit campaign doubled sales — and the one rule behind the product photos.",
    headline: "Two pods. Twice the sales.",
    opener: [
      "Thanks for signing up. Every other week I'll send one project from the inside — the brief, the decision that made it work and what happened — plus one thing you can steal for your own brand. Short enough to read with your coffee.",
      "First up: the campaign that doubled sales for a mushroom grow kit.",
    ],
    feature: {
      project: "ryzagrow",
      title: "Let the product tell people which one to buy",
      paragraphs: [
        "Ryza sells two RyzaPods: one for manure-loving mushrooms, one for wood-loving ones. Same jar, different substrate. On a product page that's a spec line most people skip — and picking the wrong kit means a failed harvest.",
        "So the substrate became the creative. Manure-loving got terracotta, wheat and river stone. Wood-loving got cream, birch and moss. You know which pod you need before you've read the label, on the site *and* in a two-second scroll.",
        "I ran the campaign end to end — plan, content and social direction — across owned media only. No retailer, no shelf. Sales doubled.",
      ],
      stat: { value: "2×", label: "sales for RyzaGrow after the direct-to-consumer campaign" },
    },
    takeaway: {
      title: "Steal this: show the difference, not the spec",
      paragraphs: [
        "If you sell more than one version of something, the photo should answer “which one is mine?” before the copy does. Give each version its own world:",
      ],
      points: [
        "One color family per version, used everywhere that version appears.",
        "Props that say what it's *for*, not what it's made of.",
        "The same layout for both, so the only thing that changes is the thing that matters.",
      ],
    },
    closer: "Got two products that look the same in a feed? That's a one-week fix.",
    cta: { href: "/services/marketing", label: "See marketing services" },
  },
  {
    number: 2,
    subject: "30 covers in one week",
    previewText: "What it takes to ship 30 distinct product covers in a week — and the squint test every cover has to pass.",
    headline: "30 covers. One week.",
    opener: [
      "Two weeks ago it was grow kits. This time: the busiest week I've had at a desk.",
    ],
    feature: {
      project: "ovani",
      title: "A cover has to sell a sound you can't hear yet",
      paragraphs: [
        "OvaniSound sells music packs for game developers. Nobody can press play from a store grid, so the cover does all the selling — and it has to say *horror* or *funk* or *ambient* before anyone reads the title.",
        "Since 2025 I've designed more than 75 of them across 32+ genres. At the peak, 30 distinct covers shipped in a single week, each one finished, rendered as a 3D box and store-ready.",
        "The trick to that pace isn't speed. It's a system: every cover is one strong scene for the front and a second piece of art for the side-panel, built from licensed images, composited and hand-painted until it reads as one world. The catalog moved off AI art doing exactly this.",
      ],
      stat: { value: "30", label: "distinct product covers for OvaniSound in a single week" },
    },
    takeaway: {
      title: "Steal this: the squint test",
      paragraphs: [
        "Shrink your cover, thumbnail or ad to the size it'll actually be seen at — usually smaller than your thumb — and squint. If you can still tell what it is and what it's for, it works. If you can only see a blur and a logo, it doesn't.",
        "Most designs fail this because they're judged full-screen on the designer's monitor. Judge them where they'll live.",
      ],
    },
    closer: "Launching a series, a catalog or a run of releases? Covers start at $120 each.",
    cta: { href: "/services/graphic-design", label: "See cover pricing" },
  },
  {
    number: 3,
    subject: "7.7K views, $0 spent",
    previewText: "A trailer recut that found 7.7K organic views — and why the quiet moments matter more than the big ones.",
    headline: "7.7K views. $0 spent.",
    opener: ["This issue is about video — specifically, why people press play and why they stay."],
    feature: {
      project: "she-who-flies",
      title: "Hold back, then let it fly",
      paragraphs: [
        "She Who Flies is a Red Bull documentary about a skier. I took the footage and recut it as my own trailer — a self-initiated concept, not a commission. New structure, new pacing and a custom title treatment.",
        "The footage was already beautiful. The job was restraint: what to show, what to hold back, and where the music hits. Cuts follow the beat, and quiet holds before the drop make the airtime land harder.",
        "It found 7.7K views with no ad spend behind it. That's the real test of a trailer: people chose to watch it.",
      ],
      stat: { value: "7.7K", label: "organic views on the She Who Flies trailer recut" },
    },
    takeaway: {
      title: "Steal this: earn the first two seconds",
      paragraphs: ["Before you post your next video, check the first two seconds on mute:"],
      points: [
        "Does it open on the moment, not the setup? Cut the logo intro.",
        "Would it make sense to someone who's never heard of you?",
        "Is there one beat of quiet before the best shot? Contrast is what makes it hit.",
      ],
    },
    closer: "Sitting on footage that deserves a better cut? Social edits start at $60 a clip.",
    cta: { href: "/services/video-editing", label: "See video editing" },
  },
  {
    number: 4,
    subject: "Readable at 60 mph",
    previewText: "The four rules from a billboard campaign that make every format easier — even an Instagram post.",
    headline: "Readable at 60 mph.",
    opener: [
      "A billboard gets about three seconds from a passing car. Design for that and every other format gets easier. Here's a campaign built from the billboard down.",
    ],
    feature: {
      project: "bgcb",
      title: "Sell the passion, not the program",
      paragraphs: [
        "The Boys & Girls Club of Boston wanted more teens through the doors of its teen center. Teens can smell an ad, so the campaign couldn't sound like a parent or an institution.",
        "Instead of listing activities, one line did the work: *Put your passion into action.* It sells what teens already love — music, sport, art — and makes the Club the place to do it. Torn paper, marker headlines and cut-out photos gave it zine energy.",
        "The billboard set the rules — short headline, one hero photo, the logo, a QR code straight to registration — and the print and social pieces were built from the same parts.",
      ],
    },
    takeaway: {
      title: "Steal this: the billboard rules",
      paragraphs: ["Run your next poster, ad or post through these four. If it breaks one, cut until it doesn't:"],
      points: [
        "A headline of about four words.",
        "One image. Not a collage.",
        "One logo, small.",
        "One next step — and make it a phone camera away.",
      ],
    },
    closer: "Planning a campaign that has to work on a wall, a flyer and a feed? That's the campaign kit.",
    cta: { href: "/services/graphic-design", label: "See the campaign kit" },
  },
  {
    number: 5,
    subject: "The cheapest content you'll ever make",
    previewText: "You've already shot it. How one long-form film becomes a month of short-form posts.",
    headline: "Cut once. Publish many.",
    opener: [
      "Five issues in. This one's the most practical yet, because the content in it is free — you've probably already made it.",
    ],
    feature: {
      project: "winter-heroes",
      title: "Long-form doesn't travel. Moments do.",
      paragraphs: [
        "Winter Heroes is a winter sports documentary concept I edited and directed from Red Bull Media House footage. A documentary earns its runtime on YouTube. In a social feed it gets a second, maybe two.",
        "So after the long cut, I went back through for the moments that work alone — a run, a fall, a line of dialogue, a view — and edited each one as its own piece, with its own hook and ending, sized for its channel.",
        "Every short points back to the full film. No new shoot, no new budget line.",
      ],
    },
    takeaway: {
      title: "Steal this: mine what you already have",
      paragraphs: [
        "Open the last long video you made — a webinar, a talk, a product demo, an event recap — and list every moment that would make sense to a stranger with no context. Most 10-minute videos hold five to eight of them.",
        "Repurposing isn't trimming, though. Each clip needs its own first second. Start on the moment, not the lead-up.",
      ],
    },
    closer:
      "Have a long video and an empty content calendar? Send it over and I'll tell you how many posts are hiding in it.",
    cta: { href: "/contact?service=video-editing", label: "Send me the footage" },
  },
];

/** *emphasis* and [text](/href) → HTML. Input is our own copy, not user input. */
function inline(text: string) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t: string, href: string) => link(href, t))
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function plain(text: string) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t: string, href: string) => `${t} (${abs(href)})`)
    .replace(/\*([^*]+)\*/g, "$1");
}

const FOOTER_REASON = "you signed up for the newsletter";

export function newsletterIssue(number: number): Email {
  const issue = NEWSLETTER_ISSUES.find((i) => i.number === number);
  if (!issue) throw new Error(`No newsletter issue ${number}`);
  const project = caseStudy(issue.feature.project);
  const label = `The Desk · No. ${String(issue.number).padStart(2, "0")}`;

  const body = [
    kicker(label),
    h1(issue.headline),
    issue.opener.map((t) => p(inline(t))).join(""),
    h2(issue.feature.title),
    issue.feature.paragraphs.map((t) => p(inline(t))).join(""),
    issue.feature.stat ? stat(issue.feature.stat.value, issue.feature.stat.label) : "",
    workCard(project),
    rule(),
    h2(issue.takeaway.title),
    issue.takeaway.paragraphs.map((t) => p(inline(t))).join(""),
    issue.takeaway.points ? list(issue.takeaway.points.map(inline)) : "",
    rule(),
    p(inline(issue.closer)),
    button(issue.cta.href, issue.cta.label),
    small(
      `Know someone who'd like this? Forward it — they can sign up at ${link("/newsletter", "johnswanson.co/newsletter")}.`,
    ),
    p("— John"),
  ].join("");

  const text = [
    label.toUpperCase(),
    "",
    issue.headline,
    "",
    issue.opener.map(plain).join("\n\n"),
    "",
    issue.feature.title.toUpperCase(),
    issue.feature.paragraphs.map(plain).join("\n\n"),
    issue.feature.stat ? `${issue.feature.stat.value} — ${issue.feature.stat.label}` : "",
    "",
    caseStudyText(project),
    "",
    issue.takeaway.title.toUpperCase(),
    issue.takeaway.paragraphs.map(plain).join("\n\n"),
    ...(issue.takeaway.points ?? []).map((pt) => `- ${plain(pt)}`),
    "",
    plain(issue.closer),
    `${issue.cta.label}: ${abs(issue.cta.href)}`,
    "",
    `Forward it on — sign up at ${abs("/newsletter")}`,
    "",
    "— John",
    "",
    listFooterText(FOOTER_REASON),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return {
    subject: issue.subject,
    previewText: issue.previewText,
    html: shell({ label, previewText: issue.previewText, body, footer: listFooter(FOOTER_REASON) }),
    text,
  };
}

/** Sent once, right after someone signs up. */
export function welcomeEmail({ topics }: { topics: ("newsletter" | "availability")[] }): Email {
  const wantsNews = topics.includes("newsletter");
  const wantsAvailability = topics.includes("availability");
  const what = [
    wantsNews && "*The Desk* — one project from the inside and one thing you can use, every other week",
    wantsAvailability && "*Work updates* — a short note when I open up for new projects, start a waitlist or close my books",
  ].filter((x): x is string => Boolean(x));
  const previewText = "You're on the list. Here's what you'll get, and how often.";
  const body = [
    kicker("You're on the list"),
    h1("Thanks for signing up."),
    p("Here's what's coming your way:"),
    list(what.map(inline)),
    p(
      "No spam, no selling your address, and every list email has a one-click unsubscribe link at the bottom. If you ever want to talk about a project, just reply.",
    ),
    button("/work", "See the work so far"),
    p("— John"),
  ].join("");
  const text = [
    "Thanks for signing up.",
    "",
    "Here's what's coming your way:",
    ...what.map((w) => `- ${plain(w)}`),
    "",
    "No spam, no selling your address, and every list email has a one-click unsubscribe link at the bottom. If you ever want to talk about a project, just reply.",
    "",
    `See the work so far: ${abs("/work")}`,
    "",
    "— John",
    `${SITE.name} · ${SITE.url}`,
  ].join("\n");
  return {
    subject: "You're on the list",
    previewText,
    html: shell({ label: "Subscribed", previewText, body }),
    text,
  };
}
