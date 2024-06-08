import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/modules/auth/auth";
import { GithubService } from "@/modules/github/github-services";
import {
  getTotalCommentByAuthor,
  getTotalPostByAuthor,
} from "@/modules/posts/posts-services";
import {
  MessageSquareText,
  NotepadText,
  Send,
  Undo2,
  User,
} from "lucide-react";
import Link from "next/link";
import { PiHandWavingBold } from "react-icons/pi";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const userData =
    process.env.NODE_ENV === "production"
      ? await GithubService.fetchUser(session.user.userId?.toString() as string)
      : null;

  const username = userData?.name || session.user.name;

  const totalPosts = await getTotalPostByAuthor(
    userData?.id || session.user.userId
  );
  const totalComments = await getTotalCommentByAuthor(
    userData?.id || session.user.userId
  );

  return (
    <main className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <div className="flex-1 py-10 md:px-52">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <Link
              className="flex items-center gap-x-1 transition duration-300 hover:text-black dark:hover:text-white"
              href="/"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Back to Blog
            </Link>
          </div>
          <div className="flex justify-center">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-center pb-4">
                  <Link
                    href={
                      userData?.login || session.user.login
                        ? `https://github.com/${
                            userData?.login || session.user.login
                          }`
                        : ""
                    }
                  >
                    <Avatar className="h-24 w-24 border-2">
                      <AvatarFallback className="text-4xl">
                        {username.toString().length || 0 >= 2
                          ? username
                              ?.toString()
                              .normalize("NFD")
                              .substring(0, 2)
                              .toUpperCase()
                          : username?.toString() || "CN"}
                      </AvatarFallback>
                      <AvatarImage
                        src={`https://avatars.githubusercontent.com/u/${session.user.userId}?v=4`}
                      />
                    </Avatar>
                  </Link>
                </div>
                <CardTitle>
                  <PiHandWavingBold className="inline-block mr-1" />
                  Welcome, {username || session.user.userId}
                </CardTitle>
                <CardDescription>
                  Your are logged with GitHub Account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div>
                  <div className="flex items-center gap-x-1">
                    <NotepadText className="h-4 w-4" /> ID:{" "}
                    {userData?.id || session.user.userId}
                  </div>
                  <div className="flex items-center gap-x-1">
                    <User className="w-4 h-4" /> Username:{" "}
                    {userData?.login || session.user.login}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-x-1">
                    <Send className="h-4 w-4" /> Total Publications:{" "}
                    {totalPosts?.total || 0}
                  </div>
                  <div className="flex items-center gap-x-1">
                    <MessageSquareText className="h-4 w-4" /> Total Comments:{" "}
                    {totalComments?.total || 0}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant={"secondary"} className="w-full">
                  More Information
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center text-sm text-zinc-600 dark:text-zinc-300">
            <Link
              className="flex items-center gap-x-1 transition duration-300 hover:text-black dark:hover:text-white"
              href="/"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
