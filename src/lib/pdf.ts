import PDFDocument from "pdfkit";
import { type CredentialGroupValue, type UploadedFile } from "./types";
import { FIELD_LABELS } from "./presets";

/**
 * Collect a PDFKit stream into a Buffer.
 */
function streamToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

export async function generateEncryptedPdf(
  businessName: string,
  clientName: string,
  credentials: CredentialGroupValue[],
  password: string,
  uploads?: UploadedFile[],
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "highResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false,
    },
  });

  const bufferPromise = streamToBuffer(doc);

  // Header
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("DigitalNova Studio", { align: "left" });

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor("#999999")
    .text("Credential Report", { align: "left" });

  doc.moveDown(0.5);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text(`Business: ${businessName}`);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#555555")
    .text(`Contact: ${clientName}`);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#999999")
    .text(
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    );

  doc.moveDown(1.5);

  // Credential sections
  for (const group of credentials) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text(group.platform);

    if (group.loginUrl) {
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#2563eb")
        .text(group.loginUrl, { link: group.loginUrl, underline: true });
    }

    doc.moveDown(0.3);

    for (const field of group.fields) {
      const label =
        FIELD_LABELS[field.type] ?? field.label;
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#555555")
        .text(`${label}: `, { continued: true })
        .fillColor("#222222")
        .text(field.value || "(not provided)");
    }

    doc.moveDown(1);
  }

  // Uploaded files section
  if (uploads && uploads.length > 0) {
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("Uploaded Files");

    doc.moveDown(0.3);

    for (const file of uploads) {
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#2563eb")
        .text(file.name, { link: file.url, underline: true });
    }

    doc.moveDown(1);
  }

  doc.end();
  return bufferPromise;
}
