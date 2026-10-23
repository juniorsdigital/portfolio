import Image from "next/image";
import type { Project } from "@/lib/projects";

function youtubeSrc(id: string, start?: number) {
  const params = new URLSearchParams({
    autoplay: "1",
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
}: {
  project: Project;
  titleId?: string;
  play?: boolean;
  showMedia?: boolean;
}) {
  const media = project.media[0];
  const showVideo = showMedia && play && media.type === "video";

  return (
    <>
      {showMedia && showVideo ? (
        <div className="aspect-video shrink-0 bg-black">
          <iframe
            title={media.title}
            src={youtubeSrc(media.id, media.start)}
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
          className="h-auto w-full shrink-0"
        />
      ) : null}
      <div className="p-7 sm:p-10">
        <p className="kicker text-stone">
          {project.client} ·{" "}
          {project.categories
            .map((c) => c[0].toUpperCase() + c.slice(1))
            .join(" + ")}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 id={titleId} className="text-3xl font-bold tracking-tight sm:text-4xl">
            {project.title}
          </h2>
          {project.result ? (
            <p className="display text-4xl leading-none text-signal">
              {project.result}
            </p>
          ) : null}
        </div>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-soft">
          {project.description}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Disciplines">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="border border-line px-3 py-1.5 text-[0.9375rem] text-stone"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
