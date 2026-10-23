import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="wrap pt-18 pb-12">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-[2.5rem]" aria-label={`${SITE.brand} — home`}>
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-sm text-stone">
              {SITE.byline}
              <br />
              Design, video and marketing — {SITE.location}.
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
