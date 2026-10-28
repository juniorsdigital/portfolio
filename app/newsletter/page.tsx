import Link from "next/link";
import { SubscribeForm } from "@/components/SubscribeForm";
import { NEWSLETTER_ISSUES } from "@/lib/email/newsletter";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Newsletter & work updates",
  description: `Sign up for The Desk, ${SITE.name}'s bi-weekly newsletter on design, video and marketing, and get a heads-up when he opens for new projects.`,
  path: "/newsletter",
});

const lists = [
  {
    title: "The Desk",
    when: "Every other week",
    body: "One project from the inside — the brief, the decision that made it work and what happened — plus one thing you can use on your own brand. Five minutes to read.",
  },
  {
    title: "Work updates",
    when: "Only when it changes",
    body: "A short note when I open up for new projects, start a waitlist or close my books. Subscribers hear before anyone else.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="on-paper bg-paper pt-16 pb-28 text-ink sm:pt-24">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <p className="kicker text-slate">Newsletter</p>
          <h1 className="display display-xl mt-4">Stay in the loop.</h1>
          <p className="mt-7 max-w-[36ch] text-xl leading-relaxed text-body">
            Two lists, pick either or both. No spam, no selling your address,
            and a one-click way out of every email.
          </p>
          <div className="mt-10 border border-rule bg-card p-6 sm:p-8">
            <SubscribeForm />
          </div>
        </div>
        <div>
          <ul className="border-t border-rule">
            {lists.map((l) => (
              <li key={l.title} className="border-b border-rule py-6">
                <p className="kicker text-signal-ink">{l.when}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{l.title}</h2>
                <p className="mt-2 leading-relaxed text-body">{l.body}</p>
              </li>
            ))}
          </ul>
          <h2 className="kicker mt-10 text-slate">Coming up in The Desk</h2>
          <ol className="mt-4 space-y-3">
            {NEWSLETTER_ISSUES.map((issue) => (
              <li key={issue.number} className="flex gap-4 leading-normal">
                <span className="pt-0.5 font-mono text-sm text-signal-ink">
                  {String(issue.number).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-semibold">{issue.subject}.</span>{" "}
                  <span className="text-slate">{issue.previewText}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 leading-relaxed text-slate">
            Have a project now?{" "}
            <Link href="/contact" className="link text-ink">
              Send a brief
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
