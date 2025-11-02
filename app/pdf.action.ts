"use server";

import type { ParsedPdfData } from "@/components/pdf-upload";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadPdfAction(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return [{ pdf: { errors: ["File is not selected!"] } }, null];
    }

    // validate file type
    if (file.type !== "application/pdf") {
      return [{ pdf: { errors: ["Only PDF file is available"] } }, null];
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return [
        { pdf: { errors: ["File size should be lower than 10MB"] } },
        null,
      ];
    }

    // upload to FastAPI
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch(`${API_URL}/upload-pdf`, {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return [{ pdf: { errors: [error.detail || "Fail to upload"] } }, null];
    }

    const data: ParsedPdfData = await response.json();
    return [null, data];
  } catch (error) {
    console.error("Upload error:", error);
    return [
      {
        pdf: {
          errors: [error instanceof Error ? error.message : "Server Errors"],
        },
      },
      null,
    ];
  }
}
