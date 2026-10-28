import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { CASE_STUDIES, projectHref } from "@/lib/projects";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="wrap pt-18 pb-12">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-[1.5fr_0.8fr_1.2fr_1.5fr]">
          <div className="md:col-span-3 lg:col-span-1">
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
              {NAV_LINKS.map((link) => (
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
            </ul>
          </div>
        </div>
        <p className="kicker mt-14 border-t border-line pt-6 font-normal text-stone">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
