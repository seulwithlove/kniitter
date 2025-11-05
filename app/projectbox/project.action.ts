"use server";

import prisma from "@/lib/db";

export async function getProjectsAction() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      content: true,
      isCompleted: true,
    },
  });
  return projects;
}
