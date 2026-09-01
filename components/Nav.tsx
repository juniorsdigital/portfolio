"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !onHero || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        solid
          ? "bg-bg/90 backdrop-blur-md border-b border-gilt/20"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)]">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 font-display text-sm font-extrabold tracking-[0.18em] uppercase text-bone"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center border border-gilt/50"
            style={{
              clipPath:
                "polygon(0 0, 78% 0, 100% 22%, 100% 100%, 22% 100%, 0 78%)",
            }}
          >
            <span className="h-3 w-3 bg-ember" />
          </span>
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.7rem] font-medium tracking-[0.22em] uppercase transition-colors ${
                  active ? "text-volt" : "text-muted hover:text-bone"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="clip-shard-sm bg-ember px-4 py-2 text-[0.7rem] font-medium tracking-[0.18em] text-bone uppercase transition-colors hover:bg-ember/85"
          >
            Start a project
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-px w-5 bg-bone transition-transform ${open ? "translate-y-[4px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-bone transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-bone transition-transform ${open ? "-translate-y-[8px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 top-16 z-40 flex flex-col gap-6 bg-bg px-8 py-12 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl font-extrabold tracking-tight text-bone"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-fit clip-shard bg-ember px-5 py-3 text-sm tracking-[0.16em] text-bone uppercase"
          >
            Start a project
          </Link>
        </div>
      ) : null}
    </header>
  );
}
