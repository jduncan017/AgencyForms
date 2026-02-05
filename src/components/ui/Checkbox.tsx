"use client";

import { type InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({
  label,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={inputId}
      className={`flex cursor-pointer items-center gap-2.5 ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-offset-0"
        {...props}
      />
      <span className="text-base text-gray-300">{label}</span>
    </label>
  );
}
