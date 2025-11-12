"use client";

import { useRouter } from "next/navigation";
import { type PropsWithChildren, useActionState, useState } from "react";
import { toast } from "sonner";
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
  const { confirm, alert } = useAlerter();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const [error, save, isPending] = useActionState(
    async (_: { error: string } | undefined, formData: FormData) => {
      formData.set("id", String(project.id));

      const err = await updateProject(formData);

      if (err) {
        return err;
      }
      router.refresh();
      setOpen(false);
    },
    undefined,
  );

  const remove = async () => {
    console.log("💻 - card-dialog.tsx - remove!!!!");

    const ret = await confirm({
      title: "Are you sure?",
      description: "This action cannot be undone.",
    });

    if (!ret) return;

    const err = await deleteProject(project.id);
    console.log("💻 - card-dialog.tsx - err:", err);

    if (err?.error) {
      toast.error(err.error, {
        duration: 4000,
      });
      return;
    }
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {/* <form onSubmit={handleSave}> */}
        <form action={save}>
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
                name="name"
                defaultValue={project.name}
                placeholder="Enter project name"
                className={error ? "border-pink-800" : ""}
              />
              {error && <p className="text-pink-800 text-sm">{error.error}</p>}
            </div>
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>

            <Button
              onClick={remove}
              type="button"
              variant={"destructive"}
              disabled={isPending}
            >
              Delete
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
