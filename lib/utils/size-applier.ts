/**
 * 클라이언트 측에서 사용 가능한 사이즈 적용 유틸리티
 * (서버 전용 라이브러리 의존성 없음)
 */

import type { ParsedPattern } from "@/types/pattern";

/**
 * 선택된 사이즈에 맞춰 텍스트를 변환합니다.
 * 예: "20 (24) 28 (32)코" + sizeIndex=0 -> "20코"
 */
export function applySize(text: string, sizeIndex: number): string {
  // 패턴: 숫자 (숫자) 숫자 (숫자)
  const pattern = /(\d+)\s*\((\d+)\)(?:\s+(\d+)\s*\((\d+)\))?/g;

  return text.replace(pattern, (match, n1, n2, n3, n4) => {
    const numbers = [n1, n2, n3, n4].filter(Boolean);

    if (sizeIndex < numbers.length) {
      return numbers[sizeIndex];
    }

    return match;
  });
}

/**
 * 선택된 사이즈에 맞춰 패턴 내용 변환
 */
export function applySizeToPattern(
  pattern: ParsedPattern,
  sizeIndex: number,
): ParsedPattern {
  const transformedSteps = pattern.steps.map((step) => ({
    ...step,
    content: applySize(step.content, sizeIndex),
    subSteps: step.subSteps?.map((subStep) => ({
      ...subStep,
      content: applySize(subStep.content, sizeIndex),
    })),
  }));

  return {
    ...pattern,
    content: applySize(pattern.content, sizeIndex),
    steps: transformedSteps,
  };
}

