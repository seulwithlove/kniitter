"use client";

import { FolderClosedIcon, FolderOpenIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FolderIcon() {
  const pathname = usePathname();
  const isProjectBoxPage = pathname === "/projectbox";

  return isProjectBoxPage ? (
    <FolderOpenIcon className="h-6 w-6" />
  ) : (
    <FolderClosedIcon className="h-6 w-6" />
  );
}
