"use client";

import { useState } from "react";
import { PatternUpload } from "@/components/pattern-upload";
import { PatternViewer } from "@/components/pattern-viewer";
import { ProgressBar } from "@/components/progress-bar";
import { SizeSelector } from "@/components/size-selector";
import { Button } from "@/components/ui/button";
import { applySizeToPattern } from "@/lib/utils/size-applier";
import type { ParsedPattern } from "@/types/pattern";

export default function Home() {
  const [parsedPattern, setParsedPattern] = useState<ParsedPattern | null>(
    null,
  );
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [displayPattern, setDisplayPattern] = useState<ParsedPattern | null>(
    null,
  );
  const [progressCompleted, setProgressCompleted] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);

  const handlePatternParsed = (pattern: ParsedPattern) => {
    setParsedPattern(pattern);
    setSelectedSizeIndex(0);

    // 첫 번째 사이즈로 패턴 변환
    const transformed = applySizeToPattern(pattern, 0);
    setDisplayPattern(transformed);
  };

  const handleSizeChange = (sizeName: string) => {
    if (!parsedPattern) return;

    const sizeIndex = parsedPattern.sizes.findIndex((s) => s.name === sizeName);
    if (sizeIndex === -1) return;

    setSelectedSizeIndex(sizeIndex);

    // 선택된 사이즈로 패턴 변환
    const transformed = applySizeToPattern(parsedPattern, sizeIndex);
    setDisplayPattern(transformed);
  };

  const handleProgressChange = (completed: number, total: number) => {
    setProgressCompleted(completed);
    setProgressTotal(total);
  };

  const handleReset = () => {
    setParsedPattern(null);
    setDisplayPattern(null);
    setSelectedSizeIndex(0);
    setProgressCompleted(0);
    setProgressTotal(0);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      {!parsedPattern ? (
        <PatternUpload onPatternParsed={handlePatternParsed} />
      ) : (
        <>
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl">{parsedPattern.fileName}</h1>
              <p className="text-muted-foreground text-sm">
                {parsedPattern.steps.length}개 단계
              </p>
            </div>
            <Button variant="outline" onClick={handleReset}>
              새 도안 업로드
            </Button>
          </div>

          {/* 진행률 */}
          <ProgressBar completed={progressCompleted} total={progressTotal} />

          {/* 사이즈 선택 */}
          {parsedPattern.sizes.length > 0 && (
            <SizeSelector
              sizes={parsedPattern.sizes}
              selectedSize={parsedPattern.sizes[selectedSizeIndex]?.name || ""}
              onSizeChange={handleSizeChange}
            />
          )}

          {/* 패턴 뷰어 */}
          {displayPattern && (
            <PatternViewer
              steps={displayPattern.steps}
              patternId={parsedPattern.fileName}
              onProgressChange={handleProgressChange}
            />
          )}
        </>
      )}
    </div>
  );
}
