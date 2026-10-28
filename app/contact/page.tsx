import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — start a project",
  description: `Start a design, video or marketing project with ${SITE.name}. Send a brief and get a scope back by email.`,
  alternates: { canonical: "/contact" },
};

const steps = [
  "Send the brief.",
  "I reply to your email with a scope — or a no, if I'm not the right person.",
  "We agree it, and I start.",
];

export default function ContactPage() {
  return (
    <div className="on-paper bg-paper pt-16 pb-28 text-ink sm:pt-24">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <p className="kicker text-slate">Contact</p>
          <h1 className="display display-xl mt-4">Brief me.</h1>
          <p className="mt-7 max-w-[34ch] text-xl leading-relaxed text-body">
            What you need, when you need it, and enough context to quote.
          </p>
          <ol className="mt-10 border-t border-rule">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-5 border-b border-rule py-4.5 leading-normal"
              >
                <span className="pt-0.5 font-mono text-sm text-signal-ink">
                  0{i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-8 leading-relaxed text-slate">
            Prefer a straight email?
            <br />
            <a href={`mailto:${SITE.email}`} className="link text-ink">
              {SITE.email}
            </a>
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
