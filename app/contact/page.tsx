import Link from "next/link";
import { Suspense } from "react";
import { ContactForm, ContactFormFromParams } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { PROCESS } from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact — get a quote",
  description: `Get a fixed quote for graphic design, video editing or marketing from ${SITE.name}, a freelancer in ${SITE.location}. Send a brief and get a scope back by email.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="on-paper bg-paper pt-16 pb-28 text-ink sm:pt-24">
      {/* On phones the form comes straight after the heading; the process sits below it. */}
      <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="kicker text-slate">Contact</p>
          <h1 className="display display-xl mt-4">Brief me.</h1>
          <p className="mt-7 max-w-[34ch] text-xl leading-relaxed text-body">
            What you need, when you need it, and enough context to quote. You
            get a fixed price before any work starts.
          </p>
        </div>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromParams />
          </Suspense>
        </div>
        <div className="lg:sticky lg:top-28 lg:col-start-1 lg:row-start-2 lg:pt-10">
          <ol className="border-t border-rule">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-5 border-b border-rule py-4.5 leading-normal"
              >
                <span className="pt-0.5 font-mono text-sm text-signal-ink">
                  0{i + 1}
                </span>
                <span>
                  <span className="font-semibold">{step.title}.</span>{" "}
                  <span className="text-slate">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 leading-relaxed text-slate">
            Want a ballpark first?{" "}
            <Link href="/services" className="link text-ink">
              See services &amp; pricing
            </Link>
          </p>
          <p className="mt-4 leading-relaxed text-slate">
            Prefer a straight email?
            <br />
            <a href={`mailto:${SITE.email}`} className="link text-ink">
              {SITE.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
