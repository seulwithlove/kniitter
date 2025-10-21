"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Size {
  name: string;
  label: string;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string;
  onSizeChange: (sizeName: string) => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  if (sizes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>사이즈 선택</span>
          <Badge variant="secondary">{sizes.length}개 사이즈</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size.name}
              variant={selectedSize === size.name ? "default" : "outline"}
              size="lg"
              onClick={() => onSizeChange(size.name)}
              className="min-w-[80px] font-semibold"
            >
              {size.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
