"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import type { HeroCover } from "@/lib/hero-covers";
import type { Project } from "@/lib/projects";

export type BookOrigin = {
  cover: HeroCover;
  project: Project;
  left: number;
  top: number;
  width: number;
  height: number;
};

function spreadRect() {
  const stacked = window.innerWidth < 720;
  const width = Math.min(stacked ? 440 : 920, window.innerWidth * 0.92);
  const height = Math.min(
    window.innerHeight * 0.86,
    stacked ? window.innerHeight * 0.86 : 520,
  );
  return {
    left: (window.innerWidth - width) / 2,
    top: Math.max(20, (window.innerHeight - height) / 2),
    width,
    height,
  };
}

export function BookCaseStudyOverlay({
  origin,
  reduced,
  onClose,
}: {
  origin: BookOrigin;
  reduced: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"from" | "open" | "closing">(
    reduced ? "open" : "from",
  );
  const [target] = useState(spreadRect);
  const expanded = phase === "open";

  const beginClose = useCallback(() => {
    if (reduced) {
      onClose();
      return;
    }
    setPhase((current) => (current === "closing" ? current : "closing"));
  }, [reduced, onClose]);

  useLayoutEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          setPhase((current) => (current === "from" ? "open" : current));
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [beginClose]);

  useEffect(() => {
    if (phase !== "closing") return;
    const timeout = window.setTimeout(onClose, 720);
    return () => window.clearTimeout(timeout);
  }, [phase, onClose]);

  function onMoveEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (phase === "closing" && e.propertyName === "left") onClose();
  }

  const box = expanded
    ? target
    : {
        left: origin.left,
        top: origin.top,
        width: origin.width,
        height: origin.height,
      };

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close case study"
        className={`absolute inset-0 bg-bg/80 backdrop-blur-[10px] transition-opacity duration-500 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
        onClick={beginClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`book-spread absolute ${expanded ? "is-open" : ""}`}
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
        }}
        onTransitionEnd={onMoveEnd}
      >
        <div className="book-pages">
          <div className="book-page book-page-left">
            <Image
              src={origin.cover.src}
              alt={origin.cover.alt}
              fill
              className="object-contain"
              sizes="(max-width: 720px) 92vw, 460px"
            />
          </div>
          <div className="book-page book-page-right">
            <button
              ref={closeRef}
              type="button"
              onClick={beginClose}
              className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center bg-bg/70 text-lg leading-none text-bone backdrop-blur-sm hover:text-volt"
              aria-label="Close"
            >
              ×
            </button>
            <p className="label-kicker px-6 pt-6">{origin.cover.title}</p>
            <ProjectCaseStudy
              project={origin.project}
              titleId={titleId}
              showMedia={false}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
