"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { fetchWorkouts } from "@/lib/api";
import { Workout } from "@/lib/types";
import { WorkoutCard } from "@/components/WorkoutCard";
import { ArrowDownIcon, SearchIcon } from "@/components/icons";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchWorkouts()
      .then((data) => {
        if (active) setWorkouts(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = workouts;
    if (q) {
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    return list;
  }, [workouts, query]);

  return (
    <div>
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 rounded-card bg-base-card px-6 py-12 sm:px-10 lg:grid-cols-2 lg:py-16 lg:px-14">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-accent">
              WORKOUT LIBRARY
            </p>
            <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-wide text-white sm:text-5xl lg:text-6xl">
              Train with intent. Log every set.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-base-muted sm:text-base">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
              into today&apos;s plan, and watch the week&apos;s work add up.
            </p>
            <a
              href="#library"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              Browse Workouts
              <ArrowDownIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image
              src="/assets/banner.png"
              alt="Gym equipment illustration"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section id="library" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white">
                The Library
              </h2>
              <p className="mt-2 text-sm text-base-muted">
                Twelve lifts covering every major muscle group.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-base-border bg-base-card px-4 py-2 sm:self-end">
              <SearchIcon className="h-4 w-4 text-base-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or tag"
                className="w-40 bg-transparent text-sm text-white placeholder:text-base-muted focus:outline-none sm:w-56"
              />
            </div>
          </div>

          {loading && (
            <div className="mt-10 flex flex-col items-center justify-center gap-4 py-16 text-base-muted">
              <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-base-border border-t-accent" />
              <p className="text-sm">Loading workouts…</p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-10 rounded-card border border-base-border bg-base-card p-8 text-center text-sm text-base-muted">
              Couldn&apos;t load the library right now. Please refresh to try again.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="mt-10 rounded-card border border-base-border bg-base-card p-8 text-center text-sm text-base-muted">
              No workouts match your search.
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
