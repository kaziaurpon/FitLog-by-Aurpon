import { Workout } from "./types";

const LIST_URL = "https://api.abcz.workers.dev/api/fitlog";
const DETAIL_URL = "https://api.abcz.workers.dev/api/fitlog";

// The public API's exact field names aren't documented, so this layer
// normalizes several likely shapes into one consistent `Workout` type.
// This keeps the rest of the app decoupled from the raw API response.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawWorkout = Record<string, any>;

function pick(raw: RawWorkout, keys: string[], fallback: unknown = undefined) {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null && raw[key] !== "") {
      return raw[key];
    }
  }
  return fallback;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "string" ? parseFloat(value) : (value as number);
  return typeof n === "number" && !Number.isNaN(n) ? n : fallback;
}

let idCounter = 0;

export function normalizeWorkout(raw: RawWorkout): Workout {
  idCounter += 1;
  const id = String(
    pick(raw, ["id", "_id", "workoutId", "slug"], `workout-${idCounter}`)
  );

  const instructionsRaw = pick(
    raw,
    ["instructions", "steps", "howTo", "how_to", "guide"],
    []
  );
  const instructions = Array.isArray(instructionsRaw)
    ? instructionsRaw.map((s) => String(s))
    : toArray(instructionsRaw);

  return {
    id,
    name: String(
      pick(raw, ["name", "title", "workoutName", "exercise"], "Untitled Lift")
    ).toUpperCase(),
    image: String(
      pick(
        raw,
        ["image", "img", "thumbnail", "photo", "illustration", "picture"],
        "/assets/banner.png"
      )
    ),
    
    categories: toArray(
      pick(
        raw,
        ["muscleGroups", "categories", "category", "tags", "muscleGroup", "target"],
        []
      )
    ),
    equipment: String(
      pick(raw, ["equipment", "equipments", "gear"], "Bodyweight")
    ),
    difficulty: String(
      pick(raw, ["difficulty", "level"], "Intermediate")
    ),
    sets: pick(raw, ["sets", "set"], 3),
    reps: String(pick(raw, ["reps", "rep", "repetitions"], "8-12")),
    duration: toNumber(pick(raw, ["duration", "time", "durationMinutes"], 20)),
    calories: toNumber(pick(raw, ["calories", "kcal", "caloriesBurned"], 150)),
    rating: toNumber(pick(raw, ["rating", "stars", "score"], 4.5)),
    description: String(
      pick(
        raw,
        ["description", "desc", "summary", "subtitle"],
        "A focused, effective lift worth adding to your rotation."
      )
    ),
    instructions:
      instructions.length > 0
        ? instructions
        : [
            "Set up with a stable base and neutral spine.",
            "Engage your core and initiate the movement with control.",
            "Move through the full range of motion, breathing steadily.",
            "Return to the start position and reset before the next rep.",
          ],
  };
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const res = await fetch(LIST_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load workouts (${res.status})`);
  }
  const data = await res.json();
  const list: RawWorkout[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.workouts)
    ? data.workouts
    : Array.isArray(data?.result)
    ? data.result
    : [];
  return list.map(normalizeWorkout);
}

export async function fetchWorkoutById(id: string): Promise<Workout | null> {
  try {
    const res = await fetch(`${DETAIL_URL}/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const raw = data?.data ?? data?.workout ?? data;
      if (raw && !Array.isArray(raw)) {
        return normalizeWorkout(raw);
      }
    }
  } catch {
    // fall through to list-based lookup
  }
  // Fallback: some APIs only expose the full list; find the match there.
  const all = await fetchWorkouts();
  return all.find((w) => w.id === id) ?? null;
}
