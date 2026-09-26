"use client";

import { useState, useRef, useEffect } from "react";
import { SortKey } from "@/lib/types";
import { ChevronDownIcon } from "./icons";

const options: { key: SortKey; label: string }[] = [
  { key: "duration", label: "Duration" },
  { key: "calories", label: "Calories" },
  { key: "rating", label: "Rating" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = options.find((o) => o.key === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-w-[10rem] items-center justify-between gap-3 rounded-lg border border-base-border bg-base-card px-4 py-2 text-sm text-white hover:border-accent/60"
      >
        <span className="font-medium">{current.label}</span>
        <ChevronDownIcon className={`h-4 w-4 text-base-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-base-border bg-base-card shadow-lg shadow-black/40">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-base-surface ${
                opt.key === value ? "text-accent" : "text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
