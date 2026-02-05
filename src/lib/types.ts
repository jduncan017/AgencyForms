/** Field types that can be requested for each credential group */
export type FieldType = "url" | "username" | "password" | "email" | "apiToken" | "notes" | "registrar";

/** A single credential group (e.g., "Domain Login" with url, username, password) */
export interface CredentialGroup {
  /** Display name for this platform/service */
  platform: string;
  /** Which fields to collect */
  fields: FieldType[];
}

/**
 * The config that gets encoded into the form URL.
 * Contains everything needed to render the client form.
 */
export interface FormConfig {
  /** Client's display name */
  clientName: string;
  /** Email where the completed PDF gets sent */
  returnEmail: string;
  /** Preset shorthand codes (e.g., ["dl", "pd"]) */
  presets: string[];
  /** Custom credential groups (non-preset) */
  custom: CredentialGroup[];
}

/** A single field value submitted by the client */
export interface FieldValue {
  label: string;
  value: string;
  type: FieldType;
}

/** A group of field values submitted by the client */
export interface CredentialGroupValue {
  platform: string;
  fields: FieldValue[];
  loginUrl?: string;
}

/** The full submission payload sent to /api/submit */
export interface SubmissionPayload {
  clientName: string;
  returnEmail: string;
  credentials: CredentialGroupValue[];
}
