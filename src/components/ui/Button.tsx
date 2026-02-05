"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-500 text-white hover:bg-brand-400 focus:ring-brand-500",
    secondary:
      "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500",
    ghost:
      "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800 focus:ring-gray-500",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Sending...
        </>
      ) : (
        children
      )}
    </button>
  );
}
