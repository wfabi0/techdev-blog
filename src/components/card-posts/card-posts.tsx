"use client";

import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import CardItem from "./card-item";

interface CardPostsProps {
  session: Session | null;
}

export default function CardPosts({ session }: CardPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    fetch("api/posts", { method: "GET" }).then(async (resp) => {
      setPosts((await resp.json())?.posts || []);
      setIsLoading(false);
    });
  }, []);
  return isLoading ? (
    <div className="flex pt-[10%] justify-center items-center">
      <div
        className={`h-14 w-14 animate-spin rounded-full border-t-4 border-solid border-gray-500 dark:border-white`}
      />
    </div>
  ) : (
    <div className="flex justify-center p-10 w-screen">
      <div className="grid md:grid-cols-3 gap-4 w-full">
        {posts.map((post, index) => (
          <CardItem key={index} session={session} post={post} />
        ))}
      </div>
    </div>
  );
}
