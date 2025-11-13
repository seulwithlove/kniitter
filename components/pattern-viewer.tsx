"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getProjectProgress,
  updateProjectProgress,
} from "@/app/projectbox/project.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type SubStep = {
  order: number;
  content: string;
};

type Step = {
  order: number;
  content: string;
  subSteps?: SubStep[];
};

type PatternViewerProps = {
  steps: Step[];
  patternId?: string;
  projectId?: number;
  onProgressChange?: (completed: number, total: number) => void;
};

export default function PatternViewer({
  steps,
  patternId = "default",
  projectId,
  onProgressChange,
}: PatternViewerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
  const currentRowRef = useRef<HTMLDivElement>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Get all step IDs in order (for navigation - only substeps, not parent headers with substeps)
  const allStepIds: string[] = [];
  for (const step of steps) {
    if (step.subSteps && step.subSteps.length > 0) {
      // If step has substeps, only add the substeps (not the parent)
      for (const subStep of step.subSteps) {
        allStepIds.push(`step-${step.order}-${subStep.order}`);
      }
    } else {
      // If no substeps, add the main step itself
      const stepId = `step-${step.order}`;
      allStepIds.push(stepId);
    }
  }

  // Calculate total steps (only counting actual work items)
  const totalSteps = allStepIds.length;

  const completedSteps = checkedSteps.size;
  const progressPercentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Load checked state from db
  useEffect(() => {
    if (projectId) {
      getProjectProgress(projectId).then((progress) => {
        if (progress) {
          setCheckedSteps(new Set(progress));
        }
      });
    }
  }, [projectId]);

  // Save db using debounce
  useEffect(() => {
    if (projectId) {
      const timeoutId = setTimeout(() => {
        updateProjectProgress(projectId, Array.from(checkedSteps));
      }, 500); // save after 500ms
      return () => clearTimeout(timeoutId);
    }
  }, [checkedSteps, projectId]);

  // Update current row whenever checked steps change
  useEffect(() => {
    // Find current row (first unchecked step)
    let current: string | null = null;
    for (const stepId of allStepIds) {
      if (!checkedSteps.has(stepId)) {
        current = stepId;
        break;
      }
    }
    setCurrentRowId(current);
  }, [checkedSteps]);

  // Auto-scroll to current row
  useEffect(() => {
    if (currentRowId && currentRowRef.current) {
      currentRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentRowId]);

  // Save checked state to localStorage
  useEffect(() => {
    localStorage.setItem(
      `pattern-progress-${patternId}`,
      JSON.stringify(Array.from(checkedSteps)),
    );

    if (onProgressChange) {
      onProgressChange(completedSteps, totalSteps);
    }
  }, [checkedSteps, patternId, completedSteps, totalSteps, onProgressChange]);

  const handleCheck = (stepId: string, subStepIds?: string[]) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);

      // If this is a main step with substeps, toggle all substeps
      if (subStepIds && subStepIds.length > 0) {
        const allSubsChecked = subStepIds.every((id) => newSet.has(id));

        if (allSubsChecked) {
          // Uncheck all substeps
          for (const id of subStepIds) {
            newSet.delete(id);
          }
        } else {
          // Check all substeps
          for (const id of subStepIds) {
            newSet.add(id);
          }
        }
      } else {
        // Regular toggle for substeps without children
        if (newSet.has(stepId)) {
          newSet.delete(stepId);
        } else {
          newSet.add(stepId);
        }
      }

      return newSet;
    });
  };

  const handleReset = () => {
    setCheckedSteps(new Set());
    localStorage.removeItem(`pattern-progress-${patternId}`);
    setCurrentRowId(allStepIds[0] || null);
    setShowResetDialog(false);
    toast.success("Progress has been reset!");
  };

  const handlePrevious = () => {
    if (!currentRowId) return;
    const currentIndex = allStepIds.indexOf(currentRowId);
    if (currentIndex > 0) {
      setCurrentRowId(allStepIds[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!currentRowId) return;
    const currentIndex = allStepIds.indexOf(currentRowId);
    if (currentIndex < allStepIds.length - 1) {
      setCurrentRowId(allStepIds[currentIndex + 1]);
    }
  };

  const isChecked = (stepId: string) => checkedSteps.has(stepId);
  const isCurrent = (stepId: string) => stepId === currentRowId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patterns</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetDialog(true)}
          >
            Reset
          </Button>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps}/{totalSteps} steps done
            </span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const stepId = `step-${step.order}`;

          // Get substep IDs if they exist
          const subStepIds = step.subSteps
            ? step.subSteps.map((sub) => `step-${step.order}-${sub.order}`)
            : [];

          // For main steps with substeps, check if ALL substeps are checked
          const checked =
            subStepIds.length > 0
              ? subStepIds.every((id) => isChecked(id))
              : isChecked(stepId);

          const current = isCurrent(stepId);

          return (
            <div key={stepId} className="space-y-3">
              {/* Main step */}
              <div
                ref={current ? currentRowRef : null}
                className={`-mx-4 flex items-start gap-3 rounded-lg px-4 py-3 transition-colors ${
                  current
                    ? "bg-primary/10 ring-2 ring-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <Checkbox
                  id={stepId}
                  checked={checked}
                  onCheckedChange={() => handleCheck(stepId, subStepIds)}
                  className="mt-1"
                />
                <label
                  htmlFor={stepId}
                  className={`flex-1 cursor-pointer font-mono text-base leading-relaxed ${
                    checked
                      ? "text-muted-foreground line-through"
                      : current
                        ? "font-semibold text-foreground"
                        : "text-foreground"
                  }`}
                >
                  <span className="mr-2 font-semibold">{step.order}.</span>
                  {step.content}
                </label>
              </div>

              {/* Sub steps */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="ml-4 space-y-2">
                  {step.subSteps.map((subStep) => {
                    const subStepId = `step-${step.order}-${subStep.order}`;
                    const subChecked = isChecked(subStepId);
                    const subCurrent = isCurrent(subStepId);

                    return (
                      <div
                        key={subStepId}
                        ref={subCurrent ? currentRowRef : null}
                        className={`-mx-4 flex items-start gap-3 rounded-lg px-4 py-2 transition-colors ${
                          subCurrent
                            ? "bg-primary/10 ring-2 ring-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id={subStepId}
                          checked={subChecked}
                          onCheckedChange={() => handleCheck(subStepId)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={subStepId}
                          className={`flex-1 cursor-pointer font-mono text-sm leading-relaxed ${
                            subChecked
                              ? "text-muted-foreground line-through"
                              : subCurrent
                                ? "font-semibold text-foreground"
                                : "text-foreground"
                          }`}
                        >
                          <span className="mr-2 text-muted-foreground">
                            {step.order}-{subStep.order}.
                          </span>
                          {subStep.content}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Separator */}
              {index < steps.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}

        {/* Navigation Controls */}
        <div className="-mx-6 sticky bottom-0 mt-6 flex items-center justify-between border-t bg-background px-6 py-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={!currentRowId || allStepIds.indexOf(currentRowId) === 0}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="px-4 text-center text-muted-foreground text-sm">
            {currentRowId ? (
              <span>
                Row {allStepIds.indexOf(currentRowId) + 1} / {allStepIds.length}
              </span>
            ) : (
              <span>All Complete!</span>
            )}
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={
              !currentRowId ||
              allStepIds.indexOf(currentRowId) === allStepIds.length - 1
            }
            className="flex-1"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your progress for this pattern. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
