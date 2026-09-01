import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-gilt/25 bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-[clamp(1.25rem,4vw,3.5rem)] py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight text-bone">
            {SITE.name}
          </p>
          <p className="mt-1 text-xs tracking-[0.16em] text-muted uppercase">
            {SITE.location}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs tracking-[0.18em] uppercase">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-volt"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${SITE.email}`}
            className="text-muted transition-colors hover:text-ember"
          >
            {SITE.email}
          </a>
        </nav>
      </div>
    </footer>
  );
}
