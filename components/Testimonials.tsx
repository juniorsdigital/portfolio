import Link from "next/link";
import { PROJECTS, projectHref } from "@/lib/projects";
import type { ServiceSlug } from "@/lib/services";
import { TESTIMONIALS } from "@/lib/site";

/**
 * Client quotes from lib/site.ts. Renders nothing until a real quote is added.
 * With `service`, shows only quotes whose project belongs to that service.
 */
export function Testimonials({
  service,
  tone = "paper",
}: {
  service?: ServiceSlug;
  /** Pick the ground that contrasts with the sections around it. */
  tone?: "paper" | "ink";
}) {
  const paper = tone === "paper";
  const quotes = TESTIMONIALS.map((t) => ({
    ...t,
    project: t.project ? PROJECTS.find((p) => p.id === t.project) : undefined,
  })).filter((t) => !service || t.project?.service === service);

  if (quotes.length === 0) return null;

  return (
    <section
      className={`section ${paper ? "on-paper bg-paper text-ink" : "bg-ink text-paper"}`}
      aria-labelledby="testimonials-title"
    >
      <div className="wrap">
        <p className={`kicker ${paper ? "text-slate" : "text-stone"}`}>From clients</p>
        <h2 id="testimonials-title" className="display display-lg mt-4">
          In their words.
        </h2>
        <ul className={`mt-14 grid gap-6 ${quotes.length > 1 ? "md:grid-cols-2" : ""}`}>
          {quotes.map((t) => (
            <li
              key={t.name}
              className={`flex flex-col border p-8 sm:p-10 ${paper ? "border-rule bg-card" : "border-line bg-ink-2"}`}
            >
              <blockquote className="text-[1.375rem] leading-snug font-medium">
                <p>
                  <span aria-hidden="true">“</span>
                  {t.quote}
                  <span aria-hidden="true">”</span>
                </p>
              </blockquote>
              <p className="mt-8">
                <span className="block font-semibold">{t.name}</span>
                <span className={`block ${paper ? "text-slate" : "text-stone"}`}>{t.role}</span>
              </p>
              {t.project ? (
                <Link
                  href={projectHref(t.project)}
                  className="link mt-5 inline-flex min-h-11 items-center self-start"
                >
                  Read the {t.project.name} case study <span aria-hidden="true">&nbsp;→</span>
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
