import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${SITE.name}. Design, video, and marketing.`,
};

export default function ContactPage() {
  return (
    <div className="section-pad pt-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="label-kicker">Contact</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            Brief me.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            What you need, when you need it, and enough context to quote.
            I&apos;ll reply to the email you leave here.
          </p>
          <p className="mt-8 text-sm text-muted">
            Prefer a straight email?
            <br />
            <a
              href={`mailto:${SITE.email}`}
              className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt"
            >
              {SITE.email}
            </a>
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
