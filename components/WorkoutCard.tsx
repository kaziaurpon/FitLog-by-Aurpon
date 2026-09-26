import Image from "next/image";
import Link from "next/link";
import { Workout } from "@/lib/types";
import { ClockIcon, FlameIcon, StarIcon } from "./icons";

export function StatsRow({ workout }: { workout: Workout }) {
  return (
    <div className="flex items-center gap-3 text-xs text-base-muted">
      <span className="flex items-center gap-1">
        <ClockIcon className="h-3.5 w-3.5" />
        {workout.duration} min
      </span>
      <span className="flex items-center gap-1">
        <FlameIcon className="h-3.5 w-3.5" />
        {workout.calories} kcal
      </span>
      <span className="flex items-center gap-1 text-accent">
        <StarIcon className="h-3.5 w-3.5" />
        {workout.rating}
      </span>
    </div>
  );
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-base-border bg-base-card transition-colors hover:border-accent/70"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-surface">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {workout.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-base-border px-2 py-0.5 text-[10px] font-semibold tracking-wide text-base-muted"
            >
              {cat.toUpperCase()}
            </span>
          ))}
        </div>
        <h3 className="font-display text-base leading-tight tracking-wide text-white">
          {workout.name}
        </h3>
        <p className="text-xs text-base-muted">{workout.equipment}</p>
        <div className="mt-auto pt-2">
          <StatsRow workout={workout} />
        </div>
      </div>
    </Link>
  );
}
