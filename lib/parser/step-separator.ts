/**
 * TODO: 단계 분리 로직
 * 문단, 번호 매기기를 기준으로 단계를 자동 분리
 *
 *  - 대문자로 시작
 *  - '.' 기준
 *
 */

type SubStep = {
  order: number;
  content: string;
};

type Step = {
  order: number;
  content: string;
  subSteps?: SubStep[];
};

/**
 * 텍스트를 단계별로 분리합니다.
 */
export function separateSteps(text: string): Step[] {
  const steps: Step[] = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let currentStep: Step | null = null;
  let stepOrder = 0;
  let subStepOrder = 0;

  for (const line of lines) {
    // 메인 단계 패턴 감지
    // 예: "1. ", "1) ", "단계 1:", "■ "
    const mainStepMatch = line.match(
      /^(?:(\d+)\.\s+|(\d+)\)\s+|단계\s*(\d+)[:：]\s*|[■□●○]\s+)/,
    );

    if (mainStepMatch) {
      // 이전 단계가 있으면 추가
      if (currentStep) {
        steps.push(currentStep);
      }

      // 새 단계 시작
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
    // 예: "  1-1. ", "  - ", "  • "
    const subStepMatch = line.match(
      /^(?:\s+(?:(\d+)-(\d+)\.\s+|[-•·]\s+)|^\s{2,})/,
    );

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

    // 일반 텍스트 처리
    if (line.length > 0) {
      // 현재 단계가 없으면 새 단계 생성
      if (!currentStep) {
        stepOrder++;
        currentStep = {
          order: stepOrder,
          content: line,
          subSteps: [],
        };
      } else {
        // 현재 단계의 내용에 추가
        currentStep.content += ` ${line}`;
      }
    }
  }

  // 마지막 단계 추가
  if (currentStep) {
    steps.push(currentStep);
  }

  // 하위 단계가 없는 경우 속성 제거
  return steps.map((step) => {
    if (!step.subSteps || step.subSteps.length === 0) {
      const { subSteps, ...rest } = step;
      return rest;
    }
    return step;
  });
}

/**
 * 긴 단계를 여러 하위 단계로 분리합니다.
 * 문장 단위 또는 쉼표 단위로 분리
 */
export function splitLongStep(content: string, maxLength = 100): SubStep[] {
  if (content.length <= maxLength) {
    return [];
  }

  const sentences = content.split(/[.。!?]\s+/).filter(Boolean);

  if (sentences.length <= 1) {
    return [];
  }

  return sentences.map((sentence, index) => ({
    order: index + 1,
    content: sentence.trim(),
  }));
}
