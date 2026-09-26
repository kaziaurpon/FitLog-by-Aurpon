import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl uppercase tracking-wide text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-base-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
      >
        Back to workouts
      </Link>
    </div>
  );
}
