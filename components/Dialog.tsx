"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * Accessible modal: Esc and backdrop close it, focus moves to the close
 * button on open and back to the trigger on close, and the page behind it
 * stops scrolling.
 */
export function Dialog({
  onClose,
  label,
  children,
  wide = false,
}: {
  onClose: () => void;
  label: string;
  children: (titleId: string) => ReactNode;
  wide?: boolean;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-ink/88 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className={`relative max-h-[92dvh] w-full overflow-auto border border-line bg-ink-2 text-paper ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center bg-ink text-paper hover:text-signal"
          aria-label={`Close ${label}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M2 2l12 12M14 2 2 14" />
          </svg>
        </button>
        {children(titleId)}
      </div>
    </div>
  );
}
