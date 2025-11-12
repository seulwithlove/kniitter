"use server";

import prisma from "@/lib/db";
import type { ParsedPattern } from "@/lib/en-pattern-parser";

export async function getProjects() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      isCompleted: true,
      progress: true,
    },
  });
  return projects;
}

export async function getProjectById(id: number) {
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

export async function createProject(
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

export async function updateProjectProgress(
  projectId: number,
  checkedSteps: string[],
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      progress: checkedSteps,
    },
  });
  return project;
}

export async function getProjectProgress(projectId: number) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { progress: true },
  });
  return project?.progress as string[] | null;
}
