import { FileText, Plus, Sparkles } from "lucide-react";
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
      <div className="max-w-md space-y-6">
        {/* App Title */}
        <div className="space-y-2">
          <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
            Knit Pattern Reader
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your knitting pattern PDF to start
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center py-8">
          <div className="rounded-full bg-primary/10 p-8">
            <Sparkles className="h-16 w-16 text-primary" strokeWidth={1.5} />
            {/* <FileText className="h-16 w-16 text-primary" strokeWidth={1.5} /> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasProjects ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link href="/projectbox">
                  <FileText className="mr-2 h-5 w-5" />
                  View My Projects
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/projectbox/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Project
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild size="lg" className="w-full">
              <Link href="/projectbox/new">
                <Plus className="mr-2 h-5 w-5" />
                Upload Pattern & Start
              </Link>
            </Button>
          )}
        </div>

        {/* Stats or Info */}
        {hasProjects && (
          <p className="pt-4 text-muted-foreground text-sm">
            You have {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </p>
        )}
      </div>
    </div>
  );
}
