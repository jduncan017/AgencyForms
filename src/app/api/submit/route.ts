import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import { type FieldType } from "~/lib/types";
import { generateEncryptedPdf } from "~/lib/pdf";
import { sendCredentialPdf } from "~/lib/email";

const FIELD_TYPES: FieldType[] = [
  "url",
  "username",
  "password",
  "email",
  "apiToken",
  "notes",
  "registrar",
];

const fieldValueSchema = z.object({
  label: z.string(),
  value: z.string(),
  type: z.enum(FIELD_TYPES as [FieldType, ...FieldType[]]),
});

const credentialGroupSchema = z.object({
  platform: z.string().min(1),
  fields: z.array(fieldValueSchema),
  loginUrl: z.string().url().optional(),
});

const uploadedFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  size: z.number(),
});

const submissionSchema = z.object({
  clientName: z.string().min(1),
  businessName: z.string().min(1),
  returnEmail: z.string().email(),
  credentials: z.array(credentialGroupSchema).min(1),
  uploads: z.array(uploadedFileSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const body = submissionSchema.parse(await request.json());

    // Generate password-protected PDF
    const pdfBytes = await generateEncryptedPdf(
      body.businessName,
      body.clientName,
      body.credentials,
      env.PDF_PASSWORD,
      body.uploads,
    );

    // Email PDF to the return address
    await sendCredentialPdf(body.returnEmail, body.businessName, body.clientName, pdfBytes, body.uploads);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 },
      );
    }
    console.error("Submit error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
