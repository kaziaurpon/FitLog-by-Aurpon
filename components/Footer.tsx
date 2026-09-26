import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-base-border bg-base-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="FitLog" width={22} height={22} />
          <span className="font-display text-base tracking-wide text-white">
            FITLOG
          </span>
        </div>
        <p className="text-center text-sm text-base-muted sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
