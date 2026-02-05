import { Resend } from "resend";
import { env } from "~/env";

export async function sendCredentialPdf(
  to: string,
  clientName: string,
  pdfBuffer: Buffer,
) {
  const resend = new Resend(env.RESEND_API_KEY);
  const filename = `credentials-${clientName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Credentials Received — ${clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0a0a0f; color: #e5e7eb;">
        <h2 style="color: #f3f4f6; margin-bottom: 8px;">Credentials Received</h2>
        <p style="color: #9ca3af; line-height: 1.6;">
          <strong style="color: #f3f4f6;">${clientName}</strong> has submitted their credentials.
          The attached PDF is password-protected.
        </p>
        <hr style="border: none; border-top: 1px solid #1f2937; margin: 28px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          DigitalNova Studio &mdash; Design. Development. Marketing.
        </p>
      </div>
    `,
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
}
