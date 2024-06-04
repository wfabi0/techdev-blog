import { auth } from "@/modules/auth/auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import NavbarLogin from "./navbar-login";
import NavbarSearch from "./navbar-search";

const NavbarModeToggle = dynamic(() => import("./navbar-mode-toggle"), {
  ssr: false,
});

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="flex z-50 px-6 py-4 sticky top-0 justify-between border-gray-300 dark:border-gray-900 border-b-[0.01px] backdrop-blur items-center">
      <div className="md:px-8 text-xl font-semibold transition duration-300">
        <Link href={"/"}>TECHDEV</Link>
      </div>
      <div className="flex">
        <div className="flex items-center">
          <NavbarSearch />
          <div className="flex">
            <Button asChild variant="ghost" size="icon">
              <Link href={"https://github.com/wfabi0/techdev-blog"}>
                <FaGithub className="h-5 w-5" />
              </Link>
            </Button>
            <NavbarModeToggle />
          </div>
          <Separator
            className="bg-gray-400 h-full ml-1.5 mr-4"
            orientation="vertical"
          />
          <NavbarLogin session={session} />
        </div>
      </div>
    </nav>
  );
}
