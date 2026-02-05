# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack enabled)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run typecheck    # TypeScript type checking only
npm run check        # Lint + typecheck combined
npm run format:check # Check Prettier formatting
npm run format:write # Auto-format with Prettier
```

## Architecture

**SecureCollect** — a stateless credential collection app for DigitalNova Studio, built on the T3 Stack (Next.js 15, React 19, TypeScript strict mode).

### Flow
1. Admin visits `/generate`, selects preset credential groups (Domain Login, Pipedrive, cal.com) and/or adds custom groups, enters client info, and sends the form link to the client via email
2. Client visits `/form?data=...`, fills in credentials (passwords masked with visibility toggle), submits
3. `/api/submit` generates a password-protected PDF (pdfkit) and emails it to the admin via Resend
4. Client sees `/success` thank you page

### Key directories
- **`src/components/ui/`** — Reusable UI primitives (Button, Input, PasswordInput, Checkbox, Card, CopyField)
- **`src/components/`** — Domain components (PresetSelector, CustomFieldGroup, CredentialInput, Logo, FormWrapper)
- **`src/lib/`** — Pure logic: types, presets, config encoding/decoding, PDF generation, email sending
- **`src/app/api/`** — Two API routes: `send-link` (emails form link to client) and `submit` (PDF + email to admin)

### Config encoding
Form config is encoded as compact JSON → base64url in the URL `?data=` param. Preset groups use shorthand codes (`dl`, `pd`, `cal`) to keep URLs short. See `src/lib/config-codec.ts` and `src/lib/presets.ts`.

### Important: pdfkit bundling
pdfkit is listed in `serverExternalPackages` in `next.config.js` so Next.js does not bundle it with webpack. Without this, pdfkit cannot find its built-in font files (`.afm`) at runtime and PDF generation fails.

### Environment variables
`RESEND_API_KEY`, `PDF_PASSWORD`, `EMAIL_FROM` — defined in `src/env.js` with Zod validation. Use `SKIP_ENV_VALIDATION=1` for builds without env vars.

**Path alias:** `~/` maps to `src/`

## Code Style

- ESLint flat config with typescript-eslint (`recommended`, `recommendedTypeChecked`, `stylisticTypeChecked`)
- Prettier with `prettier-plugin-tailwindcss` for automatic class sorting
- Prefer inline type imports (`import { type Foo }` over `import type { Foo }`)
- Unused variables prefixed with `_` are allowed
- Resend client must be instantiated inside request handlers (not at module scope) to avoid build-time errors
