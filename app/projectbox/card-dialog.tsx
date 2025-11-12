"use client";

import { useRouter } from "next/navigation";
import { type PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlerter } from "@/hooks/contexts/alerter";
import { deleteProject, updateProject } from "./project.action";

type CardDialogProps = {
  project: {
    id: number;
    name: string;
  };
};

export default function CardDialog({
  project,
  children,
}: PropsWithChildren<CardDialogProps>) {
  const { confirm, alert, prompt } = useAlerter();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [isPending, setPending] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [error, setError] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    setPending(true), setError("");

    const result = await updateProject(project.id, projectName.trim());

    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }

    router.refresh();
    setOpen(false);
    setPending(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    const ret = await confirm({ title: "Are u sure??" });
    if (!ret) return;

    setPending(true);
    const result = await deleteProject(project.id);

    if (result) {
      if ("error" in result) {
        setError(result.error || "");
        setPending(false);
        return;
      }
      await alert({ title: result.error?.[0] || "", okText: "Confirm" });
      setOpen(false);
      return;
    }
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project name or delete the project
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-sm">
                Project Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className={error ? "border-pink-800" : ""}
              />
              {error && <p className="text-pink-800 text-sm">{error}</p>}
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>

            <Button
              onClick={handleDelete}
              type="button"
              variant={deleteConfirm ? "destructive" : "outline"}
              disabled={isPending}
            >
              {deleteConfirm ? "Confirm Delete?" : "Delete"}
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
