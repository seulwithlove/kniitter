"use client";

import { useRef, useState } from "react";
import {
  type ParsedPdfData,
  default as PdfUploader,
} from "@/components/pdf-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPdfAction } from "./pdf.action";

const mockData = [
  {
    id: 0,
    content: "muffler",
    isCompleted: true,
  },
  {
    id: 1,
    content: "socks",
    isCompleted: false,
  },
  {
    id: 2,
    content: "cardigan",
    isCompleted: false,
  },
];

export default function Home() {
  const [projects, setProjects] = useState(mockData);
  const [parsedText, setParsedText] = useState<string>("");

  const idRef = useRef(3);
  const [content, setContent] = useState("");

  const onCreate = () => {
    const newProject = {
      id: idRef.current++,
      content: content,
      isCompleted: false,
    };
    setProjects((pre) => [newProject, ...pre]);
    setContent("");
  };

  const handlePdfSuccess = (data: ParsedPdfData) => {
    console.log("Parsed PDF data:", data);
    setParsedText(data.text);

    // 여기서 파싱된 텍스트 추가 작업
    // 예 : 사이즈 인식, 단계 분리 등
  };

  return (
    <div className="mx-auto h-full">
      <div className="flex h-full w-full flex-col justify-around gap-3 bg-amber-500">
        {/* PDF Upload Section */}
        <div className="mx-auto w-full max-w-2xl">
          <PdfUploader
            uploadPdf={uploadPdfAction}
            onSuccess={handlePdfSuccess}
          />
        </div>

        {/* Project Input Section */}
        <div className="flex flex-1 place-items-center border-2 border-blue-500">
          <Input
            placeholder="Name your knit project!"
            type="text"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setContent(e.target.value);
            }}
          />
          <Button onClick={onCreate}>+</Button>
        </div>

        {/* Projects List */}
        <div className="flex flex-2 flex-col gap-3 border-2 border-green-400">
          {/* <div>Ongoing projects</div> */}
          {/* <ProjectBox projects={projects} /> */}
        </div>
      </div>
    </div>
  );
}
