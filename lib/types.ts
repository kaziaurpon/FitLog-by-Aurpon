export interface Workout {
  id: string;
  name: string;
  image: string;
  categories: string[];
  equipment: string;
  difficulty: string;
  sets: number | string;
  reps: string;
  duration: number;
  calories: number;
  rating: number;
  description: string;
  instructions: string[];
}

export type PlanStatus = "pending" | "done";

export interface PlanItem {
  workoutId: string;
  addedAt: number;
  status: PlanStatus;
}

export interface SavedItem {
  workoutId: string;
  addedAt: number;
}

export type SortKey = "duration" | "calories" | "rating";

export type ToastKind = "success" | "info" | "error";

export interface ToastMessage {
  id: number;
  text: string;
  kind: ToastKind;
}
