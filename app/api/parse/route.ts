import { type NextRequest, NextResponse } from "next/server";
import { parsePattern } from "@/lib/parsers/pattern-parser";
import { parsePDFFile } from "@/lib/parsers/pdf-parser";

// Node.js 런타임 사용
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "파일이 없습니다." },
        { status: 400 },
      );
    }

    // PDF 파일만 허용
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "pdf") {
      return NextResponse.json(
        { success: false, error: "PDF 파일만 업로드 가능합니다." },
        { status: 400 },
      );
    }

    // 1. PDF에서 텍스트 추출
    const text = await parsePDFFile(file);

    // 2. 텍스트를 ParsedPattern으로 변환
    const pattern = parsePattern(text, file.name);

    return NextResponse.json({ success: true, data: pattern });
  } catch (error) {
    console.error("파싱 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "파일 분석 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
