export type PatternSection = {
  title: string;
  directions: string[];
};

export type ParsedPattern = {
  title: string;
  sections: PatternSection[];
};

export function parsePatternContent(content: string): ParsedPattern {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return {
      title: "Untitled Pattern",
      sections: [],
    };
  }

  const title = lines[0];
  const sections: PatternSection[] = [];
  let currentSection: PatternSection | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers (usually shorter, may contain keywords like "Size", "Materials", etc.)
    // or lines that look like headers (ALL CAPS, short, etc.)
    const isHeader =
      line.length < 50 &&
      (line.toUpperCase() === line ||
        line.endsWith(":") ||
        /^(Size|Materials|Gauge|Abbreviations|Instructions|Pattern|Notes)/i.test(
          line,
        ));

    if (isHeader) {
      // Start a new section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/:$/, ""), // Remove trailing colon if present
        directions: [],
      };
    } else if (currentSection) {
      // Add line to current section as a direction
      currentSection.directions.push(line);
    } else {
      // No section yet, create a default one
      currentSection = {
        title: "Instructions",
        directions: [line],
      };
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { title, sections };
}
