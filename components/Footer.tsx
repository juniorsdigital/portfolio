import Link from "next/link";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Wordmark } from "@/components/Wordmark";
import { CASE_STUDIES, projectHref } from "@/lib/projects";
import { SERVICES, serviceHref } from "@/lib/services";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="wrap pt-18 pb-12">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_0.7fr_1fr_1.1fr_1.3fr]">
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="text-[2.5rem]" aria-label={`${SITE.name} — home`}>
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-sm text-stone">
              {SITE.byline}
              <br />
              Based in {SITE.location}, working everywhere.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="kicker text-stone">Site</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              {NAV_LINKS.filter((link) => link.href !== "/services").map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brand" className="hover:underline">
                  Brand system
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Services">
            <p className="kicker text-stone">Services</p>
            <ul className="mt-4 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s)} className="hover:underline">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Case studies">
            <p className="kicker text-stone">Case studies</p>
            <ul className="mt-4 space-y-3">
              {CASE_STUDIES.map((p) => (
                <li key={p.id}>
                  <Link href={projectHref(p)} className="hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="kicker text-stone">Contact</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${SITE.email}`} className="break-all hover:underline">
                  {SITE.email}
                </a>
              </li>
              <li className="text-stone">{SITE.location}, PA</li>
              <li>
                <Link href="/contact" className="link">
                  Get a quote <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div>
            <p className="kicker text-stone">Stay in the loop</p>
            <p className="mt-3 max-w-[30ch] text-2xl leading-snug font-bold">
              New work every other week, and a heads-up when I open for projects.
            </p>
            <Link href="/newsletter" className="link mt-4 inline-block text-stone">
              What you&apos;ll get
            </Link>
          </div>
          <SubscribeForm tone="ink" />
        </div>
        <p className="kicker mt-14 border-t border-line pt-6 font-normal text-stone">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
