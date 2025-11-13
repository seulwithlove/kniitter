import Link from "next/link";
import ThemeChanger from "@/components/theme-changer";
import FolderIcon from "./folder-icon";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <Link href="/projectbox" className="btn-icon">
        <FolderIcon />
      </Link>
      <ThemeChanger />
    </div>
  );
}
