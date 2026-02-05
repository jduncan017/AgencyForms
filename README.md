# AgencyForms (SecureCollect)

A stateless credential collection tool for [DigitalNova Studio](https://digitalnovastudio.com). Built on Next.js 15, React 19, and TypeScript.

## How It Works

1. **Admin** visits `/generate`, selects which credentials to request (Domain Login, Pipedrive, cal.com, or custom), enters client details, and sends a secure form link via email.
2. **Client** receives the link, follows guided onboarding steps (account setup instructions, credential entry), and optionally uploads images (logos, brand assets).
3. **Server** generates a password-protected PDF with all credentials and emails it to the admin via Resend. No data is stored.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **PDF Generation:** pdfkit (password-protected)
- **Email:** Resend
- **File Uploads:** UploadThing
- **Fonts:** Geist Sans (Google Fonts)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in RESEND_API_KEY, PDF_PASSWORD, EMAIL_FROM, UPLOADTHING_TOKEN

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com/api-keys) |
| `PDF_PASSWORD` | Password used to encrypt generated PDFs |
| `EMAIL_FROM` | Sender email (must be verified in Resend) |
| `UPLOADTHING_TOKEN` | Token from [UploadThing](https://uploadthing.com/dashboard) |

Use `SKIP_ENV_VALIDATION=1` for builds without env vars populated.

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run check        # Lint + typecheck
npm run format:write # Auto-format with Prettier
```

## Architecture

- **Stateless** — No database. All form config is encoded in the URL (`?data=` param). Credentials pass through the server only long enough to build the PDF and send the email.
- **Slide-based form** — Client-facing form uses animated slide transitions with progressive disclosure (intro → setup instructions → credential entry → optional image uploads).
- **Preset system** — Common credential groups (Domain Login, Pipedrive, cal.com) use shorthand codes for compact URLs and include guided setup instructions with screenshots.
- **Security** — HTTPS in transit, password-protected PDF at rest, no server-side credential storage, auto-expiring form links.
