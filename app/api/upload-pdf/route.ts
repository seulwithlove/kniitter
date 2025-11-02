import { type NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { detail: "File is not selected!" },
        { status: 400 },
      );
    }
    // validate PDF extension
    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { detail: "Only PDF files are allowed!" },
        { status: 400 },
      );
    }

    // validate file size(10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { detail: "File size must be smaller than 10MB" },
        { status: 400 },
      );
    }

    // convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // parse PDF
    const data = await pdf(buffer);

    return NextResponse.json({
      filename: file.name,
      pages: data.numpages,
      text: data.text.trim(),
    });
  } catch (error) {
    console.log("PDF parsing error:", error);
    return NextResponse.json(
      {
        detail: `Errors from processing PDF: ${error instanceof Error ? error.message : "Unknown Errors"} `,
      },
      { status: 500 },
    );
  }
}
