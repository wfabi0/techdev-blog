import { Post } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { GithubService } from "@/modules/github/github-services";

interface BlogHeaderAvatarProps {
  post: Post;
}

export default async function BlogHeaderAvatar({
  post,
}: BlogHeaderAvatarProps) {
  const data =
    process.env.NODE_ENV === "production"
      ? await GithubService.fetchUser(post.authorsId[0])
      : null;

  const username = data?.username || data?.name || post.authorsId[0];
  const login = data?.login || post.authorsId[0];

  return (
    <Button
      className="items-center justify-start p-1.5 space-x-2"
      variant={"ghost"}
      asChild
    >
      <div>
        <Link
          className="flex items-center space-x-2 max-w-full"
          href={username ? `https://github.com/${username}` : ""}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>FE</AvatarFallback>
            <AvatarImage
              src={`https://avatars.githubusercontent.com/u/${
                post.authorsId[0] || 128875797
              }?v=4`}
            />
          </Avatar>
          <div className="antialiased line-clamp-1">
            <div className="line-clamp-1">{username || "Not identified"}</div>
          </div>
        </Link>
      </div>
    </Button>
  );
}
