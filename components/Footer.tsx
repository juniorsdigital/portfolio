import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { CASE_STUDIES, projectHref } from "@/lib/projects";
import { SERVICES, serviceHref } from "@/lib/services";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="wrap pt-18 pb-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-[2.5rem]" aria-label={`${SITE.name} — home`}>
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-sm text-stone">{SITE.byline}</p>
            <ul className="mt-6 space-y-3">
              <li>
                <a href={`mailto:${SITE.email}`} className="break-all hover:underline">
                  {SITE.email}
                </a>
              </li>
              <li className="text-stone">{SITE.location}, PA — working worldwide</li>
              <li>
                <Link href="/contact" className="link">
                  Get a quote <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
            {SOCIAL_LINKS.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Profiles">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} rel="me noopener" target="_blank" className="hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <nav aria-label="Services">
            <p className="kicker text-stone">Services</p>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/cover-art" className="hover:underline">
                  Cover art for packs
                </Link>
              </li>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s)} className="hover:underline">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="hover:underline">
                  All services &amp; pricing
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Work">
            <p className="kicker text-stone">Work</p>
            <ul className="mt-4 space-y-3">
              {CASE_STUDIES.map((p) => (
                <li key={p.id}>
                  <Link href={projectHref(p)} className="hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="kicker mt-14 border-t border-line pt-6 font-normal text-stone">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
