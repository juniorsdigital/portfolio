import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { isPlaceholder } from "@/lib/site";

function youtubeSrc(id: string, start?: number, autoplay = true) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
  });
  if (start) params.set("start", String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function ProjectCaseStudy({
  project,
  titleId,
  play = true,
  showMedia = true,
  as: Heading = "h3",
  showPageLink = false,
  autoplay = true,
}: {
  project: Project;
  titleId?: string;
  play?: boolean;
  showMedia?: boolean;
  as?: "h1" | "h3";
  /** Shows a link to the project's own shareable page (used inside the modal). */
  showPageLink?: boolean;
  autoplay?: boolean;
}) {
  const media = project.media[0];
  const showVideo = showMedia && play && media.type === "video";

  return (
    <>
      {showMedia && showVideo ? (
        <div className="aspect-video shrink-0 bg-black">
          <iframe
            title={media.title}
            src={youtubeSrc(media.id, media.start, autoplay)}
            loading={autoplay ? undefined : "lazy"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : showMedia ? (
        <Image
          src={media.type === "image" ? media.src : project.thumbnail.src}
          alt={media.type === "image" ? media.alt : project.thumbnail.alt}
          width={1200}
          height={750}
          sizes="(max-width: 800px) 100vw, 768px"
          className="h-auto w-full shrink-0"
        />
      ) : null}
      <div className="p-6">
        <p className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">
          {project.categories.join(" · ")}
        </p>
        <p className="label-kicker mt-3">{project.client}</p>
        <Heading id={titleId} className="mt-2 font-display text-2xl font-extrabold">
          {project.title}
        </Heading>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border border-gilt/25 px-2 py-1 text-[0.65rem] tracking-[0.14em] text-muted uppercase"
            >
              {tag}
            </span>
          ))}
          {project.result ? (
            <span className="border border-volt/40 px-2 py-1 text-[0.65rem] tracking-[0.14em] text-volt uppercase">
              {project.result}
            </span>
          ) : null}
        </div>
        {project.result && !isPlaceholder(project.resultNote) ? (
          <p className="mt-2 text-xs text-muted">
            {project.result} — {project.resultNote}
          </p>
        ) : null}
        {showPageLink ? (
          <Link
            href={`/work/${project.id}`}
            className="mt-5 inline-block text-[0.68rem] tracking-[0.16em] text-volt uppercase hover:text-bone"
          >
            Open project page →
          </Link>
        ) : null}
      </div>
    </>
  );
}
