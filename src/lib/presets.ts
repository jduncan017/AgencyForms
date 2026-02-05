import { type CredentialGroup, type FieldType } from "./types";

export interface PresetDefinition {
  code: string;
  group: CredentialGroup;
}

export const PRESETS: PresetDefinition[] = [
  {
    code: "dl",
    group: {
      platform: "Domain Login",
      fields: ["registrar", "username", "password"],
    },
  },
  {
    code: "pd",
    group: {
      platform: "Pipedrive",
      fields: ["email", "password"],
    },
  },
  {
    code: "cal",
    group: {
      platform: "cal.com",
      fields: ["email", "password"],
    },
  },
];

/** Look up a preset by its shorthand code */
export function getPresetByCode(code: string): PresetDefinition | undefined {
  return PRESETS.find((p) => p.code === code);
}

/** Human-readable label for a field type */
export const FIELD_LABELS: Record<FieldType, string> = {
  url: "URL",
  username: "Username",
  password: "Password",
  email: "Email",
  apiToken: "API Token",
  notes: "Notes",
  registrar: "Domain Registrar",
};

/** All available field types for custom groups */
export const ALL_FIELD_TYPES: FieldType[] = [
  "url",
  "username",
  "password",
  "email",
  "apiToken",
  "notes",
];
