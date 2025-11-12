import { use } from "react";
import prisma from "@/lib/db";
import ProjectList from "./project-list";

export type Project = {
  id: number;
  name: string;
  content: string;
  isCompleted: boolean;
  progress: string[] | null;
};

export default function ProjectBox() {
  const projectsRaw = use(
    prisma.project.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        isCompleted: true,
        progress: true,
      },
    }),
  );
  // Cast progress from JsonValue to string[] | null //TODO: check this pattern
  const projects = projectsRaw.map((project) => ({
    ...project,
    progress: project.progress as string[] | null,
  }));

  return <ProjectList projects={projects} />;
}
