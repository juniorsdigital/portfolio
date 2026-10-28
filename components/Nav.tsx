"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { NAV_LINKS, PAPER_ROUTES, SITE } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const paper =
    !open && PAPER_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-md ${
          paper
            ? "on-paper border-rule bg-paper/95 text-ink"
            : "border-line bg-ink/92 text-paper"
        }`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-[1.625rem]"
            aria-label={`${SITE.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav
            className="hidden items-center gap-9 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`py-2 text-base font-medium underline-offset-[0.5rem] ${
                    active
                      ? "underline decoration-signal decoration-2"
                      : "hover:underline hover:decoration-1"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {pathname.startsWith("/contact") ? null : (
              <Link
                href="/contact"
                className={`btn btn-sm ${paper ? "btn-ink" : "btn-signal"}`}
              >
                Start a project
              </Link>
            )}
          </nav>

          <button
            type="button"
            className={`grid h-11 w-11 place-items-center border md:hidden ${
              paper ? "border-rule" : "border-line"
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              {open ? (
                <path d="M3 0l14 14M17 0 3 14" />
              ) : (
                <path d="M0 1h20M0 7h20M0 13h20" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 flex flex-col bg-ink md:hidden"
        >
          <nav aria-label="Mobile" className="wrap flex flex-col pt-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className="display border-b border-line py-5 text-5xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="wrap mt-10 flex flex-col items-start gap-5">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-signal"
            >
              Start a project <span aria-hidden="true">→</span>
            </Link>
            <a href={`mailto:${SITE.email}`} className="link font-mono text-sm font-normal text-stone">
              {SITE.email}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
