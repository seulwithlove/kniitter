"use server";

import type { ParsedPdfData, UploadPdfReturn } from "@/components/pdf-upload";
import { parseBanulPattern } from "@/lib/parser/banul-pattern-parser";
import { parseCaidreeKnitPattern } from "@/lib/parser/caidree-pattern-parser";
import { extractTextFromPdf } from "@/lib/pdf-extractor";

export async function uploadPdfAction(formData: FormData): UploadPdfReturn {
  try {
    const file = formData.get("pdf") as File;

    if (!file) {
      return [{ pdf: { errors: ["File is not selected!"] } }, null];
    }

    // validate file type
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return [{ pdf: { errors: ["Only PDF file is available"] } }, null];
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return [
        { pdf: { errors: ["File size should be lower than 10MB"] } },
        null,
      ];
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF using new extractor
    const { text } = await extractTextFromPdf(buffer);
    const trimmedText = text.trim();

    // Detect pattern type
    // Banul patterns usually contain Korean characters
    const isBanul = /[가-힣]/.test(trimmedText);
    
    let parsedPattern;
    if (isBanul) {
      // For Banul, we use the specific parser but adapt the return type to match ParsedPdfData structure
      // The current parseBanulPattern returns Step[], but we need ParsedPattern
      // We'll wrap it or modify the parser. For now, let's assume we need to map it.
      // Actually, looking at the types, they are quite different. 
      // Let's check if we need to unify the types or if the UI handles both.
      // The ParsedPdfData interface expects 'pattern' to be 'ParsedPattern' from caidree parser?
      // Let's look at the type definition in pdf-upload.tsx if possible, but based on imports, 
      // it seems we might need to unify.
      // For now, I will use the Caidree parser for non-Korean and Banul for Korean.
      // Wait, the return type of uploadPdfAction expects ParsedPdfData.
      // Let's check ParsedPdfData type in the next step if needed, but for now I will try to fit Banul into the structure.
      
      const steps = parseBanulPattern(trimmedText);
      parsedPattern = {
        fileName: file.name,
        originalText: trimmedText,
        sizes: [], // Banul parser might not extract sizes in the same way yet
        sections: [],
        steps: steps.map(s => ({
          order: s.order,
          content: s.title + " " + s.content,
          subSteps: s.subSteps?.map(ss => ({
            order: ss.order,
            content: ss.content
          }))
        })),
        // Add other required fields with defaults
        title: "Banul Pattern",
        difficulty: undefined,
        gauge: undefined,
        yarn: undefined,
        needles: undefined,
        notions: [],
        measurements: undefined
      };
    } else {
      parsedPattern = parseCaidreeKnitPattern(trimmedText, file.name);
    }

    const parsedData: ParsedPdfData = {
      filename: file.name,
      text: trimmedText,
      pattern: parsedPattern,
    };

    return [null, parsedData];
  } catch (error) {
    console.error("PDF parsing error:", error);
    return [
      {
        pdf: {
          errors: [
            `PDF parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
        },
      },
      null,
    ];
  }
}
