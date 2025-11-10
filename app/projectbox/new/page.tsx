"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadPdfAction } from "@/app/pdf.action";
import PdfUploader, { type ParsedPdfData } from "@/components/pdf-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedPattern } from "@/lib/en-pattern-parser";
import type { Project } from "../page";
import { createProjectAction, getProjectsAction } from "../project.action";

export default function NewProject() {
  const router = useRouter();
  const [projectName, setProjectName] = useState<string>("");
  const [parsedText, setParsedText] = useState<string>("");
  const [parsedPattern, setParsedPattern] = useState<ParsedPattern | null>(
    null,
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    getProjectsAction().then(setProjects);
  }, []);

  const handlePdfSuccess = (data: ParsedPdfData) => {
    console.log("Parsed PDF data:", data);
    setParsedText(data.text);
    setParsedPattern(data.pattern || null);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name:)");
      return;
    }
    if (!parsedText) {
      alert("Please upload a PDF:)");
      return;
    }

    setIsCreating(true);
    try {
      await createProjectAction(
        projectName,
        parsedText,
        parsedPattern || undefined,
      );
      alert("Done!");
      router.push("/projectbox");
    } catch (err) {
      console.error("Failed to create proejct:", err);
      alert("Failed to create project");
    }
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      {/* Project Name Input */}
      <div className="space-y-2">
        <label htmlFor="project-name" className="font-medium text-sm">
          Project Name
        </label>
        <Input
          id="project-name"
          placeholder="Enter the proejct name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      {/* Project Upload Section */}
      <div>
        <p className="font-medium text-sm">Upload PDF</p>
        <div className="flex justify-center">
          <PdfUploader
            uploadPdf={uploadPdfAction}
            onSuccess={handlePdfSuccess}
          />
        </div>
        {parsedText && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              ✓ PDF is successfully uploaded! ({parsedText.length}자)
            </p>
            {parsedPattern && (
              <p className="text-muted-foreground text-xs">
                ✓ {parsedPattern.sections.length} sections,{" "}
                {parsedPattern.sizes.length} sizes detected
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="pt-4">
        <Button
          onClick={handleCreateProject}
          disabled={isCreating || !projectName.trim() || !parsedText}
          className="w-full cursor-pointer hover:bg-muted-foreground"
          size="lg"
        >
          {isCreating ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}
