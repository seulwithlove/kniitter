import { BoxIcon, PlusSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex h-full flex-col place-items-center justify-center gap-40 bg-amber-500x">
      <Link href="/projectbox" className="bg-blue-400x p-10">
        {/* TODO: when click, delay 0.5s & show openBox icon */}
        <BoxIcon className="cursor-pointer" size={60} />
      </Link>
      <Link href="/projectbox/new" className="p-10">
        <PlusSquareIcon className="cursor-pointer" size={60} />
      </Link>
    </div>
  );
}
