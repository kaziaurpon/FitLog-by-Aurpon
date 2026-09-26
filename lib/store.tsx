"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlanItem, SavedItem, ToastKind, ToastMessage } from "./types";

const PLAN_KEY = "fitlog.plan";
const SAVED_KEY = "fitlog.saved";
const PLAN_CAP = 5;

interface StoreContextValue {
  plan: PlanItem[];
  saved: SavedItem[];
  planCount: number;
  savedCount: number;
  isPlanFull: boolean;
  isInPlan: (id: string) => boolean;
  isSaved: (id: string) => boolean;
  addToPlan: (id: string) => void;
  addToSaved: (id: string) => void;
  removeFromPlan: (id: string) => void;
  removeFromSaved: (id: string) => void;
  markDone: (id: string) => void;
  toasts: ToastMessage[];
  showToast: (text: string, kind?: ToastKind) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const toastIdRef = useRef(0);

  useEffect(() => {
    setPlan(readStorage<PlanItem>(PLAN_KEY));
    setSaved(readStorage<SavedItem>(SAVED_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  const showToast = useCallback((text: string, kind: ToastKind = "success") => {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const isInPlan = useCallback(
    (id: string) => plan.some((p) => p.workoutId === id),
    [plan]
  );
  const isSaved = useCallback(
    (id: string) => saved.some((s) => s.workoutId === id),
    [saved]
  );

  const addToPlan = useCallback(
    (id: string) => {
      setPlan((prev) => {
        if (prev.some((p) => p.workoutId === id)) return prev;
        if (prev.length >= PLAN_CAP) return prev;
        return [...prev, { workoutId: id, addedAt: Date.now(), status: "pending" }];
      });
    },
    []
  );

  const addToSaved = useCallback((id: string) => {
    setSaved((prev) => {
      if (prev.some((s) => s.workoutId === id)) return prev;
      return [...prev, { workoutId: id, addedAt: Date.now() }];
    });
  }, []);

  const removeFromPlan = useCallback((id: string) => {
    setPlan((prev) => prev.filter((p) => p.workoutId !== id));
  }, []);

  const removeFromSaved = useCallback((id: string) => {
    setSaved((prev) => prev.filter((s) => s.workoutId !== id));
  }, []);

  const markDone = useCallback((id: string) => {
    setPlan((prev) =>
      prev.map((p) => (p.workoutId === id ? { ...p, status: "done" } : p))
    );
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      plan,
      saved,
      planCount: plan.length,
      savedCount: saved.length,
      isPlanFull: plan.length >= PLAN_CAP,
      isInPlan,
      isSaved,
      addToPlan,
      addToSaved,
      removeFromPlan,
      removeFromSaved,
      markDone,
      toasts,
      showToast,
    }),
    [plan, saved, isInPlan, isSaved, addToPlan, addToSaved, removeFromPlan, removeFromSaved, markDone, toasts, showToast]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const PLAN_CAP_SIZE = PLAN_CAP;
