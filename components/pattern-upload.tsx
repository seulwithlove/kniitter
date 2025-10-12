"use client";

import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ParsedPattern } from "@/types/pattern";

const ALLOWED_FILE_TYPES = [".pdf"];
const ALLOWED_MIME_TYPES = ["application/pdf"];

interface PatternUploadProps {
  onPatternParsed?: (pattern: ParsedPattern) => void;
}

export function PatternUpload({ onPatternParsed }: PatternUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isValidType =
      ALLOWED_FILE_TYPES.includes(fileExtension) ||
      ALLOWED_MIME_TYPES.includes(file.type);

    if (!isValidType) {
      toast.error("PDF 파일만 업로드 가능합니다.");
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleParse = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // FormData로 파일 전송
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 서버 API 호출
      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "파일 분석에 실패했습니다.");
      }

      toast.success("파일이 성공적으로 분석되었습니다!");
      onPatternParsed?.(result.data);
    } catch (error) {
      console.error("파싱 오류:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "파일 분석 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {!selectedFile ? (
            // biome-ignore lint/a11y/useSemanticElements: 드래그 앤 드롭 영역이므로 div를 사용해야 합니다
            <div
              role="button"
              tabIndex={0}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
              onClick={handleButtonClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleButtonClick();
                }
              }}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-16 w-16 transition-colors ${
                    isDragging ? "text-primary" : "text-muted-foreground"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-label="파일 업로드 아이콘"
                >
                  <title>파일 업로드 아이콘</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-foreground text-lg">
                    니팅 도안 파일을 업로드하세요
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm">
                    드래그 앤 드롭 또는 클릭하여 파일 선택
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  파일 선택
                </Button>
                <p className="text-muted-foreground text-xs">지원 형식: pdf</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_FILE_TYPES.join(",")}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-label="완료 아이콘"
              >
                <title>완료 아이콘</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  파일이 선택되었습니다
                </p>
                <p className="mt-2 text-muted-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  다른 파일 선택
                </Button>
                <Button
                  variant="default"
                  onClick={handleParse}
                  disabled={isLoading}
                >
                  {isLoading ? "분석 중..." : "분석 시작"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
