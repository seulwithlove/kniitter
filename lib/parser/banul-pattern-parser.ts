/**
 * Korean Knitting Pattern Parser
 * Specifically designed for Korean knitting pattern structure
 */

export type SubStep = {
  order: number;
  content: string;
  sizeSpecific?: string; // "[S (M) 사이즈]" 등
};

export type Step = {
  order: number;
  title: string; // "위판", "소매", "목둘레" 등
  content: string; // Full content
  subSteps?: SubStep[];
  sizeSpecific?: string;
};

/**
 * Parse Korean knitting pattern text into structured steps
 */
export function parseBanulPattern(text: string): Step[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const steps: Step[] = [];
  let currentMainStep: Step | null = null;
  let currentSizeSection: string | null = null;
  let mainStepOrder = 0;
  let subStepOrder = 0;

  // Skip metadata sections
  const metadataSections = [
    "제작시 구성",
    "사이즈",
    "가슴둘레",
    "주의이",
    "실 사용량",
    "사용 바늘",
    "게이지",
    "진행과정",
    "약어 및 용어",
    "사슴으로 읽는 법",
  ];

  let inMetadataSection = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip metadata lines
    if (metadataSections.some((meta) => line.includes(meta))) {
      continue;
    }

    // Check if we've reached "만들기" section (actual instructions start)
    if (line.includes("만들기") || line.match(/^\d+\.\s*[가-힣]+$/)) {
      inMetadataSection = false;
    }

    if (inMetadataSection) continue;

    // 1. Main section detection: "1. 위판", "2. 암판 & 몸통", etc.
    const mainSectionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (mainSectionMatch && mainSectionMatch[2].length < 30) {
      // Save previous step
      if (currentMainStep) {
        steps.push(currentMainStep);
      }

      mainStepOrder++;
      const title = mainSectionMatch[2];

      currentMainStep = {
        order: mainStepOrder,
        title: title,
        content: "",
        subSteps: [],
      };
      currentSizeSection = null;
      subStepOrder = 0;
      continue;
    }

    // 2. Size-specific subsection: "[S (M) 사이즈]", "[L 사이즈]"
    const sizeMatch = line.match(/^\[(.+사이즈)\]$/);
    if (sizeMatch) {
      currentSizeSection = sizeMatch[1];
      continue;
    }

    // 3. Knitting instructions with step numbers: "1~7단: 겉뜨기", "8단(올림단): SSK, ..."
    const instructionMatch = line.match(
      /^(\d+(?:~\d+)?단(?:\([^)]+\))?[:：])\s*(.+)$/,
    );
    if (instructionMatch && currentMainStep) {
      subStepOrder++;
      const fullContent = `${instructionMatch[1]} ${instructionMatch[2]}`;

      currentMainStep.subSteps!.push({
        order: subStepOrder,
        content: fullContent,
        sizeSpecific: currentSizeSection || undefined,
      });
      continue;
    }

    // 4. General instruction lines (add to current step)
    if (currentMainStep && line.length > 10) {
      // If it's a standalone instruction, add as substep
      if (
        line.includes("뜨기") ||
        line.includes("코") ||
        line.includes("바늘") ||
        line.includes("SSK") ||
        line.includes("K2tog") ||
        line.match(/\d+\s*\(\d+\)/)
      ) {
        subStepOrder++;
        currentMainStep.subSteps!.push({
          order: subStepOrder,
          content: line,
          sizeSpecific: currentSizeSection || undefined,
        });
      } else if (currentMainStep.subSteps!.length > 0) {
        // Append to last substep if it's a continuation
        const lastSubStep =
          currentMainStep.subSteps![currentMainStep.subSteps!.length - 1];
        lastSubStep.content += ` ${line}`;
      } else {
        // Add to main content if no substeps yet
        currentMainStep.content += ` ${line}`;
      }
    }
  }

  // Add last step
  if (currentMainStep) {
    steps.push(currentMainStep);
  }

  // Clean up steps
  return steps.map((step) => {
    // Remove subSteps if empty
    if (!step.subSteps || step.subSteps.length === 0) {
      const { subSteps, ...rest } = step;
      return rest;
    }
    return step;
  });
}

/**
 * Flatten steps for simpler display (removes nesting)
 */
export function flattenSteps(steps: Step[]): Array<Step & { level: number }> {
  const flattened: Array<Step & { level: number }> = [];
  let order = 0;

  for (const step of steps) {
    order++;
    flattened.push({
      ...step,
      level: 0,
      order: order,
      content: step.title || step.content,
    });

    if (step.subSteps) {
      for (const subStep of step.subSteps) {
        order++;
        flattened.push({
          order: order,
          title: "",
          content: subStep.content,
          sizeSpecific: subStep.sizeSpecific,
          level: 1,
        });
      }
    }
  }

  return flattened;
}
