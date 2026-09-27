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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="FitLog" width={26} height={26} />
          <span className="font-display text-lg tracking-wide text-white font-bold uppercase">
            FITLOG
          </span>
        </Link>

        {/* Middle: Standalone Rounded-Rectangle Links (No Outer Capsule) */}
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.match;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 font-display text-sm tracking-wide transition-all ${
                  active
                    ? "bg-[#27272a] text-accent font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Plan & Saved Counter Badges */}
        <div className="flex items-center gap-4">
          {/* Plan Badge */}
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            aria-label="Today's plan"
          >
            <span>Plan</span>
            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-accent px-2 text-xs font-bold text-black">
              {planCount}
            </span>
          </Link>

          {/* Saved Badge */}
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            aria-label="Saved workouts"
          >
            <span>Saved</span>
            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full border border-white px-2 text-xs font-bold text-white">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
