import { ArchiveIcon } from "lucide-react";
import ThemeChanger from "@/components/theme-changer";

export default function Nav() {
  return (
    <div className="flex items-center gap-5">
      <ArchiveIcon>{/* <KnitBox /> */}</ArchiveIcon>
      <ThemeChanger />
    </div>
  );
}
