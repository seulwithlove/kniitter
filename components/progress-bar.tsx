"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
  showCard?: boolean;
  className?: string;
}

export function ProgressBar({
  completed,
  total,
  showCard = true,
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const content = (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-foreground text-sm">진행 상황</span>
        <span className="text-muted-foreground text-sm">
          {completed} / {total} 단계 완료
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
      <div className="mt-1 text-center">
        <span className="font-bold text-lg text-primary">{percentage}%</span>
      </div>
    </div>
  );

  if (showCard) {
    return (
      <Card>
        <CardContent className="pt-6">{content}</CardContent>
      </Card>
    );
  }

  return content;
}
