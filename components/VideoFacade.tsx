"use client";

import Image from "next/image";
import { useState } from "react";
import type { WorkVideo } from "@/lib/projects";

const ORIGIN = "https://www.youtube-nocookie.com";

function embedSrc(video: WorkVideo) {
  const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1" });
  if (video.start) params.set("start", String(video.start));
  return `${ORIGIN}/embed/${video.id}?${params.toString()}`;
}

/** Warm the connection the moment someone shows intent, not on page load. */
function warm() {
  if (document.querySelector(`link[href="${ORIGIN}"]`)) return;
  for (const href of [ORIGIN, "https://i.ytimg.com", "https://www.google.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.append(link);
  }
}

/**
 * The poster is the page's LCP image; the YouTube player (~1MB of script)
 * only loads after the viewer presses play.
 */
export function VideoFacade({ video, preload = false }: { video: WorkVideo; preload?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden border border-line bg-black">
      {playing ? (
        <iframe
          title={video.title}
          src={embedSrc(video)}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          onPointerEnter={warm}
          onFocus={warm}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play ${video.title}`}
        >
          <Image
            src={video.poster.src}
            alt={video.poster.alt}
            fill
            preload={preload}
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="zoom-img object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-5 inline-flex h-14 items-center gap-3 bg-signal pr-6 pl-5 text-lg font-bold text-ink transition-colors group-hover:bg-paper sm:bottom-8 sm:left-8"
          >
            <svg width="14" height="16" viewBox="0 0 12 14" fill="currentColor">
              <path d="M12 7 0 14V0z" />
            </svg>
            Play
          </span>
        </button>
      )}
    </div>
  );
}
