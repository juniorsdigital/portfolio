import Image from "next/image";
import Link from "next/link";
import { jsonLd, pageMeta } from "@/lib/seo";
import { DESCRIPTIONS, PLACE_LABEL, SITE, SITE_URL } from "@/lib/site";

export const metadata = pageMeta({
  title: "About",
  description: DESCRIPTIONS.about,
  path: "/about",
});

/** 🔒 OWNER INPUT (P2-4): add "InDesign" or other apps John confirms. */
const tools = [
  "Photoshop",
  "Illustrator",
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Blender",
  "Figma",
];

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE_URL,
  image: `${SITE_URL}/images/about-portrait.png`,
  jobTitle: "Freelance graphic designer, video editor, and marketer",
  knowsAbout: ["Pack cover design", "Graphic design", "Video editing", "Marketing"],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pack and product covers", url: `${SITE_URL}/covers` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video editing" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marketing" } },
  ],
};

export default function AboutPage() {
  return (
    <div className="section-pad pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(person)} />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="label-kicker">{PLACE_LABEL}</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            About
          </h1>
          <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-muted">
            <p>
              I&apos;m {SITE.name} — a freelance designer, editor, and marketer
              {SITE.showLocation ? ` working out of ${SITE.location}` : " working remotely"}. Graphic design, video, and the
              marketing that has to live after the files leave my machine.
            </p>
            <p>
              Sport has been in the background since 2019. I started on the
              water. These days I race bikes. It doesn&apos;t show up as a theme
              in the work. It shows up as how I work: show up, go hard, leave
              it clean.
            </p>
            <p>
              I take{" "}
              <Link
                href="/covers"
                className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt"
              >
                product covers
              </Link>
              , digital art, posters, and ads. I cut social
              and advertising video. I build and run Google Business pages and
              social accounts for people who need that handled without a
              twelve-person team.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span
                key={tool}
                className="border border-gilt/25 px-3 py-1.5 text-[0.68rem] tracking-[0.14em] text-muted uppercase"
              >
                {tool}
              </span>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-10 inline-flex clip-shard bg-ember px-6 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase hover:bg-ember/85"
          >
            Start a project
          </Link>
        </div>
        <div className="clip-shard hairline overflow-hidden">
          <Image
            src="/images/about-portrait.png"
            alt={
              SITE.showLocation
                ? `${SITE.name}, freelance designer in ${SITE.location}`
                : `Portrait of ${SITE.name}`
            }
            sizes="(max-width: 1024px) 100vw, 480px"
            className="h-full w-full object-cover"
            width={800}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
