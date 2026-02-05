"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type FieldType } from "~/lib/types";
import { ALL_FIELD_TYPES, FIELD_LABELS } from "~/lib/presets";

interface FieldMultiSelectProps {
  selected: FieldType[];
  onChange: (fields: FieldType[]) => void;
}

export function FieldMultiSelect({
  selected,
  onChange,
}: FieldMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (field: FieldType) => {
    if (selected.includes(field)) {
      onChange(selected.filter((f) => f !== field));
    } else {
      onChange([...selected, field]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-left text-base transition-colors focus:border-brand-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)]"
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-gray-500">Select fields...</span>
          ) : (
            selected.map((f) => (
              <span
                key={f}
                className="inline-flex items-center rounded-md bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-300"
              >
                {FIELD_LABELS[f]}
              </span>
            ))
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
          {ALL_FIELD_TYPES.map((field) => (
            <label
              key={field}
              className="flex cursor-pointer items-center gap-2.5 px-3.5 py-2 transition-colors hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(field)}
                onChange={() => toggle(field)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
              />
              <span className="text-base text-gray-200">
                {FIELD_LABELS[field]}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
