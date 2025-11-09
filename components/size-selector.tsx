"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SizeInfo = {
  name: string;
  label: string;
  measurements?: string;
};

type SizeSelectorProps = {
  sizes: SizeInfo[];
  patternId?: string;
  onSizeChange?: (sizeIndex: number, size: SizeInfo) => void;
};

export default function SizeSelector({
  sizes,
  patternId = "default",
  onSizeChange,
}: SizeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load saved size selection from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`pattern-size-${patternId}`);
    if (saved) {
      const index = Number.parseInt(saved, 10);
      if (!Number.isNaN(index) && index < sizes.length) {
        setSelectedIndex(index);
      }
    }
  }, [patternId, sizes.length]);

  const handleSizeChange = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem(`pattern-size-${patternId}`, index.toString());
    onSizeChange?.(index, sizes[index]);
  };

  if (sizes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">사이즈 선택</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size, index) => (
            <Button
              key={`${size.name}-${index}`}
              variant={selectedIndex === index ? "default" : "outline"}
              onClick={() => handleSizeChange(index)}
              className="min-w-[80px]"
            >
              {size.label}
              {size.measurements && (
                <span className="ml-1 text-xs opacity-80">
                  {size.measurements}
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
