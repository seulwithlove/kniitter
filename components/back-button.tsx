"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      size="icon"
      className="h-10 w-10 rounded-full bg-black text-white shadow-md hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
      aria-label="Go back"
    >
      <ChevronLeftIcon className="h-6 w-6" strokeWidth={2} />
    </Button>
  );
}
