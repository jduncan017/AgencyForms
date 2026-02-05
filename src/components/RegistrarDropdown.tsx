"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { DOMAIN_REGISTRARS, type ServiceProvider } from "~/lib/providers";

interface RegistrarDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function RegistrarDropdown({ value, onChange }: RegistrarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = DOMAIN_REGISTRARS.find((r) => r.id === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-base font-medium text-gray-300">
        Domain Registrar
      </label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-left text-base transition-colors focus:border-brand-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)]"
        >
          {selected ? (
            <RegistrarOption registrar={selected} />
          ) : (
            <span className="text-gray-500">Select a registrar...</span>
          )}
          <ChevronIcon className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
            {DOMAIN_REGISTRARS.map((registrar) => (
              <button
                key={registrar.id}
                type="button"
                onClick={() => handleSelect(registrar.id)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-gray-700 ${
                  value === registrar.id ? "bg-gray-700/50" : ""
                }`}
              >
                <RegistrarOption registrar={registrar} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelect("custom")}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-base text-gray-300 transition-colors hover:bg-gray-700 ${
                value === "custom" ? "bg-gray-700/50" : ""
              }`}
            >
              Other (custom)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RegistrarOption({ registrar }: { registrar: ServiceProvider }) {
  return (
    <>
      {registrar.logo ? (
        <Image
          src={registrar.logo}
          alt=""
          width={20}
          height={20}
          className="shrink-0 rounded"
        />
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gray-600 text-xs font-bold text-gray-300">
          {registrar.name.charAt(0)}
        </span>
      )}
      <span className="text-base text-gray-100">{registrar.name}</span>
    </>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
