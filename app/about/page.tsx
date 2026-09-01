import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — designer, editor, and marketer in ${SITE.location}.`,
};

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
    <div className="section-pad pt-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="label-kicker">{SITE.location}</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            About
          </h1>
          <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-muted">
            <p>
              I&apos;m {SITE.name} — a freelance designer, editor, and marketer
              working out of {SITE.location}. Graphic design, video, and the
              marketing that has to live after the files leave my machine.
            </p>
            <p>
              Sport has been in the background since 2019. I started on the
              water. These days I race bikes. It doesn&apos;t show up as a theme
              in the work. It shows up as how I work: show up, go hard, leave
              it clean.
            </p>
            <p>
              I take product covers, digital art, posters, and ads. I cut social
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
            alt={`${SITE.name}, freelance designer in ${SITE.location}`}
            className="h-full w-full object-cover"
            width={800}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
