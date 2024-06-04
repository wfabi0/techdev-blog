import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/modules/auth/auth";
import { LogIn } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <div className="flex items-center justify-center flex-grow">
        <Card>
          <CardHeader>
            <CardTitle className="flex">
              <span className="pr-2">
                <FaGithub />
              </span>
              Login with GitHub
            </CardTitle>
            <CardDescription>
              Sign in with your GitHub account to access the app.
            </CardDescription>
          </CardHeader>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <CardFooter>
              <Button type="submit">
                <span className="pr-1">
                  <LogIn className="h-5 w-5" />
                </span>
                Sign in
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
