import Image from "next/image";
import Link from "next/link";
import { projectHref, type Project } from "@/lib/projects";

/** Compact case-study cards for service pages: image, client, title, result. */
export function ProofGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className={`grid gap-6 sm:grid-cols-2 ${projects.length > 2 ? "lg:grid-cols-3" : ""}`}>
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={projectHref(project)}
            className="group flex h-full flex-col overflow-hidden border border-line bg-ink-2 transition-colors hover:border-stone"
          >
            <span className="relative block aspect-[16/10] overflow-hidden">
              <Image
                src={project.thumbnail.src}
                alt={project.thumbnail.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="zoom-img object-cover"
              />
            </span>
            <span className="flex flex-1 flex-col p-7">
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-sm text-stone">
                <span>{project.client}</span>
                {project.result ? <span className="text-signal">{project.result}</span> : null}
              </span>
              <span className="mt-3 block text-[1.5rem] leading-[1.15] font-bold tracking-tight text-paper">
                {project.title}
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-7 font-semibold text-paper underline decoration-1 underline-offset-[0.3em] group-hover:decoration-signal group-hover:decoration-2">
                Read the case study <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
