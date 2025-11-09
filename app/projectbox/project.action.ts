"use server";

import prisma from "@/lib/db";

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

export async function createProjectAction(name: string, content: string) {
  const project = await prisma.project.create({
    data: {
      name,
      content,
    },
  });
  return project;
}
