"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function NavbarLoginSignOutForm() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center cursor-default"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </button>
  );
}
