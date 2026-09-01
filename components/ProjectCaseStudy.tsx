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
}: {
  project: Project;
  titleId?: string;
  play?: boolean;
}) {
  const media = project.media[0];
  const showVideo = play && media.type === "video";

  return (
    <>
      {showVideo ? (
        <div className="aspect-video shrink-0 bg-black">
          <iframe
            title={media.title}
            src={youtubeSrc(media.id, media.start)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <Image
          src={media.type === "image" ? media.src : project.thumbnail.src}
          alt={media.type === "image" ? media.alt : project.thumbnail.alt}
          width={1200}
          height={750}
          className="h-auto w-full shrink-0"
        />
      )}
      <div className="p-6">
        <p className="label-kicker">{project.client}</p>
        <h3 id={titleId} className="mt-2 font-display text-2xl font-extrabold">
          {project.title}
        </h3>
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
      </div>
    </>
  );
}
