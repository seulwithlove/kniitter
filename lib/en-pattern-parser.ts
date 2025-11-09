/**
 * Knitting Pattern Parser
 * Extracts structured data from knitting pattern PDFs
 */

export type SizeInfo = {
  name: string;
  label: string;
  measurements?: string;
};

export type SubStep = {
  order: number;
  content: string;
  rowNumber?: number;
};

export type Step = {
  order: number;
  content: string;
  subSteps?: SubStep[];
};

export type PatternSection = {
  title: string;
  content: string;
  rows?: SubStep[];
};

export type ParsedPattern = {
  fileName: string;
  originalText: string;

  // Pattern metadata
  title?: string;
  difficulty?: string;
  gauge?: string;
  yarn?: string;
  needles?: string;
  notions?: string[];

  // Sizes with measurements
  sizes: SizeInfo[];

  // Pattern sections (Front, Back, Body, etc.)
  sections: PatternSection[];

  // General steps for construction
  steps: Step[];

  // Measurements table
  measurements?: Record<string, string[]>;
};

/**
 * Extract pattern title from text
 */
function extractTitle(text: string): string | undefined {
  const lines = text.split("\n").slice(0, 10);
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.length > 3 &&
      trimmed.length < 50 &&
      /^[A-Z\s]+(?:TOP|SWEATER|CARDIGAN|SHAWL|HAT|SCARF)?$/i.test(trimmed)
    ) {
      return trimmed;
    }
  }
  return undefined;
}

/**
 * Extract difficulty level
 */
function extractDifficulty(text: string): string | undefined {
  const match = text.match(/Difficulty\s*[◆◇]+/i);
  if (match) {
    const filled = (match[0].match(/◆/g) || []).length;
    const total = (match[0].match(/[◆◇]/g) || []).length;
    return `${filled}/${total}`;
  }
  return undefined;
}

/**
 * Extract gauge information
 */
function extractGauge(text: string): string | undefined {
  const gaugeMatch = text.match(
    /Gauge[\s\S]*?(\d+\s*stitches\s*by\s*\d+\s*rows[\s\S]*?(?:cm|inches?))/i,
  );
  return gaugeMatch ? gaugeMatch[1].trim() : undefined;
}

/**
 * Extract yarn information
 */
function extractYarn(text: string): string | undefined {
  const yarnMatch = text.match(
    /Yarn[\s\S]*?(?:you will need approximately[\s\S]*?meters|grams[\s\S]*?meters)/i,
  );
  if (yarnMatch) {
    return yarnMatch[0].replace(/Yarn\s*/i, "").trim();
  }
  return undefined;
}

/**
 * Extract needle information
 */
function extractNeedles(text: string): string | undefined {
  const needleMatch = text.match(
    /(?:Suggested needles|needles)[\s\S]*?US\s*\d+[\s\S]*?(?:mm|circular)/i,
  );
  return needleMatch
    ? needleMatch[0].replace(/(?:Suggested needles|needles)\s*/i, "").trim()
    : undefined;
}

/**
 * Extract notions/supplies
 */
function extractNotions(text: string): string[] {
  const notions: string[] = [];
  const notionsMatch = text.match(/Notions[\s\S]*?(?=\n\n|\d|[A-Z][a-z]+\n)/i);

  if (notionsMatch) {
    const lines = notionsMatch[0].split("\n").slice(1);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.match(/^[A-Z\s]+$/)) {
        notions.push(trimmed);
      }
    }
  }

  return notions;
}

/**
 * Parse sizes from the pattern text
 * Handles patterns like: 1, (2), 3, (4), 5, (6)
 */
function parseSizes(text: string): SizeInfo[] {
  const sizes: SizeInfo[] = [];

  // Look for size declaration with measurements
  const sizePattern =
    /Sizes\s*\n([\s\S]*?)(?:Bust circumference[\s\S]*?(\d+[\s\S]*?cm[\s\S]*?inches?))/i;
  const match = text.match(sizePattern);

  if (match) {
    // Extract size numbers: 1, (2), 3, (4), etc.
    const sizeNumbers = match[1].match(/(\d+)(?:\s*\((\d+)\))?/g);

    // Extract measurements
    const measurements = match[2];
    const bustMeasurements = measurements.match(/\d+/g);

    if (sizeNumbers) {
      const sizeLabels = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "2XL",
        "3XL",
        "4XL",
        "5XL",
        "6XL",
      ];
      let index = 0;

      for (const sizeNum of sizeNumbers) {
        const num = sizeNum.replace(/[()]/g, "").trim();
        const label = sizeLabels[index] || `Size ${num}`;
        const measurement =
          bustMeasurements && bustMeasurements[index]
            ? `${bustMeasurements[index]} cm`
            : undefined;

        sizes.push({
          name: num,
          label,
          measurements: measurement,
        });
        index++;
      }
    }
  }

  // Fallback: detect from parenthetical notation
  if (sizes.length === 0) {
    const numberPattern = text.match(/\d+,\s*\(\d+\),\s*\d+,\s*\(\d+\)/);
    if (numberPattern) {
      const numbers = numberPattern[0].match(/\d+/g);
      const defaultLabels = ["XS", "S", "M", "L", "XL", "2XL"];

      numbers?.forEach((num, i) => {
        sizes.push({
          name: num,
          label: defaultLabels[i] || `Size ${num}`,
        });
      });
    }
  }

  return sizes.length > 0 ? sizes : [{ name: "1", label: "One Size" }];
}

