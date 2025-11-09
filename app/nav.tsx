import { ArchiveIcon } from "lucide-react";
import Link from "next/link";
import ThemeChanger from "@/components/theme-changer";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/projectbox" className="btn-icon">
        <ArchiveIcon className="h-6 w-6" />
      </Link>
      <ThemeChanger />
    </div>
  );
}
