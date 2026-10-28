import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Wordmark";
import { pageMetadata } from "@/lib/seo";
import { SERVICES, fromPrice, serviceHref, startingPrice } from "@/lib/services";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `About ${SITE.name} — freelance designer & video editor, ${SITE.location}`,
  description: `${SITE.name} is a freelance graphic designer, video editor and marketer in ${SITE.location}. 75+ product covers, a campaign that doubled sales, one person from brief to final files.`,
  path: "/about",
  absoluteTitle: true,
});

const tools = [
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "Blender",
  "Figma",
];

export default function AboutPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="on-paper pt-16 pb-24 sm:pt-24 sm:pb-28">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <p className="kicker text-slate">About / {SITE.location}</p>
            <h1 className="display display-xl mt-4">{SITE.name}.</h1>
            <p className="mt-10 max-w-[32ch] text-[1.625rem] leading-snug font-medium">
              A freelance designer, editor and marketer — and the only person
              you&apos;ll work with, from brief to final files.
            </p>
            <div className="mt-8 max-w-[60ch] space-y-5 text-lg leading-relaxed text-body sm:text-[1.1875rem]">
              <p>
                I work out of {SITE.location} on graphic design, video, and the
                marketing that has to live after the files leave my machine.
              </p>
              <p>
                Sport has been in the background since 2019. I started on the
                water. These days I race bikes. It doesn&apos;t show up as a
                theme in the work. It shows up as how I work: show up, go hard,
                leave it clean.
              </p>
              <p>
                I take on{" "}
                <Link href="/services/graphic-design" className="link text-ink">
                  graphic design
                </Link>{" "}
                — product covers, digital art, posters and ads. I do{" "}
                <Link href="/services/video-editing" className="link text-ink">
                  video editing
                </Link>{" "}
                for social and advertising. And I handle{" "}
                <Link href="/services/marketing" className="link text-ink">
                  marketing
                </Link>{" "}
                — setting up and running Google Business Profiles and social
                accounts for people who need that handled without a
                twelve-person team.
              </p>
              <p>
                The track record so far: 75+ product covers for OvaniSound, a
                direct-to-consumer campaign that doubled RyzaGrow&apos;s sales,
                and a trailer recut that found 7.7K views with no ad spend.
              </p>
              <p>
                You&apos;ll see{" "}
                <Monogram className="text-[1.1em] text-ink" /> on my files and
                profiles. It&apos;s my initials, and it&apos;s how I sign the
                work.
              </p>
            </div>
          </div>
          <figure className="lg:sticky lg:top-28">
            <Image
              src="/images/about-portrait.png"
              alt={`${SITE.name}, freelance designer in ${SITE.location}`}
              width={771}
              height={1024}
              preload
              sizes="(max-width: 1024px) 100vw, 480px"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="kicker mt-3 font-normal text-slate">
              {SITE.location}, PA
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="on-paper border-t border-rule py-20 sm:py-24" aria-labelledby="lanes-title">
        <div className="wrap">
          <h2 id="lanes-title" className="kicker text-slate">
            What I take on
          </h2>
          <div className="mt-8 grid lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <div
                key={service.slug}
                className={`py-7 ${
                  i > 0
                    ? "border-t border-rule lg:border-t-0 lg:border-l lg:pl-8"
                    : "lg:pr-8"
                }`}
              >
                <h3 className="text-[1.75rem] font-bold tracking-tight">
                  {service.name}
                </h3>
                <p className="mt-3 text-slate">
                  {service.packages.map((p) => p.name).join(" · ")}
                </p>
                <Link
                  href={serviceHref(service)}
                  className="link mt-4 inline-flex min-h-11 items-center"
                >
                  {fromPrice(startingPrice(service))} — see pricing{" "}
                  <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </div>
            ))}
          </div>

          <h2 className="kicker mt-16 text-slate">Tools</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <li
                key={tool}
                className="border border-rule bg-card px-4 py-2.5 font-medium"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-20 text-paper sm:py-24" aria-labelledby="about-cta-title">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 id="about-cta-title" className="display display-lg">
            Have work? <span className="text-signal">Send it.</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-signal min-h-14 px-8 text-lg">
              Start a project <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services" className="btn btn-ghost min-h-14 px-8 text-lg">
              Services &amp; pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
