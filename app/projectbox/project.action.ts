"use server";

import prisma from "@/lib/db";
import type { ParsedPattern } from "@/lib/en-pattern-parser";

export async function getProjects() {
  const projectsRaw = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      isCompleted: true,
      progress: true,
    },
  });
  return projectsRaw.map((project) => ({
    ...project,
    progress: project.progress as string[] | null,
  }));
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

export async function updateProject(id: number, name: string) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { name },
    });
    return project;
  } catch (err) {
    return { error: "Failed to update project" };
  }
}

export async function deleteProject(id: number) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { error: "Project not found" };
    }
    await prisma.project.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete project" };
  }
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
