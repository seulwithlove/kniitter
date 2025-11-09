import { use } from "react";
import prisma from "@/lib/db";
import ProjectList from "./project-list";

export type Project = {
  id: number;
  name: string;
  content: string;
  isCompleted: boolean;
};

export default function ProjectBox() {
  const projects = use(
    prisma.project.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        isCompleted: true,
      },
    }),
  );
  // console.log("💻 - page.tsx - projects:", projects);

  return (
    // if there is any project, show projects
    // if not just show pdf uploader

    <ProjectList projects={projects} />
  );
}
