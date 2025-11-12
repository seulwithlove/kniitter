"use client";

import { Ellipsis } from "lucide-react";
import CardDialog from "@/app/projectbox/card-dialog";
import { getProjectColor } from "@/lib/pattern-types";
import { getProjectIconVariant, ProjectIcon } from "./pattern-icons";
import { Button } from "./ui/button";

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

  // console.log(progress);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-black/10 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-black/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:border-white/10 dark:hover:border-white/20"
        style={{
          backgroundColor: `var(--pattern-${color.name})`,
        }}
      >
        {/* Geometric icon in center */}
        <div className="flex h-full flex-col items-center justify-center pb-16">
          <ProjectIcon
            variant={iconVariant}
            size={80}
            className="pb-5 opacity-80 transition-transform duration-300 group-hover:scale-110"
            style={{
              color: `var(--pattern-${color.name}-text)`,
            }}
          />
          <div
            className="font-semibold text-lg leading-tight"
            style={{
              color: `var(--pattern-${color.name}-text)`,
            }}
          >
            {name.length > 15 ? `${name.substring(0, 15)}...` : name}
          </div>
        </div>

        {/* Project title at bottom */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-4">
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

      {/* Edit button */}
      <CardDialog project={{ id, name }}>
        <Button
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
          }}
          className="absolute top-4 right-4 opacity-60 transition-opacity hover:opacity-100"
        >
          <Ellipsis />
        </Button>
      </CardDialog>
    </div>
  );
}
