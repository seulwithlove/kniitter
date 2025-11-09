"use client";

import { useRouter } from "next/navigation";
import type { Project } from "./page";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const handleProjectClick = (projectId: number) => {
    router.push(`/projectbox/${projectId}`);
  };
  return (
    <div className="flex h-full justify-center border border-amber-400">
      <div className="flex h-full flex-col place-items-center gap-4 border-3 border-red-500 p-3 py-6">
        {projects.length === 0 ? (
          <p>No projects yet. Create one to get started!</p>
        ) : (
          projects.map((project) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="cursor-pointer rounded border border-gray-300 p-4 transition-opacity hover:opacity-80"
            >
              {project.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
