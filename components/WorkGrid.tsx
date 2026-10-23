"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Dialog } from "@/components/Dialog";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import {
  PROJECTS,
  WORK_FILTERS,
  type Project,
  type WorkCategory,
} from "@/lib/projects";

function isVideo(project: Project) {
  return project.media[0]?.type === "video";
}

function categoryLabel(project: Project) {
  return project.categories
    .map((c) => c[0].toUpperCase() + c.slice(1))
    .join(" + ");
}

function PlayTag() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 left-4 inline-flex h-10 items-center gap-2.5 bg-ink pr-4 pl-3.5 text-[0.9375rem] font-semibold text-paper"
    >
      <svg width="11" height="13" viewBox="0 0 12 14" fill="currentColor">
        <path d="M12 7 0 14V0z" />
      </svg>
      Play
    </span>
  );
}

function ProjectCard({
  project,
  detailed,
  wide,
  onOpen,
}: {
  project: Project;
  detailed: boolean;
  wide: boolean;
  onOpen: (p: Project) => void;
}) {
  const video = isVideo(project);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`group flex h-full w-full cursor-pointer flex-col overflow-hidden border border-line bg-ink-2 text-left transition-colors hover:border-stone ${
        wide ? "lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : ""
      }`}
    >
      <span
        className={`relative block w-full overflow-hidden ${
          wide ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          fill
          sizes={wide ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 640px) 100vw, 620px"}
          className="zoom-img pointer-events-none object-cover"
        />
        {video ? <PlayTag /> : null}
      </span>
      <span className={`flex flex-1 flex-col ${wide ? "p-7 sm:p-11" : "p-7 sm:p-8"}`}>
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-sm text-stone">
          <span>
            {project.client} · {categoryLabel(project)}
          </span>
          {project.result && !wide ? (
            <span className="text-signal">{project.result}</span>
          ) : null}
        </span>
        <span
          className={`mt-3 block font-bold tracking-tight text-paper ${
            wide ? "text-[2.5rem] leading-[1.08]" : "text-[1.75rem] leading-[1.15]"
          }`}
        >
          {project.title}
        </span>
        {detailed || wide ? (
          <span className="mt-3 block max-w-[52ch] text-soft">
            {project.description}
          </span>
        ) : null}
        {detailed ? (
          <span className="mt-auto block pt-6 text-[0.9375rem] text-stone">
            {project.tags.join(" · ")}
          </span>
        ) : null}
        {wide && project.result ? (
          <span className="mt-auto flex items-baseline gap-3 pt-8">
            <span className="display text-[3.5rem] leading-none text-signal">
              {project.result.split(" ")[0]}
            </span>
            <span className="text-stone">
              {project.result.split(" ").slice(1).join(" ")}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function WorkGrid({
  projects = PROJECTS,
  showFilters = false,
  detailed = false,
}: {
  projects?: Project[];
  showFilters?: boolean;
  detailed?: boolean;
}) {
  const [filter, setFilter] = useState<"all" | WorkCategory>("all");
  const [active, setActive] = useState<Project | null>(null);
  const close = useCallback(() => setActive(null), []);

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      {showFilters ? (
        <div
          className="mb-10 flex flex-wrap gap-2 border-b border-line pb-6"
          role="group"
          aria-label="Filter work"
        >
          {WORK_FILTERS.map((item) => {
            const on = filter === item.id;
            const count =
              item.id === "all"
                ? projects.length
                : projects.filter((p) => p.categories.includes(item.id as WorkCategory)).length;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(item.id)}
                className={`inline-flex min-h-11 items-center gap-2 border px-5 font-semibold transition-colors ${
                  on
                    ? "border-paper bg-paper text-ink"
                    : "border-slate text-paper hover:border-paper"
                }`}
              >
                {item.label}
                <span className="font-mono text-[0.8125rem] font-normal opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <ul className="grid gap-6 md:grid-cols-2">
        {visible.map((project) => {
          const wide = Boolean(project.featured) && filter === "all";
          return (
            <li key={project.id} className={wide ? "md:col-span-2" : ""}>
              <ProjectCard
                project={project}
                detailed={detailed}
                wide={wide}
                onOpen={setActive}
              />
            </li>
          );
        })}
      </ul>

      {visible.length === 0 ? (
        <p className="text-stone">Nothing in this lane yet.</p>
      ) : null}

      {active ? (
        <Dialog onClose={close} label={active.title}>
          {(titleId) => <ProjectCaseStudy project={active} titleId={titleId} />}
        </Dialog>
      ) : null}
    </>
  );
}
