import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "~/env";

const bodySchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  link: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: body.clientEmail,
      subject: `DigitalNova Studio — Credential Request for ${body.clientName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0a0a0f; color: #e5e7eb;">
          <h2 style="color: #f3f4f6; margin-bottom: 8px;">Hello,</h2>
          <p style="color: #9ca3af; line-height: 1.6;">
            DigitalNova Studio is requesting access credentials for <strong style="color: #f3f4f6;">${body.clientName}</strong>.
            Please use the secure link below to submit the requested information.
          </p>
          <div style="margin: 28px 0;">
            <a href="${body.link}" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500;">
              Open Secure Form
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${body.link}" style="color: #60a5fa; word-break: break-all;">${body.link}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #1f2937; margin: 28px 0;" />
          <p style="color: #6b7280; font-size: 12px;">
            DigitalNova Studio &mdash; Design. Development. Marketing.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }
    console.error("Send link error:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
