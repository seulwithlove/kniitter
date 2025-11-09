"use server";

import prisma from "@/lib/db";
import { ParsedPattern } from "@/lib/en-pattern-parser";

export async function getProjectsAction() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      isCompleted: true,
    },
  });
  return projects;
}

export async function getProjectByIdAction(id: number) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      content: true,
      isCompleted: true,
    },
  });
  return project;
}

export async function createProjectAction(
  name: string,
  content: string,
  parsedPattern?: ParsedPattern,
) {
  const project = await prisma.project.create({
    data: {
      name,
      content: parsedPattern
        ? JSON.stringify(parsedPattern, null, 2) // Store as formatted JSON
        : content,
    },
  });
  return project;
}
