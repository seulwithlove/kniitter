"use client";

import { useEffect, useState } from "react";
import type { ParsedPattern } from "@/lib/pattern-parser";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";

type PatternViewerProps = {
  pattern: ParsedPattern;
  projectId: number;
};

export default function PatternViewer({
  pattern,
  projectId,
}: PatternViewerProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(`pattern-checks-${projectId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCheckedItems(new Set(parsed));
      } catch (e) {
        console.log("Failed to parse stored checks: ", e);
      }
    }
  }, [projectId]);

  const handleCheck = (itemId: string, checked: boolean) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      localStorage.setItem(
        `pattern-checks-${projectId}`,
        JSON.stringify([...newSet]),
      );
      return newSet;
    });
  };
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Main Title */}
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl">{pattern.title}</h1>
        <Separator className="my-4" />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {pattern.sections.map((section, sectionIdx) => (
          <Card key={sectionIdx}>
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.directions.map((direction, dirIdx) => {
                  const itemId = `${sectionIdx}-${dirIdx}`;
                  return (
                    <div key={itemId} className="flex items-start gap-3">
                      <Checkbox
                        id={itemId}
                        checked={checkedItems.has(itemId)}
                        onCheckedChange={(checked) =>
                          handleCheck(itemId, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor={itemId}
                        className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                          checkedItems.has(itemId)
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {direction}
                      </label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
