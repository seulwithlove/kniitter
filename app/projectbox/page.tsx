import BoxDialog from "./[id]/box-dialog";

export type Project = {
  id: number;
  content: string;
  isCompleted: boolean;
};

export type ProjectBoxProps = {
  projects: Project[];
};

export default function ProjectBox({ projects }: ProjectBoxProps) {
  return (
    <div className="flex w-full place-items-center justify-center gap-3 border-3 border-red-500">
      {projects.map((project) => (
        <BoxDialog key={project.id}>{project.content}</BoxDialog>
      ))}
    </div>
  );
}
