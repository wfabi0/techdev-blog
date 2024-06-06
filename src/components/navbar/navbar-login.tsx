import { Session } from "next-auth";
import Link from "next/link";
import { Button } from "../ui/button";
import NavbarLoginMenu from "./navbar-login-menu";
import { newPost } from "@/modules/posts/posts-actions";

interface NavbarAvatarProps {
  session: Session | null;
}

export default function NavbarLogin({ session }: NavbarAvatarProps) {
  return (
    <div>
      {session?.user ? (
        <NavbarLoginMenu session={session.user} newPost={newPost} />
      ) : (
        <Button asChild className="text-sm w-[3.7rem] h-8">
          <Link href={"/auth/login"}>Login</Link>
        </Button>
      )}
    </div>
  );
}
