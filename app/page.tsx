import { FileText, Grip, Plus } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default function Home() {
  const projects = use(
    prisma.project.findMany({
      select: {
        id: true,
      },
    }),
  );

  const hasProjects = projects.length > 0;

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-8">
        {/* App Title */}
        <div className="space-y-3">
          <h1 className="font-light text-4xl tracking-tight md:text-5xl">
            Knit Pattern Reader
          </h1>
          <p className="text-base text-muted-foreground">
            Upload your knitting pattern PDF to start
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center py-6">
          <div className="rounded-3xl border border-black/5 bg-background p-8 shadow-sm dark:border-white/5">
            <Grip className="h-14 w-14 text-foreground/60" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasProjects ? (
            <>
              <Button
                asChild
                size="sm"
                className="h-14 w-full rounded-2xl font-normal text-base shadow-sm"
              >
                <Link href="/projectbox">
                  <FileText className="mr-2 h-5 w-5" strokeWidth={1.5} />
                  View Projects
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-14 w-full rounded-2xl border-black/10 font-normal text-base dark:border-white/10"
              >
                <Link href="/projectbox/new">
                  <Plus className="mr-2 h-5 w-5" strokeWidth={1.5} />
                  Create New Project
                </Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="h-14 w-full rounded-2xl font-normal text-base shadow-sm"
            >
              <Link href="/projectbox/new">
                <Plus className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Upload Pattern & Start
              </Link>
            </Button>
          )}
        </div>

        {/* Stats or Info */}
        {hasProjects && (
          <p className="pt-2 text-muted-foreground text-sm">
            You have {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </p>
        )}
      </div>
    </div>
  );
}
