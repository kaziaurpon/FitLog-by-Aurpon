"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchWorkoutById } from "@/lib/api";
import { Workout } from "@/lib/types";
import { useStore, PLAN_CAP_SIZE } from "@/lib/store";
import { ClockIcon, FlameIcon, PlusIcon, StarIcon, BookmarkIcon } from "@/components/icons";

const specRows = (w: Workout) => [
  { label: "EQUIPMENT", value: w.equipment },
  { label: "DIFFICULTY", value: w.difficulty },
  { label: "SETS", value: String(w.sets) },
  { label: "REPS", value: w.reps },
  { label: "DURATION", value: `${w.duration} min` },
  { label: "CALORIES", value: `${w.calories} kcal` },
  { label: "RATING", value: String(w.rating) },
];

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToPlan, addToSaved, isInPlan, isSaved, isPlanFull, showToast } =
    useStore();

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchWorkoutById(params.id)
      .then((data) => {
        if (active) setWorkout(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-base-border border-t-accent" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl uppercase text-white">
          Workout not found
        </h1>
        <p className="mt-3 text-sm text-base-muted">
          This lift doesn&apos;t exist in the library, or the link is broken.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black"
        >
          Back to workouts
        </Link>
      </div>
    );
  }

  const inPlan = isInPlan(workout.id);
  const saved = isSaved(workout.id);
  const disableAdd = inPlan || (isPlanFull && !inPlan);

  const handleAddToPlan = () => {
    if (disableAdd) return;
    addToPlan(workout.id);
    showToast("Added to today's plan");
  };

  const handleSave = () => {
    if (saved) return;
    addToSaved(workout.id);
    showToast("Saved for later");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-card border border-base-border bg-base-card">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            {workout.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-base-muted">
            {workout.description}
          </p>

          {/* Updated Category Tags: Solid Lime background, Black text, Title Case */}
          <div className="mt-4 flex flex-wrap gap-2">
            {workout.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-accent px-3 py-1 text-xs font-semibold capitalize text-black"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-card border border-base-border">
            {specRows(workout).map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i % 2 === 0 ? "bg-base-card" : "bg-base-surface"
                }`}
              >
                <span className="font-display tracking-wide text-base-muted">
                  {row.label}
                </span>
                <span className="font-medium text-white">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg uppercase tracking-wide text-white">
              Instructions
            </h2>
            <ol className="mt-3 space-y-3">
              {workout.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-base-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-base-card text-xs font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToPlan}
              disabled={disableAdd}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <PlusIcon className="h-4 w-4" />
              {inPlan
                ? "Already in plan"
                : isPlanFull
                ? `Plan full (${PLAN_CAP_SIZE})`
                : "Add to today's plan"}
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex items-center justify-center gap-2 rounded-full border border-base-border px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <BookmarkIcon className="h-4 w-4" />
              {saved ? "Saved" : "Save for later"}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-base-muted">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" /> {workout.duration} min
            </span>
            <span className="flex items-center gap-1">
              <FlameIcon className="h-4 w-4" /> {workout.calories} kcal
            </span>
            <span className="flex items-center gap-1 text-accent">
              <StarIcon className="h-4 w-4" /> {workout.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
