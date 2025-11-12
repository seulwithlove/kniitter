"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import type { ParsedPattern } from "@/lib/parser/caidree-pattern-parser";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type ParsedPdfData = {
  filename: string;
  pages?: number;
  text: string;
  pattern?: ParsedPattern;
};

export type UploadPdfReturn = Promise<
  [null, ParsedPdfData] | [{ pdf?: { errors: string[] } }, null]
>;

type PdfUploadProps = {
  uploadPdf?: (formData: FormData) => UploadPdfReturn;
  onSuccess?: (data: ParsedPdfData) => void;
};

export default function PdfUploader({ uploadPdf, onSuccess }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPdfData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null); //TODO: useRef?
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition(); //TODO: useTransition?

  const validatePdfFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorMsgs(["ONLY Upload PDF File!"]);
      return false;
    }
    // 10MB 제한
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsgs(["파일 크기는 10MB 이하여야 합니다."]);
      return false;
    }

    return true;
  };

  const setFileAndSubmit = (file: File) => {
    if (!validatePdfFile(file)) return;

    setSelectedFile(file);
    setErrorMsgs([]);

    // AUto-submit on file selection
    formRef.current?.requestSubmit();
  };

  const setFileFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setFileAndSubmit(e.target.files[0]);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    uploadPdfFile(formData);
  };

  const uploadPdfFile = (formData: FormData) => {
    setErrorMsgs([]);
    startTransition(async () => {
      if (!uploadPdf) return;

      const [err, data] = await uploadPdf(formData);

      if (err) {
        setSelectedFile(null);
        setParsedData(null);
        if (typeof err.pdf === "object" && err.pdf.errors.length) {
          setErrorMsgs(err.pdf.errors);
        }
        toast.error("Fail to upload file.");
        return;
      }

      if (data) {
        setParsedData(data);
        toast.success(`File is uploaded! (${data.pages}pages`);

        onSuccess?.(data);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload patterns</CardTitle>
        <CardDescription>Upload PDF patterns (max 10MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler} ref={formRef} className="w-full">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: file attach */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);

              const files = e.dataTransfer.files;
              if (!files?.length) return;

              const file = files[0];
              if (!validatePdfFile(file)) return;

              setSelectedFile(file);
              setErrorMsgs([]);

              // Auto-upload on drop
              const formData = new FormData();
              formData.append("pdf", file);
              uploadPdfFile(formData);
            }}
            className={cn(
              "relative w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200 hover:border-primary/50",
              {
                "border-primary bg-primary/10": isDragging,
                "border-muted-foreground/25": !isDragging,
              },
            )}
          >
            {/** biome-ignore lint/a11y/noStaticElementInteractions: file attatch */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <div
              className="flex flex-col items-center gap-4"
              onClick={() => fileRef.current?.click()}
            >
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Upload PDF</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {selectedFile ? (
                <div className="space-y-2">
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  {isPending && (
                    <p className="text-primary text-xs">Uploading...</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium text-sm">
                    Click to select a file or drag a file here.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Available only PDF files
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              name="pdf"
              ref={fileRef}
              accept=".pdf,application/pdf"
              onChange={setFileFromInput}
              disabled={isPending}
              hidden
            />
          </div>

          {/* Error Messages */}
          {errorMsgs.length > 0 && (
            <div className="mt-4">
              {errorMsgs.map((emsg) => (
                <p key={emsg} className="text-pink-800 text-sm">
                  {emsg}
                </p>
              ))}
            </div>
          )}

          {/* Parsed Data Display */}
          {parsedData && (
            <div className="mt-4 rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">Parsed results</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">File name:</span>{" "}
                  {parsedData.filename}
                </p>
                <p>
                  <span className="font-medium">Pages:</span> {parsedData.pages}
                </p>
                {parsedData.pattern && (
                  <>
                    <p>
                      <span className="font-medium">Pattern Name:</span>{" "}
                      {parsedData.pattern.title || "Untitled"}
                    </p>
                    <p>
                      <span className="font-medium">Sizes:</span>{" "}
                      {parsedData.pattern.sizes.map((s) => s.label).join(", ")}
                    </p>
                    {parsedData.pattern.difficulty && (
                      <p>
                        <span className="font-medium">Difficulty:</span>{" "}
                        {parsedData.pattern.difficulty}
                      </p>
                    )}
                    {parsedData.pattern.gauge && (
                      <p>
                        <span className="font-medium">Gauge:</span>{" "}
                        {parsedData.pattern.gauge}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
