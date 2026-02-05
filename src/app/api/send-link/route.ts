import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "~/env";

const bodySchema = z.object({
  clientName: z.string().min(1),
  businessName: z.string().min(1),
  clientEmail: z.string().email(),
  link: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: env.EMAIL_FROM,
      replyTo: "josh@digitalnovastudio.com",
      to: body.clientEmail,
      subject: `DigitalNova Studio — Credential Request for ${body.businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <!-- Logo -->
                    <tr>
                      <td style="padding-bottom: 32px;">
                        <img src="https://decks.digitalnovastudio.com/logo.png" alt="DigitalNova Studio" width="180" style="display: block;" />
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e;">
                        <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 600; color: #ffffff;">
                          Hello,
                        </h1>

                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0;">
                          DigitalNova Studio is requesting access credentials for <strong style="color: #ffffff;">${body.businessName}</strong>.
                          Please use the secure link below to submit the requested information.
                        </p>

                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0;">
                          All data is encrypted and transmitted securely. Your credentials will never be stored in plain text.
                        </p>

                        <!-- CTA Button -->
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #00A7D3 0%, #008fb3 100%); border-radius: 8px;">
                              <a href="${body.link}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
                                Open Secure Form
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
                          If the button doesn't work, copy and paste this link:
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #00A7D3; word-break: break-all;">
                          <a href="${body.link}" style="color: #00A7D3; text-decoration: none;">${body.link}</a>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding-top: 24px; text-align: center;">
                        <p style="margin: 0 0 4px 0; font-size: 14px; color: #666666;">
                          Questions? Just reply to this email.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #444444;">
                          DigitalNova Studio
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
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
