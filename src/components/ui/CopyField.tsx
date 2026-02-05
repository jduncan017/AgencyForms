"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyFieldProps {
  value: string;
  label?: string;
}

export function CopyField({ value, label }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-base font-medium text-gray-300">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={value}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 font-mono text-sm text-gray-300 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-400" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
