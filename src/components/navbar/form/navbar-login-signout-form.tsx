import { signOut } from "@/modules/auth/auth";
import { LogOut } from "lucide-react";

export default function NavbarLoginSignOutForm() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="flex items-center cursor-default" type="submit">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </button>
    </form>
  );
}
