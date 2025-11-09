import PatternViewer from "@/components/pattern-viewer";
import { parsePatternContent } from "@/lib/pattern-parser";
import { notFound } from "next/navigation";
import { getProjectByIdAction } from "../project.action";

// 해당 id 프로젝트의 패턴 페이지
export default async function Pattern({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id, 10);

  if (Number.isNaN(projectId)) notFound();

  const project = await getProjectByIdAction(projectId);

  if (!project) {
    notFound();
  }

  const parsedPattern = parsePatternContent(project.content);

  return (
    <div>
      <PatternViewer pattern={parsedPattern} projectId={projectId} />
    </div>
  );
}
