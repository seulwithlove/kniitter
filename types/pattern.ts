// Prisma에서 생성된 타입과 함께 사용
import type { Pattern, Size, Step } from "../lib/generated/prisma/client";

// Prisma 타입에 관계 포함
export type PatternWithRelations = Pattern & {
  sizes: Size[];
  steps: StepWithSubSteps[];
};

export type StepWithSubSteps = Step & {
  subSteps?: Step[];
};

// 파싱된 도안 (DB 저장 전)
export interface ParsedPattern {
  fileName: string;
  originalText: string;
  content: string;
  sizes: {
    name: string;
    label: string;
  }[];
  steps: {
    order: number;
    content: string;
    subSteps?: {
      order: number;
      content: string;
    }[];
  }[];
}

// API 응답 타입
export interface PatternResponse {
  success: boolean;
  data?: PatternWithRelations;
  error?: string;
}

export interface PatternsListResponse {
  success: boolean;
  data?: PatternWithRelations[];
  error?: string;
}
