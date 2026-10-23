import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import { PROJECTS } from "@/lib/projects";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

function findProject(slug: string) {
  return PROJECTS.find((p) => p.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  const meta = pageMeta({
    title: project.title,
    description: project.seoDescription ?? project.description,
    path: `/work/${project.id}`,
    image: project.id === "ovani" ? "covers" : "work",
  });
  // Use the project's own art as its share image.
  const img = { url: project.thumbnail.src, alt: project.thumbnail.alt };
  return {
    ...meta,
    openGraph: { ...meta.openGraph, images: [img] },
    twitter: { ...meta.twitter, images: [img.url] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <div className="section-pad pt-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/work"
          className="text-xs tracking-[0.18em] text-muted uppercase hover:text-volt"
        >
          ← All work
        </Link>
        <article className="clip-shard hairline mt-6 overflow-hidden bg-bg-elev">
          <ProjectCaseStudy project={project} as="h1" autoplay={false} />
        </article>
        {project.media[0]?.type === "video" ? (
          <p className="mt-4 text-sm text-muted">
            <a
              href={`https://www.youtube.com/watch?v=${project.media[0].id}`}
              target="_blank"
              rel="noopener"
              className="text-bone underline decoration-gilt/50 underline-offset-4 hover:text-volt"
            >
              Watch on YouTube ↗
            </a>
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-4">
          {project.id === "ovani" ? (
            <Link
              href="/covers"
              className="clip-shard-sm bg-ember px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase hover:bg-ember/85"
            >
              See cover packages
            </Link>
          ) : null}
          <Link
            href="/contact"
            className="clip-shard-sm hairline px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-bone uppercase hover:border-volt hover:text-volt"
          >
            Start a project
          </Link>
        </div>
      </div>
    </div>
  );
}
