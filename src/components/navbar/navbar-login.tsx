import { Send } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NavbarLoginSignOutForm from "./form/navbar-login-signout-form";

interface NavbarAvatarProps {
  session: Session | null;
}

export default function NavbarLogin({ session }: NavbarAvatarProps) {
  return (
    <div>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <Avatar>
                <AvatarFallback>
                  {session.user.name?.toString().length || 0 >= 2
                    ? session.user.name
                        ?.toString()
                        .normalize("NFD")
                        .substring(0, 2)
                        .toUpperCase()
                    : session.user.name?.toString()[0] || "CN"}
                </AvatarFallback>
                <AvatarImage
                  src={session.user.image || "https://github.com/wfabi0.png"}
                  alt="avatar"
                />
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32 mx-2">
            <DropdownMenuLabel className="text-center">
              {session.user.login || "My account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/profile/posts"}>
                  <Send className="mr-2 h-4 w-4" />
                  <span>Publications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavbarLoginSignOutForm />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild className="text-sm w-[3.7rem] h-8">
          <Link href={"/auth/login"}>Login</Link>
        </Button>
      )}
    </div>
  );
}
