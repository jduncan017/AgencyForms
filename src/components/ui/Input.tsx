"use client";

import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-base font-medium text-gray-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-base text-gray-100 placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)] ${className}`}
        {...props}
      />
    </div>
  );
}
