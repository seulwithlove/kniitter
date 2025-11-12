"use client";

import { Waves } from "lucide-react";
import { getProjectColor } from "@/lib/pattern-types";
import { getProjectIconVariant, ProjectIcon } from "./pattern-icons";

interface ProjectCardProps {
  id: number;
  name: string;
  progress?: {
    completed: number;
    total: number;
  };
  onClick?: () => void;
}

export function ProjectCard({ id, name, progress, onClick }: ProjectCardProps) {
  const color = getProjectColor(id);
  const iconVariant = getProjectIconVariant(id);

  // Calculate progress percentage
  const progressPercent = progress
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  console.log(progress);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{
        backgroundColor: `var(--pattern-${color.name})`,
      }}
    >
      {/* Waves bar top right */}
      <div className="absolute top-4 right-4 flex gap-0.5 opacity-60">
        <Waves />
      </div>

      {/* Project name top left */}
      <div className="absolute top-4 left-4 text-left">
        <p
          className="line-clamp-2 font-medium text-sm leading-tight"
          style={{
            color: `var(--pattern-${color.name}-text)`,
          }}
        >
          {name}
        </p>
      </div>

      {/* Geometric icon in center */}
      <div className="flex h-full items-center justify-center pb-16">
        <ProjectIcon
          variant={iconVariant}
          size={80}
          className="opacity-80 transition-transform duration-300 group-hover:scale-110"
          style={{
            color: `var(--pattern-${color.name}-text)`,
          }}
        />
      </div>

      {/* Project title at bottom */}
      <div className="absolute right-0 bottom-0 left-0 px-4 pb-4">
        <p
          className="font-semibold text-lg leading-tight"
          style={{
            color: `var(--pattern-${color.name}-text)`,
          }}
        >
          {name.length > 15 ? `${name.substring(0, 15)}...` : name}
        </p>

        {/* Progress bar and percentage */}
        {progress && progress.total >= 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span
                className="opacity-75"
                style={{
                  color: `var(--pattern-${color.name}-text)`,
                }}
              >
                {progress.completed}/{progress.total}
              </span>
              <span
                className="font-semibold"
                style={{
                  color: `var(--pattern-${color.name}-text)`,
                }}
              >
                {progressPercent}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full"
              style={{
                backgroundColor: `var(--pattern-${color.name}-text)`,
                opacity: 0.2,
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: `var(--pattern-${color.name}-text)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
