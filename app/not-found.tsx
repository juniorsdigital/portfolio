import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-pad flex min-h-dvh flex-col justify-center pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="label-kicker">404</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight">
          No pane here.
        </h1>
        <p className="mt-4 text-muted">That route doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-8 inline-flex clip-shard bg-ember px-6 py-3 text-[0.72rem] tracking-[0.18em] text-bone uppercase"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
