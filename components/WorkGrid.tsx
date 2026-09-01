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
          className="absolute top-3 right-3 z-10 h-9 w-9 text-bone/80 hover:text-volt"
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
                className={`px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase ${
                  on
                    ? "bg-volt text-bg"
                    : "border border-gilt/25 text-muted hover:text-bone"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2">
        {visible.map((project) => (
          <li key={project.id} className={project.id === "ryzagrow" ? "sm:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setActive(project)}
              className="group clip-shard hairline relative z-0 block w-full cursor-pointer overflow-hidden bg-bg-panel text-left"
            >
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={project.thumbnail.src}
                  alt={project.thumbnail.alt}
                  width={project.thumbnail.width}
                  height={project.thumbnail.height}
                  className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/90 via-transparent to-transparent opacity-80" />
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 block p-5">
                <span className="block text-[0.65rem] tracking-[0.18em] text-gilt uppercase">
                  {project.client}
                </span>
                <span className="mt-1 block font-display text-xl font-extrabold tracking-tight text-bone sm:text-2xl">
                  {project.title}
                </span>
              </span>
            </button>
          </li>
        ))}
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
