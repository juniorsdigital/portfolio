import type { ReactNode } from "react";

/** Numbered kicker + condensed heading + optional lead or action, used by every section. */
export function SectionHeader({
  kicker,
  title,
  id,
  aside,
  tone = "ink",
  as: Tag = "h2",
}: {
  kicker: string;
  title: ReactNode;
  id?: string;
  aside?: ReactNode;
  tone?: "ink" | "paper";
  as?: "h1" | "h2";
}) {
  return (
    <div>
      <p className={`kicker ${tone === "paper" ? "text-slate" : "text-stone"}`}>
        {kicker}
      </p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Tag
          id={id}
          className={`display ${Tag === "h1" ? "display-xl" : "display-lg"}`}
        >
          {title}
        </Tag>
        {aside ? <div className="md:max-w-md md:pb-1">{aside}</div> : null}
      </div>
    </div>
  );
}
