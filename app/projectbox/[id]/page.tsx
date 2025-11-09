import { notFound } from "next/navigation";
import PatternViewer from "@/components/pattern-viewer";
import { flattenSteps, parseBanulPattern } from "@/lib/banul-pattern-parser";
import { getProjectByIdAction } from "../project.action";

// 해당 id 프로젝트의 패턴 페이지
export default async function Pattern({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id, 10);

  if (Number.isNaN(projectId)) notFound();

  const project = await getProjectByIdAction(projectId);

  if (!project) {
    notFound();
  }

  const parsedSteps = parseBanulPattern(project.content);

  const steps = flattenSteps(parsedSteps);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 font-bold text-2xl">{project.name}</h1>
        <p className="text-muted-foreground text-sm">
          Total steps: {steps.length}
        </p>
      </div>
      <PatternViewer steps={steps} patternId={projectId.toString()} />
    </div>
  );
}
