/**
 * 패턴 파서
 * PDF에서 추출한 텍스트를 ParsedPattern으로 변환
 */

import type { ParsedPattern } from "@/types/pattern";

interface SizeInfo {
  name: string;
  label: string;
}

interface SubStep {
  order: number;
  content: string;
}

interface Step {
  order: number;
  content: string;
  subSteps?: SubStep[];
}

/**
 * 텍스트에서 사이즈 패턴을 감지합니다.
 */
function detectSizes(text: string): SizeInfo[] {
  // 패턴: 숫자 (숫자) 숫자 (숫자)
  const numberPattern = /(\d+)\s*\((\d+)\)(?:\s+(\d+)\s*\((\d+)\))?/;
  const match = text.match(numberPattern);

  if (match) {
    const numbers = match.slice(1).filter(Boolean);
    const defaultLabels = ["S", "M", "L", "XL"];

    return numbers.map((num, index) => ({
      name: defaultLabels[index] || `Size${index + 1}`,
      label: `${defaultLabels[index] || `Size${index + 1}`} (${num})`,
    }));
  }

  // 기본값
  return [
    { name: "S", label: "S" },
    { name: "M", label: "M" },
    { name: "L", label: "L" },
    { name: "XL", label: "XL" },
  ];
}

/**
 * 텍스트를 단계별로 분리합니다.
 */
function separateSteps(text: string): Step[] {
  const steps: Step[] = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let currentStep: Step | null = null;
  let stepOrder = 0;
  let subStepOrder = 0;

  for (const line of lines) {
    // 메인 단계 패턴 감지 (1., ■, 등)
    const mainStepMatch = line.match(
      /^(?:(\d+)\.\s+|(\d+)\)\s+|단계\s*(\d+)[:：]\s*|[■□●○]\s+)/,
    );

    if (mainStepMatch) {
      if (currentStep) {
        steps.push(currentStep);
      }

      stepOrder++;
      const content = line.replace(
        /^(?:\d+\.\s+|\d+\)\s+|단계\s*\d+[:：]\s*|[■□●○]\s+)/,
        "",
      );

      currentStep = {
        order: stepOrder,
        content,
        subSteps: [],
      };
      subStepOrder = 0;
      continue;
    }

    // 하위 단계 패턴 감지
    const subStepMatch = line.match(/^(?:\s+(?:\d+-\d+\.\s+|[-•·]\s+)|\s{2,})/);

    if (subStepMatch && currentStep) {
      subStepOrder++;
      const content = line.replace(
        /^(?:\s+(?:\d+-\d+\.\s+|[-•·]\s+)|\s{2,})/,
        "",
      );

      if (content) {
        currentStep.subSteps = currentStep.subSteps || [];
        currentStep.subSteps.push({
          order: subStepOrder,
          content,
        });
      }
      continue;
    }

    // 일반 텍스트
    if (line.length > 0) {
      if (!currentStep) {
        stepOrder++;
        currentStep = {
          order: stepOrder,
          content: line,
          subSteps: [],
        };
      } else {
        currentStep.content += ` ${line}`;
      }
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  // 하위 단계가 없으면 제거
  return steps.map((step) => {
    if (!step.subSteps || step.subSteps.length === 0) {
      const { subSteps, ...rest } = step;
      return rest;
    }
    return step;
  });
}

/**
 * 텍스트를 ParsedPattern으로 변환
 */
export function parsePattern(text: string, fileName: string): ParsedPattern {
  const sizes = detectSizes(text);
  const steps = separateSteps(text);

  return {
    fileName,
    originalText: text,
    content: text,
    sizes,
    steps,
  };
}
