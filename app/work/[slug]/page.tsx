import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { VideoFacade } from "@/components/VideoFacade";
import { CASE_STUDIES, projectHref } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { contactHref, getService, serviceHref } from "@/lib/services";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((p) => ({ slug: p.id }));
}

function find(slug: string) {
  return CASE_STUDIES.find((p) => p.id === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = find(slug);
  if (!project) return {};
  const { seoTitle, seoDescription } = project.caseStudy;
  return pageMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/work/${project.id}`,
    type: "article",
    image: { url: `/images/work/${project.id}-og.jpg`, alt: project.thumbnail.alt },
  });
}

function categoryLabel(categories: string[]) {
  return categories.map((c) => c[0].toUpperCase() + c.slice(1)).join(" + ");
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = find(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const index = CASE_STUDIES.indexOf(project);
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const url = `${SITE.url}/work/${project.id}`;
  const video = "video" in cs.hero ? cs.hero.video : null;
  const service = getService(project.service);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        headline: cs.seoTitle,
        description: cs.seoDescription,
        url,
        image: `${SITE.url}/images/work/${project.id}-og.jpg`,
        creator: { "@id": `${SITE.url}/#person` },
        keywords: project.tags.join(", "),
        ...(cs.year ? { dateCreated: cs.year } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE.url}/work` },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };

  const facts = [
    { term: "Client", value: project.client },
    ...(cs.year ? [{ term: "Year", value: cs.year }] : []),
    { term: "Role", value: cs.role, wide: !cs.year },
    { term: "Delivered", value: cs.delivered.join(" · "), wide: true },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Intro */}
      <section className="pt-12 pb-20 sm:pt-16 sm:pb-24" aria-labelledby="cs-title">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="kicker text-stone">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/work" className="hover:text-paper hover:underline">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{project.name}</li>
            </ol>
          </nav>
          <h1 id="cs-title" className="display display-xl mt-4 max-w-[7.19em]">
            {cs.headline.lead}{" "}
            <span className="text-signal">{cs.headline.accent}</span>
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <p className="max-w-[48ch] text-xl leading-relaxed text-soft sm:text-[1.375rem]">
              {cs.lede}
            </p>
            <dl className="grid grid-cols-2 content-start gap-x-8 gap-y-6 border-t border-line pt-6 text-[0.9375rem]">
              {facts.map((f) => (
                <div key={f.term} className={f.wide ? "col-span-2" : ""}>
                  <dt className="kicker text-stone">{f.term}</dt>
                  <dd className="mt-1.5">{f.value}</dd>
                </div>
              ))}
              <div className="col-span-2">
                <dt className="kicker text-stone">Discipline</dt>
                <dd className="mt-1.5">
                  {categoryLabel(project.categories)} · {project.tags.join(" · ")}
                </dd>
              </div>
            </dl>
          </div>

          <figure className="mt-16">
            {video ? (
              <VideoFacade video={video} preload />
            ) : "src" in cs.hero ? (
              <Image
                src={cs.hero.src}
                alt={cs.hero.alt}
                width={cs.hero.width}
                height={cs.hero.height}
                preload
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="w-full border border-line"
              />
            ) : null}
          </figure>
        </div>
      </section>

      {/* Brief */}
      <section className="section on-paper bg-paper text-ink" aria-labelledby="brief-title">
        <div className="wrap">
          <p className="kicker text-slate">01 / The brief</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="brief-title" className="display display-lg">
              {cs.brief.title}
            </h2>
            <p className="max-w-[48ch] text-lg text-slate">{cs.brief.body}</p>
          </div>
          <ul
            className={`mt-14 grid gap-6 sm:grid-cols-2 ${
              cs.brief.points.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {cs.brief.points.map((p) => (
              <li key={p.title} className="flex flex-col border border-rule bg-card p-7">
                <h3 className="text-[1.375rem] leading-tight font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <section className="section" aria-labelledby="approach-title">
        <div className="wrap">
          <p className="kicker text-stone">02 / The approach</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="approach-title" className="display display-lg">
              {cs.approach.title}
            </h2>
            <p className="max-w-[46ch] text-lg text-soft">{cs.approach.intro}</p>
          </div>
          <ol
            className={`mt-14 grid gap-px bg-line sm:grid-cols-2 ${
              cs.approach.steps.length === 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {cs.approach.steps.map((s, i) => (
              <li key={s.title} className="bg-ink p-8 sm:p-10">
                <p className="font-mono text-sm text-signal">0{i + 1}</p>
                <h3 className="mt-6 text-[1.75rem] leading-tight font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 max-w-[48ch] text-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The work */}
      {cs.gallery ? (
        <section className="section on-paper bg-paper text-ink" aria-labelledby="gallery-title">
          <div className="wrap">
            <p className="kicker text-slate">03 / The work</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
              <h2 id="gallery-title" className="display display-lg">
                {cs.gallery.title}
              </h2>
              {cs.gallery.intro ? (
                <p className="max-w-[46ch] text-lg text-slate">{cs.gallery.intro}</p>
              ) : null}
            </div>
            <div
              className={`mt-14 grid items-start gap-6 ${
                cs.gallery.images.length === 4
                  ? "sm:grid-cols-3 sm:[&>figure:last-child]:col-span-3"
                  : cs.gallery.images.length === 2
                    ? "sm:grid-cols-2"
                    : ""
              }`}
            >
              {cs.gallery.images.map((img, i, all) => (
                <figure key={img.src}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes={
                      // Single images, and the last of four, span the full row.
                      all.length === 1 || (all.length === 4 && i === 3)
                        ? "(max-width: 1280px) 100vw, 1200px"
                        : all.length === 4
                          ? "(max-width: 640px) 100vw, 400px"
                          : "(max-width: 640px) 100vw, 600px"
                    }
                    className="w-full border border-rule"
                  />
                  {img.caption ? (
                    <figcaption className="kicker mt-3 font-normal text-slate">{img.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Outcome */}
      <section className="section" aria-labelledby="outcome-title">
        <div className="wrap">
          <p className="kicker text-stone">{cs.gallery ? "04" : "03"} / The result</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="outcome-title" className="display display-lg">
              {cs.outcome.title}
            </h2>
            <p className="max-w-[46ch] text-lg text-soft">{cs.outcome.body}</p>
          </div>
          <ul className="mt-14 grid border-y border-line sm:grid-cols-3">
            {cs.outcome.stats.map((r, i) => (
              <li
                key={r.label}
                className={`py-9 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-8" : "sm:pr-8"}`}
              >
                <p className="display text-[4.5rem] leading-none text-signal">{r.value}</p>
                <p className="mt-3 max-w-[30ch] text-soft">{r.label}</p>
              </li>
            ))}
          </ul>
          {cs.external ? (
            <a
              href={cs.external.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-10 inline-flex min-h-11 items-center text-lg"
            >
              {cs.external.label} <span aria-hidden="true">&nbsp;↗</span>
            </a>
          ) : null}

          <Link
            href={projectHref(next)}
            className="group mt-16 flex flex-col gap-2 border-t border-line pt-8 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="kicker text-stone">Next case study</span>
            <span className="text-[1.75rem] leading-tight font-bold tracking-tight underline decoration-1 underline-offset-[0.3em] group-hover:decoration-signal group-hover:decoration-2">
              {next.title} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Pitch */}
      <section className="on-paper bg-signal py-24 text-ink sm:py-28" aria-labelledby="pitch-title">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 id="pitch-title" className="display display-xl">
              {cs.pitch.title}
            </h2>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">{cs.pitch.body}</p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Link href={contactHref(project.service)} className="btn btn-ink min-h-14 px-8 text-lg">
              {cs.pitch.cta} <span aria-hidden="true">→</span>
            </Link>
            {service ? (
              <Link href={serviceHref(service)} className="link text-lg">
                See {service.name.toLowerCase()} packages &amp; pricing
              </Link>
            ) : null}
            <Link href="/work" className="link text-lg">
              See the rest of the work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
