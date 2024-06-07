import { Post } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface BlogHeaderAvatarProps {
  post: Post;
}

export default async function BlogHeaderAvatar({
  post,
}: BlogHeaderAvatarProps) {
  const fetchUsername = async () => {
    "use server";

    const res = await fetch(
      `${process.env.BASE_HOST_URL}:${process.env.PORT}/api/github/` +
        post.authorsId[0],
      {
        method: "GET",
      }
    );
    const data = await res.json();
    return data.name;
  };

  const username = await fetchUsername();

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
            <div className="line-clamp-1">{username || post.authorsId[0]}</div>
          </div>
        </Link>
      </div>
    </Button>
  );
}
