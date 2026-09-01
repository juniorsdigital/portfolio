"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import type { Project } from "@/lib/projects";

export type ShardOrigin = {
  project: Project;
  left: number;
  top: number;
  width: number;
  height: number;
  clip: string;
  openClip: string;
  snapshot: string;
};

function paneRect() {
  const width = Math.min(820, window.innerWidth * 0.92);
  const height = Math.min(window.innerHeight * 0.88, width * 1.02 + 48);
  return {
    left: (window.innerWidth - width) / 2,
    top: Math.max(20, (window.innerHeight - height) / 2),
    width,
    height,
  };
}

export function ShardCaseStudyOverlay({
  origin,
  reduced,
  onClose,
}: {
  origin: ShardOrigin;
  reduced: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"from" | "open" | "closing">(
    reduced ? "open" : "from",
  );
  const [target] = useState(paneRect);
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
    const timeout = window.setTimeout(onClose, 780);
    return () => window.clearTimeout(timeout);
  }, [phase, onClose]);

  function onGrowEnd(e: React.TransitionEvent<HTMLDivElement>) {
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
        className={`shard-grow absolute overflow-hidden ${
          expanded ? "shard-grow-open" : ""
        }`}
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          clipPath: expanded ? origin.openClip : origin.clip,
        }}
        onTransitionEnd={onGrowEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={origin.snapshot}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
            expanded
              ? "scale-110 opacity-45 blur-[14px]"
              : "scale-100 opacity-100 blur-0"
          }`}
        />
        <div
          className={`absolute inset-[14%] z-[4] flex flex-col overflow-auto bg-bg/60 backdrop-blur-md transition-opacity duration-500 ${
            expanded ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={beginClose}
            className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center bg-bg/70 text-lg leading-none text-bone backdrop-blur-sm hover:text-volt"
            aria-label="Close"
          >
            ×
          </button>
          <ProjectCaseStudy
            project={origin.project}
            titleId={titleId}
            play={expanded}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            boxShadow:
              "inset 0 0 0 1.5px rgba(230, 225, 214, 0.55), inset 0 0 0 3px rgba(214, 255, 58, 0.18), inset 0 24px 40px rgba(255, 255, 255, 0.12), inset 0 -28px 48px rgba(122, 168, 196, 0.1)",
          }}
        />
      </div>
    </div>,
    document.body,
  );
}
