import { Resend } from "resend";
import { env } from "~/env";
import { type UploadedFile } from "~/lib/types";

export async function sendClientCopyPdf(
  to: string,
  businessName: string,
  clientName: string,
  pdfBuffer: Buffer,
) {
  const resend = new Resend(env.RESEND_API_KEY);
  const filename = `credentials-${businessName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Your Credentials — ${businessName}`,
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
                        Your Credentials
                      </h1>

                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0;">
                        Here's your password-protected copy of the credentials you submitted for <strong style="color: #ffffff;">${businessName}</strong>. Open the attached PDF with the password you chose.
                      </p>

                      <!-- Info callout -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #0d1f25; border: 1px solid #1a3a44; border-radius: 8px; padding: 16px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #a0a0a0;">
                              Keep this email safe. The PDF is encrypted with the password you set during submission.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #444444;">
                        DigitalNova Studio &mdash; SecureCollect
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
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
}

export async function sendCredentialPdf(
  to: string,
  businessName: string,
  clientName: string,
  pdfBuffer: Buffer,
  uploads?: UploadedFile[],
) {
  const resend = new Resend(env.RESEND_API_KEY);
  const filename = `credentials-${businessName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: `Credentials Received — ${businessName}`,
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
                        Credentials Received
                      </h1>

                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0;">
                        <strong style="color: #ffffff;">${businessName}</strong> (${clientName}) has submitted their credentials.
                      </p>

                      <!-- Info callout -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #0d1f25; border: 1px solid #1a3a44; border-radius: 8px; padding: 16px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #a0a0a0;">
                              The attached PDF is password-protected. Open it with the configured password to view the credentials.
                            </p>
                          </td>
                        </tr>
                      </table>

                      ${
                        uploads && uploads.length > 0
                          ? `
                      <!-- Uploaded files -->
                      <div style="margin-top: 24px;">
                        <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                          Uploaded Files
                        </h2>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${uploads
                            .map(
                              (file) => `
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #1a1a2e;">
                              <a href="${file.url}" style="color: #00A7D3; text-decoration: none; font-size: 14px;" target="_blank">
                                ${file.name}
                              </a>
                            </td>
                          </tr>`,
                            )
                            .join("")}
                        </table>
                      </div>`
                          : ""
                      }
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 24px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #444444;">
                        DigitalNova Studio &mdash; SecureCollect
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
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
}
