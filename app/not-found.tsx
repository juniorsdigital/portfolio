import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-col justify-center py-24">
      <div className="wrap">
        <p className="kicker text-stone">404</p>
        <h1 className="display display-xl mt-4">
          Nothing <span className="text-signal">here.</span>
        </h1>
        <p className="mt-6 max-w-md text-xl text-soft">
          That page doesn&apos;t exist. The work does.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-signal">
            Back home
          </Link>
          <Link href="/work" className="btn btn-ghost">
            See the work
          </Link>
        </div>
      </div>
    </div>
  );
}
