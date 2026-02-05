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

**AgencyForms (SecureCollect)** — a stateless credential collection app for DigitalNova Studio, built on the T3 Stack (Next.js 15, React 19, TypeScript strict mode).

### Flow
1. Admin visits `/generate`, selects preset credential groups (Domain Login, Pipedrive, cal.com) and/or adds custom groups, toggles image uploads, enters client info, and sends the form link via email
2. Client visits `/form?data=...`, goes through a slide-based onboarding (intro → setup instructions → credential entry → optional image uploads)
3. `/api/submit` generates a password-protected PDF (pdfkit) and emails it to the admin via Resend
4. Client sees `/success` thank you page

### Key directories
- **`src/components/ui/`** — Reusable UI primitives (Button, Input, PasswordInput, Checkbox, Card, CopyField)
- **`src/components/`** — Domain components (PresetSelector, CustomFieldGroup, CredentialInput, IntroSlide, InstructionSlide, UploadSlide, SlideProgress, SlideNavigation, RegistrarDropdown, Navbar, FormWrapper)
- **`src/lib/`** — Pure logic: types, presets, providers (platform logos/login URLs/registrars), config encoding/decoding, PDF generation, email sending, UploadThing client helpers
- **`src/app/api/`** — API routes: `send-link` (emails form link), `submit` (PDF + email to admin), `uploadthing` (UploadThing file router)

### Slide-based form
The client form uses a flat array of typed slide descriptors (`intro | instruction | credential | upload`). Slides animate via CSS `transform: translateX()` with `transition-transform duration-400`. Desktop uses side navigation arrows; mobile uses bottom buttons. Instruction slides support **bold** text markers and inline images.

### Config encoding
Form config is encoded as compact JSON → base64url in the URL `?data=` param. Preset groups use shorthand codes (`dl`, `pd`, `cal`) to keep URLs short. See `src/lib/config-codec.ts` and `src/lib/presets.ts`.

### Preset system
Presets in `src/lib/presets.ts` define credential groups with optional multi-step instruction slides shown before credential entry. Platform logos, login URLs, and domain registrar data live in `src/lib/providers.ts`.

### Important: pdfkit bundling
pdfkit is listed in `serverExternalPackages` in `next.config.js` so Next.js does not bundle it with webpack. Without this, pdfkit cannot find its built-in font files (`.afm`) at runtime and PDF generation fails.

### File uploads
UploadThing handles image uploads. The file router at `src/app/api/uploadthing/core.ts` accepts images only (max 16MB, 10 files). Client helpers are generated in `src/lib/uploadthing.ts`.

### Environment variables
`RESEND_API_KEY`, `PDF_PASSWORD`, `EMAIL_FROM`, `UPLOADTHING_TOKEN` — defined in `src/env.js` with Zod validation. Use `SKIP_ENV_VALIDATION=1` for builds without env vars.

**Path alias:** `~/` maps to `src/`

## Code Style

- ESLint flat config with typescript-eslint (`recommended`, `recommendedTypeChecked`, `stylisticTypeChecked`)
- Prettier with `prettier-plugin-tailwindcss` for automatic class sorting
- Prefer inline type imports (`import { type Foo }` over `import type { Foo }`)
- Unused variables prefixed with `_` are allowed
- Resend client must be instantiated inside request handlers (not at module scope) to avoid build-time errors
- Brand color is `#00A7D3`, defined as `brand-300` through `brand-900` in the Tailwind theme
