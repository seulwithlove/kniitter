"use client";

import { useEffect, useState } from "react";
import PdfUploader, { type ParsedPdfData } from "@/components/pdf-upload";
import { uploadPdfAction } from "../pdf.action";
import BoxDialog from "./[id]/box-dialog";
import { getProjectsAction } from "./project.action";

export type Project = {
  id: number;
  content: string;
  isCompleted: boolean;
};

export default function ProjectBox() {
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
    // if there is any project, show projects
    // if not just show pdf uploader
    <div className="flex h-full justify-center border border-amber-400">
      <div className="flex h-full flex-col place-items-center gap-4 py-6">
        <div className="border-3 border-red-500 p-3">
          {projects.map((project) => (
            <BoxDialog key={project.id}>{project.content}</BoxDialog>
          ))}
        </div>

        {/* PDF Upload Section */}
        <div className="mx-auto flex flex-1 border-3 border-blue-300">
          <PdfUploader
            uploadPdf={uploadPdfAction}
            onSuccess={handlePdfSuccess}
          />
        </div>
      </div>
    </div>
  );
}
