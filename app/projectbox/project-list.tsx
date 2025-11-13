"use client";

import Link from "next/link";
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
          <div className="mt-6">
            <Link
              href="/projectbox/new"
              className="inline-block rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create New Project
            </Link>
          </div>
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

          {/* Create New Project Card */}
          <Link
            href="/projectbox/new"
            className="group relative aspect-square w-full overflow-hidden rounded-3xl border-1 border-black/10 border-dashed bg-muted/5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-black/20 hover:bg-muted/10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:border-white/10 dark:hover:border-white/20"
          >
            <div className="flex h-full flex-col items-center justify-center">
              <svg
                className="h-11 w-11 text-muted-foreground/60 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Add project</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="mt-4 text-lg text-muted-foreground/80">
                New Project
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
