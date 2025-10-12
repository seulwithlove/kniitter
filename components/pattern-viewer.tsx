"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface SubStep {
  order: number;
  content: string;
}

interface Step {
  order: number;
  content: string;
  subSteps?: SubStep[];
}

interface PatternViewerProps {
  steps: Step[];
  patternId?: string;
  onProgressChange?: (completed: number, total: number) => void;
}

export function PatternViewer({
  steps,
  patternId = "default",
  onProgressChange,
}: PatternViewerProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  // 로컬 스토리지에서 체크 상태 불러오기
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

  // 체크 상태 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(
      `pattern-progress-${patternId}`,
      JSON.stringify(Array.from(checkedSteps)),
    );

    // 진행률 업데이트
    if (onProgressChange) {
      const totalSteps = steps.reduce(
        (acc, step) => acc + 1 + (step.subSteps?.length || 0),
        0,
      );
      onProgressChange(checkedSteps.size, totalSteps);
    }
  }, [checkedSteps, patternId, steps, onProgressChange]);

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

  const isChecked = (stepId: string) => checkedSteps.has(stepId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>니팅 패턴</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const stepId = `step-${step.order}`;
          const checked = isChecked(stepId);

          return (
            <div key={stepId} className="space-y-3">
              {/* 메인 단계 */}
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

              {/* 하위 단계 */}
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

              {/* 구분선 (마지막 단계가 아닌 경우) */}
              {index < steps.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