/**
 * Parse pattern sections (Front, Back, Body, Straps, etc.)
 */
function parseSections(text: string): PatternSection[] {
  const sections: PatternSection[] = [];

  // Common section headers in knitting patterns
  const sectionHeaders = [
    "Front",
    "Back",
    "Body",
    "Straps",
    "Sleeves",
    "Collar",
    "Hood",
    "Finishing",
    "Assembly",
  ];

  const lines = text.split("\n");
  let currentSection: PatternSection | null = null;
  let currentContent: string[] = [];
  let currentRows: SubStep[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a section header
    const isHeader = sectionHeaders.some(
      (header) =>
        line === header ||
        (line.length < 20 && line.toLowerCase() === header.toLowerCase()),
    );

    if (isHeader) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join("\n").trim();
        if (currentRows.length > 0) {
          currentSection.rows = currentRows;
        }
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        title: line,
        content: "",
        rows: [],
      };
      currentContent = [];
      currentRows = [];
      continue;
    }

    // Parse row instructions
    const rowMatch = line.match(/^(Row|Round)\s+(\d+)\s*\((rs|ws)\):\s*(.+)/i);
    if (rowMatch && currentSection) {
      currentRows.push({
        order: parseInt(rowMatch[2]),
        content: rowMatch[4],
        rowNumber: parseInt(rowMatch[2]),
      });
      currentContent.push(line);
      continue;
    }

    // Regular content
    if (line.length > 0 && currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join("\n").trim();
    if (currentRows.length > 0) {
      currentSection.rows = currentRows;
    }
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Parse general construction steps
 */
function parseSteps(text: string): Step[] {
  const steps: Step[] = [];
  const lines = text.split("\n");

  let currentStep: Step | null = null;
  let stepOrder = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect numbered steps
    const stepMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (stepMatch) {
      if (currentStep) {
        steps.push(currentStep);
      }

      stepOrder++;
      currentStep = {
        order: stepOrder,
        content: stepMatch[2],
      };
      continue;
    }

    // Add content to current step
    if (
      currentStep &&
      trimmed.length > 0 &&
      !trimmed.match(/^(Row|Round|Size)/)
    ) {
      currentStep.content += " " + trimmed;
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Parse measurements table
 */
function parseMeasurements(text: string): Record<string, string[]> | undefined {
  const measurements: Record<string, string[]> = {};
  const measurementSection = text.match(
    /Measurements[\s\S]*?(?=This pattern|Questions?|\n\n[A-Z])/i,
  );

  if (measurementSection) {
    const lines = measurementSection[0].split("\n");

    for (const line of lines) {
      const match = line.match(/^-?\s*(.+?)\s+(\d+[\s\S]*)/);
      if (match) {
        const label = match[1].trim();
        const values = match[2].match(/\d+(?:\.\d+)?/g) || [];
        measurements[label] = values;
      }
    }
  }

  return Object.keys(measurements).length > 0 ? measurements : undefined;
}

/**
 * Main parser function
 */
export function parseKnittingPattern(
  text: string,
  fileName: string,
): ParsedPattern {
  return {
    fileName,
    originalText: text,

    // Metadata
    title: extractTitle(text),
    difficulty: extractDifficulty(text),
    gauge: extractGauge(text),
    yarn: extractYarn(text),
    needles: extractNeedles(text),
    notions: extractNotions(text),

    // Pattern data
    sizes: parseSizes(text),
    sections: parseSections(text),
    steps: parseSteps(text),
    measurements: parseMeasurements(text),
  };
}

/**
 * Alias for backward compatibility
 */
export function parsePatternContent(
  text: string,
  fileName = "Pattern",
): ParsedPattern {
  return parseKnittingPattern(text, fileName);
}
