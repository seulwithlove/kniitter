"use client"; //TODO: client component 분리

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadPdfAction } from "@/app/pdf.action";
import PdfUploader, { type ParsedPdfData } from "@/components/pdf-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedPattern } from "@/lib/parser/caidree-pattern-parser";
import type { Project } from "../page";
import { createProject, getProjects } from "../project.action";

export default function NewProject() {
  const router = useRouter();
  const pathname = usePathname();

  const [projectName, setProjectName] = useState<string>("");
  const [parsedText, setParsedText] = useState<string>("");
  const [parsedPattern, setParsedPattern] = useState<ParsedPattern | null>(
    null,
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const isModal = pathname === "/projectbox/new";

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handlePdfSuccess = (data: ParsedPdfData) => {
    console.log("Parsed PDF data:", data);
    setParsedText(data.text);
    setParsedPattern(data.pattern || null);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name:)");
      return;
    }
    if (!parsedText) {
      toast.error("Please upload a PDF:)");
      return;
    }

    setIsCreating(true);
    try {
      const project = await createProject(
        projectName,
        parsedText,
        parsedPattern || undefined,
      );
      toast.success("Done!");

      // Redirect to the newly created project's detail page
      router.push(`/projectbox/${project.id}`);
      if (isModal) {
        setTimeout(() => router.refresh(), 100);
      }
    } catch (err) {
      console.error("Failed to create proejct:", err);
      toast.error("Failed to create project");
    }
    setIsCreating(false);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Project Name Input */}
        <div className="space-y-2 pb-5 text-bold">
          <div>
            <label htmlFor="project-name" className="font-medium text-lg">
              Project Name
            </label>
          </div>
          <div>
            <Input
              id="project-name"
              placeholder="Enter the proejct name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>

        {/* Project Upload Section */}
        <div>
          {/* <p className="pb-3 font-medium text-sm">Upload PDF</p> */}
          <div className="flex justify-center">
            <PdfUploader
              uploadPdf={uploadPdfAction}
              onSuccess={handlePdfSuccess}
            />
          </div>
          {parsedText && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                ✓ PDF is successfully uploaded!
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
    </div>
  );
}
