import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "../page";

export default function BoxDialog({
  project = { id: 0, content: "", isCompleted: false },
  children,
}: PropsWithChildren<{ project?: Project }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.id} Project </DialogTitle>
          {/* <DialogDescription>Descriptions...</DialogDescription> */}
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">This project is knitting...</Label>
          <Input id="content" value={project.content} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
