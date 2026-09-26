"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  { href: "/#library", label: "Workouts", match: "/" },
  { href: "/my-plan", label: "My Plan", match: "/my-plan" },
];

export function Navbar() {
  const pathname = usePathname();
  const { planCount, savedCount } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-base-border/80 bg-base-bg/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="col-start-1 flex items-center gap-2 justify-self-start">
          <Image src="/assets/logo.png" alt="FitLog" width={26} height={26} />
          <span className="font-display text-lg tracking-wide text-white">
            FITLOG
          </span>
        </Link>

        <nav className="col-start-2 hidden items-center gap-1 justify-self-center rounded-full border border-base-border bg-base-card p-1 sm:flex">
          {links.map((link) => {
            const active = pathname === link.match;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 font-display text-sm tracking-wide transition-colors ${
                  active
                    ? "bg-base-surface text-accent"
                    : "text-base-muted hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center gap-4 justify-self-end">
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-xs font-semibold text-white"
            aria-label="Today's plan"
          >
            Plan
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold leading-none text-black">
              {planCount}
            </span>
          </Link>
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-xs font-semibold text-white"
            aria-label="Saved workouts"
          >
            Saved
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-base-border text-[11px] font-bold leading-none text-white">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>

      <nav className="flex items-center gap-2 border-t border-base-border/60 px-4 py-2 sm:hidden">
        {links.map((link) => {
          const active = pathname === link.match;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1 font-display text-sm tracking-wide ${
                active ? "bg-base-card text-accent" : "text-base-muted"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
