"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import {
  PROJECTS,
  WORK_FILTERS,
  type Project,
  type WorkCategory,
} from "@/lib/projects";

function isVideoProject(project: Project) {
  return project.categories.includes("video");
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="clip-shard hairline relative max-h-[90dvh] w-full max-w-3xl overflow-auto bg-bg-elev"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center bg-bg/70 text-lg leading-none text-bone backdrop-blur-sm hover:text-volt"
          aria-label="Close"
        >
          ×
        </button>
        <ProjectCaseStudy project={project} titleId={titleId} />
      </div>
    </div>
  );
}

export function WorkGrid({
  projects = PROJECTS,
  showFilters = false,
}: {
  projects?: Project[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<"all" | WorkCategory>("all");
  const [active, setActive] = useState<Project | null>(null);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      {showFilters ? (
        <div className="mb-10 flex flex-wrap gap-2" aria-label="Filter work">
          {WORK_FILTERS.map((item) => {
            const on = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(item.id)}
                className={`clip-shard-sm px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase transition-colors ${
                  on
                    ? "bg-volt text-bg"
                    : "hairline text-muted hover:text-bone"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <ul className="grid gap-6 sm:grid-cols-2">
        {visible.map((project) => {
          const video = isVideoProject(project);
          const featured = project.id === "ryzagrow";
          const tags = project.tags.slice(0, 2);

          return (
            <li
              key={project.id}
              className={`transition-[transform,filter] duration-300 [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.28))] hover:-translate-y-1 hover:[filter:drop-shadow(0_22px_40px_rgba(0,0,0,0.42))] ${
                featured ? "sm:col-span-2" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setActive(project)}
                className={`group relative z-0 block w-full cursor-pointer overflow-hidden bg-bg-panel text-left ${
                  video
                    ? "clip-shard border border-steel/35 hover:border-steel/70"
                    : "clip-shard hairline hover:border-gilt/55"
                }`}
              >
                <span
                  className={`relative block overflow-hidden ${
                    video
                      ? "aspect-video"
                      : featured
                        ? "aspect-[16/10] sm:aspect-[2.35/1]"
                        : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={project.thumbnail.src}
                    alt={project.thumbnail.alt}
                    width={project.thumbnail.width}
                    height={project.thumbnail.height}
                    className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {video ? (
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/55 via-transparent to-transparent" />
                  ) : null}
                  {video ? (
                    <span
                      className="pointer-events-none absolute top-4 right-4 grid h-10 w-10 place-items-center border border-steel/50 bg-bg/55 text-steel backdrop-blur-sm"
                      aria-hidden="true"
                    >
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                        <path d="M12 7 0 14V0z" />
                      </svg>
                    </span>
                  ) : null}
                </span>
                <span className="block p-5 sm:p-6">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`block text-[0.65rem] tracking-[0.18em] uppercase ${
                        video ? "text-steel" : "text-gilt"
                      }`}
                    >
                      {project.client}
                    </span>
                    {video ? (
                      <span className="border border-steel/40 px-2 py-0.5 text-[0.62rem] tracking-[0.16em] text-steel uppercase">
                        Video
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 block font-display text-xl font-extrabold tracking-tight text-bone sm:text-2xl">
                    {project.title}
                  </span>
                  {tags.length > 0 || project.result ? (
                    <span className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-gilt/25 px-2 py-1 text-[0.62rem] tracking-[0.14em] text-muted uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.result ? (
                        <span className="border border-volt/40 px-2 py-1 text-[0.62rem] tracking-[0.14em] text-volt uppercase">
                          {project.result}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 ? (
        <p className="text-sm text-muted">Nothing in this lane yet.</p>
      ) : null}

      {active ? (
        <ProjectModal project={active} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}
