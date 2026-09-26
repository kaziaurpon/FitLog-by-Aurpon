"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchWorkouts } from "@/lib/api";
import { SortKey, Workout } from "@/lib/types";
import { useStore } from "@/lib/store";
import { SortDropdown } from "@/components/SortDropdown";
import {
  CheckIcon,
  ClockIcon,
  EyeIcon,
  FlameIcon,
  StarIcon,
  XIcon,
} from "@/components/icons";

type Tab = "today" | "saved";

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex-1 px-6 py-5 sm:px-8">
      <p className="text-xs text-base-muted">{label}</p>
      <p
        className={`mt-1 font-display text-3xl font-bold ${
          accent ? "text-accent" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function MyPlanPage() {
  const [library, setLibrary] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("today");
  const [sort, setSort] = useState<SortKey>("duration");
  const {
    plan,
    saved,
    removeFromPlan,
    removeFromSaved,
    markDone,
    showToast,
  } = useStore();

  useEffect(() => {
    let active = true;
    fetchWorkouts()
      .then((data) => {
        if (active) setLibrary(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const findWorkout = (id: string) => library.find((w) => w.id === id);

  const planWorkouts = useMemo(
    () =>
      plan
        .map((p) => ({ item: p, workout: findWorkout(p.workoutId) }))
        .filter((x): x is { item: typeof plan[number]; workout: Workout } => !!x.workout),
    [plan, library]
  );

  const savedWorkouts = useMemo(
    () =>
      saved
        .map((s) => ({ item: s, workout: findWorkout(s.workoutId) }))
        .filter((x): x is { item: typeof saved[number]; workout: Workout } => !!x.workout),
    [saved, library]
  );

  const metrics = useMemo(() => {
    return planWorkouts.reduce(
      (acc, { workout }) => ({
        exercises: acc.exercises + 1,
        minutes: acc.minutes + workout.duration,
        calories: acc.calories + workout.calories,
      }),
      { exercises: 0, minutes: 0, calories: 0 }
    );
  }, [planWorkouts]);

  const activeList = useMemo(() => {
    const list = tab === "today" ? planWorkouts : savedWorkouts;
    return [...list].sort((a, b) => {
      if (sort === "rating") return b.workout.rating - a.workout.rating;
      return a.workout[sort] - b.workout[sort];
    });
  }, [tab, planWorkouts, savedWorkouts, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
        My Plan
      </h1>
      <p className="mt-2 text-sm text-base-muted">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <div className="mt-8 flex flex-col divide-y divide-base-border rounded-card bg-base-card sm:flex-row sm:divide-x sm:divide-y-0">
        <MetricCell label="Exercises" value={metrics.exercises} accent />
        <MetricCell label="Minutes" value={metrics.minutes} />
        <MetricCell label="Calories" value={metrics.calories} />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 self-start rounded-full border border-base-border bg-base-card p-1">
          <button
            onClick={() => setTab("today")}
            className={`rounded-full px-4 py-1.5 font-display text-sm tracking-wide transition-colors ${
              tab === "today"
                ? "bg-base-surface text-accent"
                : "text-base-muted hover:text-white"
            }`}
          >
            Today&apos;s Plan
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`rounded-full px-4 py-1.5 font-display text-sm tracking-wide transition-colors ${
              tab === "saved"
                ? "bg-base-surface text-accent"
                : "text-base-muted hover:text-white"
            }`}
          >
            Saved
          </button>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-base-muted">Sort By</p>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-base-muted">
            <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-base-border border-t-accent" />
            <p className="text-sm">Loading workouts…</p>
          </div>
        )}

        {!loading && activeList.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-card border border-base-border bg-base-card px-6 py-16 text-center">
            <h2 className="font-display text-xl uppercase tracking-wide text-white">
              Nothing here yet
            </h2>
            <p className="max-w-sm text-sm text-base-muted">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-3 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black"
            >
              Go to workouts
            </Link>
          </div>
        )}

        {!loading && activeList.length > 0 && (
          <ul className="flex flex-col gap-4">
            {activeList.map(({ item, workout }) => {
              const isDone = tab === "today" && "status" in item && item.status === "done";
              return (
                <li
                  key={workout.id}
                  className="flex flex-col gap-4 rounded-card border border-base-border bg-base-card p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-base-surface sm:h-16 sm:w-24">
                    <Image
                      src={workout.image}
                      alt={workout.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-display text-base tracking-wide ${
                        isDone ? "text-base-muted line-through" : "text-white"
                      }`}
                    >
                      {workout.name}
                    </h3>
                    <p className="text-xs text-base-muted">{workout.equipment}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-base-muted">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" /> {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FlameIcon className="h-3.5 w-3.5" /> {workout.calories} kcal
                      </span>
                      <span className="flex items-center gap-1 text-accent">
                        <StarIcon className="h-3.5 w-3.5" /> {workout.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="flex items-center gap-1.5 rounded-full border border-base-border px-3 py-2 text-xs font-semibold text-white hover:border-accent hover:text-accent"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      View Details
                    </Link>
                    {tab === "today" && !isDone && (
                      <button
                        onClick={() => {
                          markDone(workout.id);
                          showToast("Marked as done");
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-black"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                        Mark as Done
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (tab === "today") {
                          removeFromPlan(workout.id);
                          showToast("Removed from today's plan", "info");
                        } else {
                          removeFromSaved(workout.id);
                          showToast("Removed from saved", "info");
                        }
                      }}
                      aria-label="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-base-border text-base-muted hover:border-red-400 hover:text-red-400"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
