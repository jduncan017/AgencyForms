"use client";

import Image from "next/image";
import { type CredentialGroup } from "~/lib/types";
import { FIELD_LABELS } from "~/lib/presets";
import { getRegistrarById, PLATFORM_LOGOS } from "~/lib/providers";
import { Input } from "./ui/Input";
import { PasswordInput } from "./ui/PasswordInput";
import { RegistrarDropdown } from "./RegistrarDropdown";
import { Card } from "./ui/Card";

interface CredentialInputProps {
  group: CredentialGroup;
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function CredentialInput({
  group,
  values,
  onChange,
}: CredentialInputProps) {
  // Determine the logo for the card header
  let headerLogo: string | undefined = PLATFORM_LOGOS[group.platform];

  // For Domain Login, show the selected registrar's logo instead
  if (group.fields.includes("registrar") && !headerLogo) {
    const registrarKey = "registrar";
    const selectedId = values[registrarKey] ?? "";
    const registrar = getRegistrarById(selectedId);
    if (registrar?.logo) {
      headerLogo = registrar.logo;
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        {headerLogo && (
          <Image
            src={headerLogo}
            alt={`${group.platform} logo`}
            width={28}
            height={28}
            className="rounded"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-100">
          {group.platform}
        </h3>
      </div>
      <div className="space-y-4">
        {group.fields.map((field) => {
          const label = FIELD_LABELS[field];
          const value = values[field] ?? "";

          if (field === "registrar") {
            const registrarKey = "registrar";
            const customKey = "registrar_custom";
            const selectedRegistrar = values[registrarKey] ?? "";
            const isCustom = selectedRegistrar === "custom";

            return (
              <div key={field} className="space-y-3">
                <RegistrarDropdown
                  value={selectedRegistrar}
                  onChange={(v) => onChange(registrarKey, v)}
                />
                {isCustom && (
                  <Input
                    label="Custom Registrar Name"
                    value={values[customKey] ?? ""}
                    onChange={(e) =>
                      onChange(customKey, e.target.value)
                    }
                    placeholder="Enter registrar name"
                  />
                )}
              </div>
            );
          }

          if (field === "password") {
            return (
              <PasswordInput
                key={field}
                label={label}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            );
          }

          if (field === "apiToken") {
            return (
              <PasswordInput
                key={field}
                label={label}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            );
          }

          if (field === "notes") {
            return (
              <div key={field} className="space-y-1.5">
                <label className="block text-base font-medium text-gray-300">
                  {label}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => onChange(field, e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-base text-gray-100 placeholder-gray-500 transition-colors focus:border-brand-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,167,211,0.15)]"
                />
              </div>
            );
          }

          return (
            <Input
              key={field}
              label={label}
              type={field === "email" ? "email" : field === "url" ? "url" : "text"}
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          );
        })}
      </div>
    </Card>
  );
}
