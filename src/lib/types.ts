/** Field types that can be requested for each credential group */
export type FieldType = "url" | "username" | "password" | "email" | "apiToken" | "notes" | "registrar";

/** An instruction step shown before credential entry for preset groups */
export interface InstructionStep {
  title: string;
  body: string;
  linkUrl?: string;
  linkLabel?: string;
  highlight?: string;
  /** Path to an image displayed inside the card (e.g. a screenshot) */
  image?: string;
}

/** A single credential group (e.g., "Domain Login" with url, username, password) */
export interface CredentialGroup {
  /** Display name for this platform/service */
  platform: string;
  /** Which fields to collect */
  fields: FieldType[];
  /** Optional signup URL shown as an instruction slide before credential entry */
  signupUrl?: string;
}

/**
 * The config that gets encoded into the form URL.
 * Contains everything needed to render the client form.
 */
export interface FormConfig {
  /** Client contact name (person) */
  clientName: string;
  /** Business / company name */
  businessName: string;
  /** Email where the completed PDF gets sent */
  returnEmail: string;
  /** Preset shorthand codes (e.g., ["dl", "pd"]) */
  presets: string[];
  /** Custom credential groups (non-preset) */
  custom: CredentialGroup[];
  /** Link expiry timestamp (ms since epoch) */
  expiresAt?: number;
  /** Whether to show a file upload slide */
  requestUploads?: boolean;
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

/** A file uploaded by the client via UploadThing */
export interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

/** The full submission payload sent to /api/submit */
export interface SubmissionPayload {
  clientName: string;
  businessName: string;
  returnEmail: string;
  credentials: CredentialGroupValue[];
  uploads?: UploadedFile[];
  clientCopy?: { email: string; password: string };
}
