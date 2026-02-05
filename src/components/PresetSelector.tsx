"use client";

import Image from "next/image";
import { PRESETS, FIELD_LABELS } from "~/lib/presets";
import { PLATFORM_LOGOS } from "~/lib/providers";
import { Card } from "./ui/Card";

interface PresetSelectorProps {
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}

export function PresetSelector({ selected, onChange }: PresetSelectorProps) {
  const toggle = (code: string) => {
    const next = new Set(selected);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    onChange(next);
  };

  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold text-gray-100">
        Common Credentials
      </h2>
      <div className="space-y-3">
        {PRESETS.map((preset) => {
          const logo = PLATFORM_LOGOS[preset.group.platform];
          const inputId = `preset-${preset.code}`;
          const fieldLabels = preset.group.fields
            .map((f) => FIELD_LABELS[f])
            .join(", ");

          return (
            <label
              key={preset.code}
              htmlFor={inputId}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={selected.has(preset.code)}
                onChange={() => toggle(preset.code)}
                className="h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
              />
              {logo ? (
                <Image
                  src={logo}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0 rounded"
                />
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-600 text-[10px] font-bold text-gray-300">
                  {preset.group.platform.charAt(0)}
                </span>
              )}
              <span className="text-base text-gray-300">
                {preset.group.platform}{" "}
                <span className="text-gray-500">({fieldLabels})</span>
              </span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}
