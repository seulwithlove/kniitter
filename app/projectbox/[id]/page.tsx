"use client";

import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import PatternViewer from "@/components/pattern-viewer";
import SizeSelector from "@/components/size-selector";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { ParsedPattern } from "@/lib/en-pattern-parser";
import { applySize } from "@/lib/size-pattern-recognizer";
import { getProjectByIdAction } from "../project.action";

// Convert ParsedPattern to PatternViewer format with size transformation
function convertToViewerSteps(
  pattern: ParsedPattern,
  selectedSizeIndex: number,
) {
  const steps: Array<{
    order: number;
    content: string;
    subSteps?: Array<{ order: number; content: string }>;
  }> = [];

  let stepOrder = 0;

  // Add sections as main steps
  for (const section of pattern.sections) {
    stepOrder++;

    // Apply size transformation to section title
    const transformedTitle = applySize(section.title, selectedSizeIndex);

    const step = {
      order: stepOrder,
      content: transformedTitle,
      subSteps: [] as Array<{ order: number; content: string }>,
    };

    // Add section rows as substeps
    if (section.rows && section.rows.length > 0) {
      step.subSteps = section.rows.map((row, idx) => ({
        order: idx + 1,
        content: applySize(row.content, selectedSizeIndex),
      }));
    } else if (section.content) {
      // Split content into lines if no explicit rows
      const lines = section.content
        .split("\n")
        .filter((line) => line.trim().length > 0);

      if (lines.length > 1) {
        step.subSteps = lines.map((line, idx) => ({
          order: idx + 1,
          content: applySize(line.trim(), selectedSizeIndex),
        }));
      } else {
        // Just use the content as is
        const transformedContent = applySize(
          section.content,
          selectedSizeIndex,
        );
        step.content = `${transformedTitle}: ${transformedContent}`;
      }
    }

    steps.push(step);
  }

  // Add general steps if sections are empty
  if (steps.length === 0 && pattern.steps.length > 0) {
    for (const patternStep of pattern.steps) {
      stepOrder++;
      steps.push({
        order: stepOrder,
        content: applySize(patternStep.content, selectedSizeIndex),
        subSteps: patternStep.subSteps?.map((sub, idx) => ({
          order: idx + 1,
          content: applySize(sub.content, selectedSizeIndex),
        })),
      });
    }
  }

  return steps;
}

export default function Pattern({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [pattern, setPattern] = useState<ParsedPattern | null>(null);
  const [project, setProject] = useState<any>(null);

  const projectId = Number.parseInt(id, 10);

  useEffect(() => {
    async function loadProject() {
      if (Number.isNaN(projectId)) {
        notFound();
      }
      const projectData = await getProjectByIdAction(projectId);

      if (!projectData) {
        notFound();
      }

      setProject(projectData);

      // Try to parse as JSON (ParsedPattern)
      try {
        const parsedPattern = JSON.parse(projectData.content) as ParsedPattern;
        setPattern(parsedPattern);
      } catch {
        setPattern(null);
      }
    }

    loadProject();
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  // If we have a parsed pattern, show it nicely
  if (pattern && (pattern.sections?.length > 0 || pattern.steps?.length > 0)) {
    const steps = convertToViewerSteps(pattern, selectedSizeIndex);

    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        {/* Pattern Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{pattern.title || project.name}</span>
              {pattern.difficulty && (
                <Badge variant="secondary">{pattern.difficulty}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sizes - Display only, no checkbox */}
            {pattern.sizes && pattern.sizes.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold text-sm">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {pattern.sizes.map((size, idx) => (
                    <Badge key={idx} variant="outline">
                      {size.label}
                      {size.measurements && ` - ${size.measurements}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Gauge */}
            {pattern.gauge && (
              <div className="flex items-start gap-3">
                <label
                  htmlFor={`gauge-${projectId}`}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="mb-1 font-semibold text-sm">Gauge</h3>
                  <p className="text-muted-foreground text-sm">
                    {pattern.gauge}
                  </p>
                </label>
              </div>
            )}

            {/* Yarn */}
            {pattern.yarn && (
              <div className="flex items-start gap-3">
                <label
                  htmlFor={`yarn-${projectId}`}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="mb-1 font-semibold text-sm">Yarn</h3>
                  <p className="text-muted-foreground text-sm">
                    {pattern.yarn}
                  </p>
                </label>
              </div>
            )}

            {/* Needles */}
            {pattern.needles && (
              <div className="flex items-start gap-3">
                <label
                  htmlFor={`needles-${projectId}`}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="mb-1 font-semibold text-sm">Needles</h3>
                  <p className="text-muted-foreground text-sm">
                    {pattern.needles}
                  </p>
                </label>
              </div>
            )}

            {/* Notions with Checkboxes for each item */}
            {pattern.notions && pattern.notions.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold text-sm">Notions</h3>
                <div className="space-y-2">
                  {pattern.notions.map((notion, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Checkbox
                        id={`notion-${projectId}-${idx}`}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`notion-${projectId}-${idx}`}
                        className="flex-1 cursor-pointer text-muted-foreground text-sm"
                      >
                        {notion}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Size Selector */}
        {pattern.sizes && pattern.sizes.length > 0 && (
          <SizeSelector
            sizes={pattern.sizes}
            patternId={projectId.toString()}
            onSizeChange={(index) => setSelectedSizeIndex(index)}
          />
        )}

        {/* Pattern Instructions with Checkboxes */}
        <div>
          <PatternViewer steps={steps} patternId={projectId.toString()} />
        </div>
      </div>
    );
  }

  // Fallback: display as plain text
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {project.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
