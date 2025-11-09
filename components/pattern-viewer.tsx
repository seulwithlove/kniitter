"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  onProgressChange?: (completed: number, total: number) => void;
};

export default function PatternViewer({
  steps,
  patternId = "default",
  onProgressChange,
}: PatternViewerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  // Calculate total steps
  const totalSteps = steps.reduce(
    (acc, step) => acc + 1 + (step.subSteps?.length || 0),
    0,
  );

  const completedSteps = checkedSteps.size;
  const progressPercentage =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Load checked state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`pattern-progress-${patternId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCheckedSteps(new Set(parsed));
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }
  }, [patternId]);

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

  const handleCheck = (stepId: string) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    if (confirm("진행 상황을 초기화하시겠습니까?")) {
      setCheckedSteps(new Set());
      localStorage.removeItem(`pattern-progress-${patternId}`);
    }
  };

  const isChecked = (stepId: string) => checkedSteps.has(stepId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>니팅 패턴</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            초기화
          </Button>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps}/{totalSteps} 단계 완료
            </span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const stepId = `step-${step.order}`;
          const checked = isChecked(stepId);

          return (
            <div key={stepId} className="space-y-3">
              {/* Main step */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id={stepId}
                  checked={checked}
                  onCheckedChange={() => handleCheck(stepId)}
                  className="mt-1"
                />
                <label
                  htmlFor={stepId}
                  className={`flex-1 cursor-pointer text-base leading-relaxed ${
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  <span className="mr-2 font-semibold">{step.order}.</span>
                  {step.content}
                </label>
              </div>

              {/* Sub steps */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="ml-8 space-y-2">
                  {step.subSteps.map((subStep) => {
                    const subStepId = `step-${step.order}-${subStep.order}`;
                    const subChecked = isChecked(subStepId);

                    return (
                      <div key={subStepId} className="flex items-start gap-3">
                        <Checkbox
                          id={subStepId}
                          checked={subChecked}
                          onCheckedChange={() => handleCheck(subStepId)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={subStepId}
                          className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                            subChecked
                              ? "text-muted-foreground line-through"
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
      </CardContent>
    </Card>
  );
}
