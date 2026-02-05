import { type CredentialGroup, type FieldType, type InstructionStep } from "./types";

export interface PresetDefinition {
  code: string;
  group: CredentialGroup;
  instructions?: InstructionStep[];
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
    instructions: [
      {
        title: "Create Your Pipedrive Account",
        body: "Use the link below to sign up for Pipedrive. This referral link gives you an extended **30-day free trial** instead of the standard 14 days.\n\n**Important:** Sign up using your **email address** — do **NOT** use Google Sign-In, as this will make it harder for us to access your account for setup.",
        linkUrl: "https://www.pipedrive.com/taf/TNNPCN",
        linkLabel: "Sign Up for Pipedrive",
        highlight: "Extended 30-day free trial with this link!",
      },
      {
        title: "Choose Your Plan",
        body: "Once you're signed in, look for the **\"View billing plans\"** link at the very top of the page.\n\nClick that link, then pick the **Lite plan** — it's **$24/month**, or **$14/month** if you choose annual billing. That's all we need!",
        image: "/pipedrive-billing.png",
      },
    ],
  },
  {
    code: "cal",
    group: {
      platform: "cal.com",
      fields: ["email", "password"],
    },
    instructions: [
      {
        title: "Create Your cal.com Account",
        body: "Use the referral link below to create your cal.com account. This saves you **20%** if you decide to upgrade later, but **no paid plan is required** to get started.",
        linkUrl: "https://refer.cal.com/digitalnovastudio",
        linkLabel: "Sign Up for cal.com",
        highlight: "Save 20% on any future upgrade!",
      },
    ],
  },
];

/** Look up a preset by its shorthand code */
export function getPresetByCode(code: string): PresetDefinition | undefined {
  return PRESETS.find((p) => p.code === code);
}

/** Look up a preset by its platform display name */
export function getPresetByPlatform(
  platform: string,
): PresetDefinition | undefined {
  return PRESETS.find((p) => p.group.platform === platform);
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
