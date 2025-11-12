export default function getTotalSteps(content: string): number {
  try {
    const parsed = JSON.parse(content);

    // Check for ParsedPattern format(section)
    if (parsed.sections && Array.isArray(parsed.sections)) {
      let total = 0;
      for (const section of parsed.sections) {
        if (section.rows && section.rows.length > 0) {
          // Count rows as substeps
          total += section.rows.length;
        } else if (section.content) {
          // Count content lines as substeps
          const lines = section.content
            .split("\n")
            .filter((line: string) => line.trim().length > 0);
          total += lines.length || 1;
        } else {
          total += 1; // Section with no substeps
        }
      }
      return total;
    }

    // Fallback: check for steps format
    if (parsed.steps && Array.isArray(parsed.steps)) {
      let total = 0;
      for (const step of parsed.steps) {
        if (step.subSteps && step.subSteps.length > 0) {
          total += step.subSteps.length;
        } else {
          total += 1;
        }
      }
      return total;
    }
  } catch (err) {
    const lines = content.split("\n").filter((line) => line.trim());
    return lines.length;
  }
  return 0;
}
