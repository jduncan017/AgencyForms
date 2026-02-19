import { type FormConfig, type CredentialGroup } from "./types";
import { getPresetByCode } from "./presets";

/**
 * Compact config format for URL encoding.
 * Presets are stored as shorthand codes; custom groups are stored in full.
 */
interface CompactConfig {
  cn: string; // clientName
  bn: string; // businessName
  re: string; // returnEmail
  p: string[]; // preset codes
  c: { n: string; f: string[]; s?: string }[]; // custom groups: name + fields + optional signup URL
  ex?: number; // expiry timestamp (seconds since epoch)
  u?: 1; // request file uploads
}

/** Encode a FormConfig into a base64url string for use in URLs */
export function encodeConfig(config: FormConfig): string {
  const compact: CompactConfig = {
    cn: config.clientName,
    bn: config.businessName,
    re: config.returnEmail,
    p: config.presets,
    c: config.custom.map((g) => ({
      n: g.platform,
      f: g.fields,
      s: g.signupUrl ?? undefined,
    })),
    ex: config.expiresAt ? Math.floor(config.expiresAt / 1000) : undefined,
    u: config.requestUploads ? 1 : undefined,
  };

  const json = JSON.stringify(compact);
  // base64url: standard base64 with + → -, / → _, no padding
  const base64 = btoa(json);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a base64url string back into a FormConfig */
export function decodeConfig(encoded: string): FormConfig {
  // Restore standard base64
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  const json = atob(base64);
  const compact = JSON.parse(json) as CompactConfig;

  return {
    clientName: compact.cn,
    businessName: compact.bn ?? compact.cn,
    returnEmail: compact.re,
    presets: compact.p,
    custom: compact.c.map(
      (g): CredentialGroup => ({
        platform: g.n,
        fields: g.f as CredentialGroup["fields"],
        signupUrl: g.s ?? undefined,
      }),
    ),
    expiresAt: compact.ex ? compact.ex * 1000 : undefined,
    requestUploads: compact.u === 1,
  };
}

/**
 * Resolve a FormConfig into the full list of credential groups.
 * Expands preset codes into their full definitions and appends custom groups.
 */
export function resolveGroups(config: FormConfig): CredentialGroup[] {
  const groups: CredentialGroup[] = [];

  for (const code of config.presets) {
    const preset = getPresetByCode(code);
    if (preset) {
      groups.push(preset.group);
    }
  }

  groups.push(...config.custom);
  return groups;
}
