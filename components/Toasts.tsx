"use client";

import { useStore } from "@/lib/store";
import { CheckIcon } from "./icons";

export function Toasts() {
  const { toasts } = useStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:right-6 sm:left-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-card border border-base-border bg-base-card px-4 py-3 text-sm text-white shadow-lg shadow-black/40 animate-toast-in"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-black">
            <CheckIcon className="h-3 w-3" />
          </span>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
