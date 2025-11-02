"use server";

import { PDFParse } from "pdf-parse";
import type { ParsedPdfData } from "@/components/pdf-upload";

export async function uploadPdfAction(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return [{ pdf: { errors: ["File is not selected!"] } }, null];
    }

    // validate file type
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return [{ pdf: { errors: ["Only PDF file is available"] } }, null];
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return [
        { pdf: { errors: ["File size should be lower than 10MB"] } },
        null,
      ];
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    const parsedData: ParsedPdfData = {
      filename: file.name,
      // pages: result.numpages || 0,
      text: result.text.trim(),
    };

    return [null, parsedData];
  } catch (error) {
    console.error("PDF parsing error:", error);
    return [
      {
        pdf: {
          errors: [
            `PDF parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
        },
      },
      null,
    ];
  }
}
