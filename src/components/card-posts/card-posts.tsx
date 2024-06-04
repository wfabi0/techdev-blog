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
    new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
      fetch("api/posts", { method: "GET" }).then(async (resp) => {
        setPosts((await resp.json())?.posts || []);
        setIsLoading(false);
      });
    });
  }, []);
  return isLoading ? (
    "Loading..."
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
