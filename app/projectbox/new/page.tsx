"use client";

import { useEffect, useState } from "react";
import { uploadPdfAction } from "@/app/pdf.action";
import PdfUploader, { type ParsedPdfData } from "@/components/pdf-upload";
import type { Project } from "../page";
import { getProjectsAction } from "../project.action";

export default function NewProject() {
  const [parsedText, setParsedText] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjectsAction().then(setProjects);
  }, []);

  const handlePdfSuccess = (data: ParsedPdfData) => {
    console.log("Parsed PDF data:", data);
    setParsedText(data.text);

    // 여기서 파싱된 텍스트 추가 작업
    // 예 : 사이즈 인식, 단계 분리 등
  };

  return (
    /* PDF Upload Section */
    <div className="mx-auto flex flex-1 border-3 border-blue-300">
      <PdfUploader uploadPdf={uploadPdfAction} onSuccess={handlePdfSuccess} />
    </div>
  );
}
