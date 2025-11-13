"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewProject from "../../new/page";

export default function NewProjectModal() {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Upload a pattern PDF and start your new knitting project
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-6">
          <NewProject />
        </div>
      </DialogContent>
    </Dialog>
  );
}
