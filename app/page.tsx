import { BoxIcon, PackageOpen, PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import prisma from "@/lib/db";

export default function Home() {
  const projects = use(
    prisma.project.findMany({
      select: {
        id: true,
      },
    }),
  );
  // const projects = []; // for debugging
  const hasProjects = projects.length > 0;
  return (
    <div className="mx-auto flex h-full flex-col place-items-center justify-center gap-40 bg-amber-500x">
      {hasProjects ? (
        <Link href="/projectbox" className="bg-blue-400x p-10">
          <BoxIcon color="#e59a9a" className="cursor-pointer" size={60} />
        </Link>
      ) : (
        <Link href="/projectbox/new" className="p-10">
          <PackageOpen
            color="#e59a9a"
            className="cursor-pointer" //TODO: change border color
            size={60}
          />
        </Link>
      )}
      <Link href="/projectbox/new" className="p-10">
        <PlusSquareIcon color="#e59a9a" className="cursor-pointer" size={60} />
      </Link>
    </div>
  );
}
