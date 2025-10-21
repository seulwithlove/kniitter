import type { ParsedPattern } from "@/types/pattern";
import { prisma } from "../prisma";

export async function createPattern(parsedPattern: ParsedPattern) {
  return await prisma.pattern.create({
    data: {
      fileName: parsedPattern.fileName,
      content: parsedPattern.content,
      originalText: parsedPattern.originalText,
      sizes: {
        create: parsedPattern.sizes,
      },
      steps: {
        create: parsedPattern.steps.map((step) => ({
          order: step.order,
          content: step.content,
          subSteps: step.subSteps
            ? {
                create: step.subSteps,
              }
            : undefined,
        })),
      },
    },
    include: {
      sizes: true,
      steps: {
        include: {
          subSteps: true,
        },
      },
    },
  });
}

export async function getPattern(id: string) {
  return await prisma.pattern.findUnique({
    where: { id },
    include: {
      sizes: true,
      steps: {
        include: {
          subSteps: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

export async function getAllPatterns() {
  return await prisma.pattern.findMany({
    include: {
      sizes: true,
      steps: {
        include: {
          subSteps: true,
        },
      },
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });
}

export async function deletePattern(id: string) {
  return await prisma.pattern.delete({
    where: { id },
  });
}

export async function updateStepCompletion(
  stepId: string,
  isCompleted: boolean,
) {
  return await prisma.step.update({
    where: { id: stepId },
    data: { isCompleted },
  });
}
