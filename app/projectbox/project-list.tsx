"use client";

import { useRouter } from "next/navigation";
import getTotalSteps from "@/components/get-total-steps";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "./page";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const handleProjectClick = (projectId: number) => {
    router.push(`/projectbox/${projectId}`);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-light text-3xl tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Select a project to continue working
        </p>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-3xl border border-black/5 bg-background p-8 shadow-sm dark:border-white/5">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <title>No projects</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="font-normal text-lg">No projects yet</p>
          <p className="mt-2 text-muted-foreground text-sm">
            Create your first project to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => {
            const totalSteps = getTotalSteps(project.content);
            const completedSteps = Array.isArray(project.progress)
              ? project.progress.length
              : 0;
            return (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                progress={{
                  completed: completedSteps,
                  total: totalSteps,
                }}
                onClick={() => handleProjectClick(project.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
