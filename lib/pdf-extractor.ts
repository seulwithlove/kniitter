import pdf from "pdf-parse";

export type ExtractedPdfData = {
  text: string;
  raw: any;
};

/**
 * Custom render function to sort text items by coordinates
 */
function render_page(pageData: any) {
  // options to extract text
  const render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };

  return pageData
    .getTextContent(render_options)
    .then((textContent: any) => {
      // textContent.items contains { str, transform, ... }
      // transform is [scaleX, skewY, skewX, scaleY, translateX, translateY]
      // transform[4] is x, transform[5] is y

      const items = textContent.items;

      // Sort items
      items.sort((a: any, b: any) => {
        // Sort by Y descending (top to bottom)
        // Note: PDF coordinates usually have (0,0) at bottom-left, so higher Y is higher on page.
        // However, pdf.js might normalize this? 
        // Let's assume standard PDF: higher Y = top.
        // So we want B.y - A.y to sort descending.
        
        const yA = a.transform[5];
        const yB = b.transform[5];
        const yDiff = yB - yA;

        // Threshold for same line (e.g. 5 units)
        if (Math.abs(yDiff) < 5) {
          // Same line, sort by X ascending (left to right)
          const xA = a.transform[4];
          const xB = b.transform[4];
          return xA - xB;
        }
        
        return yDiff;
      });

      // Join text
      let lastY = -1;
      let text = "";
      
      for (const item of items) {
        const currentY = item.transform[5];
        // If significant Y change, add newline? 
        // But we just sorted, so we can just join with space and let the parser handle structure?
        // Or maybe add newlines for visual breaks.
        // Let's just join with space for now, but maybe add newline if Y difference is large?
        // Actually, the parser expects newlines for sections.
        
        if (lastY !== -1 && Math.abs(currentY - lastY) > 10) {
           text += "\n";
        } else if (text.length > 0 && !text.endsWith("\n")) {
           text += " ";
        }
        
        text += item.str;
        lastY = currentY;
      }

      return text;
    });
}

/**
 * Extract text from PDF buffer with coordinate-based sorting using pdf-parse
 */
export async function extractTextFromPdf(
  buffer: Buffer,
): Promise<ExtractedPdfData> {
  try {
    const data = await pdf(buffer, {
      pagerender: render_page,
    });

    return {
      text: data.text,
      raw: data,
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw error;
  }
}
