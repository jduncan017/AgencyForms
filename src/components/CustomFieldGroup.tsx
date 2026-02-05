"use client";

import { Trash2, Plus } from "lucide-react";
import { type CredentialGroup, type FieldType } from "~/lib/types";
import { FieldMultiSelect } from "./FieldMultiSelect";
import { Card } from "./ui/Card";

interface CustomFieldGroupProps {
  groups: CredentialGroup[];
  onChange: (index: number, group: CredentialGroup) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function CustomFieldGroup({
  groups,
  onChange,
  onRemove,
  onAdd,
}: CustomFieldGroupProps) {
  if (groups.length === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="w-full cursor-pointer rounded-xl border border-dashed border-gray-700 bg-gray-900/30 px-6 py-8 text-base text-gray-500 transition-colors hover:border-gray-600 hover:text-gray-400"
      >
        + Custom Fields
      </button>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {groups.map((group, i) => (
          <div key={i}>
            {i > 0 && <div className="mb-4 border-t border-gray-800" />}
            <div className="flex items-start gap-2">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <input
                  value={group.platform}
                  onChange={(e) =>
                    onChange(i, { ...group, platform: e.target.value })
                  }
                  placeholder="Platform name"
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-base text-gray-100 placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)]"
                />
                <div className="sm:w-64">
                  <FieldMultiSelect
                    selected={group.fields}
                    onChange={(fields: FieldType[]) =>
                      onChange(i, { ...group, fields })
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="mt-2.5 cursor-pointer shrink-0 rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-red-400"
                aria-label="Remove platform"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onAdd}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-400"
          aria-label="Add platform"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
