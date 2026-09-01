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
  snapshot: string;
};

const CLIP_CARD =
  "polygon(0% 0%, 96.5% 0%, 100% 3.5%, 100% 100%, 3.5% 100%, 0% 96.5%)";

function cardRect() {
  const width = Math.min(768, window.innerWidth * 0.92);
  const height = Math.min(window.innerHeight * 0.88, width * 0.98 + 72);
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
  const [target] = useState(cardRect);
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
        className={`absolute inset-0 bg-bg/75 backdrop-blur-[2px] transition-opacity duration-500 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
        onClick={beginClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`shard-grow absolute overflow-hidden bg-bg-elev ${
          expanded ? "shard-grow-open" : ""
        }`}
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          clipPath: expanded ? CLIP_CARD : origin.clip,
        }}
        onTransitionEnd={onGrowEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={origin.snapshot}
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            expanded ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`relative flex h-full flex-col overflow-auto transition-opacity duration-500 ${
            expanded ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          <ProjectCaseStudy
            project={origin.project}
            titleId={titleId}
            play={expanded}
          />
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={beginClose}
          className={`absolute top-3 right-3 z-10 h-9 w-9 text-bone/80 transition-opacity hover:text-volt ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}
