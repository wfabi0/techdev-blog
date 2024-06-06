"use client";

import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import CardItem from "./card-item";
import { useQuery } from "@tanstack/react-query";

interface CardPostsProps {
  session: Session | null;
}

export default function CardPosts({ session }: CardPostsProps) {
  const fetchPosts = async () => {
    const resp = await fetch("api/posts", {
      method: "GET",
      cache: "no-store",
    });
    console.log(resp);
    const { posts }: { posts: Post[] } = await resp.json();
    return posts;
  };

  const { isLoading, data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return isLoading ? (
    <div className="flex pt-[10%] justify-center items-center">
      <div
        className={`h-14 w-14 animate-spin rounded-full border-t-4 border-solid border-gray-500 dark:border-white`}
      />
    </div>
  ) : (
    <div className="flex justify-center md:p-10 p-2 w-screen">
      <div className="grid md:grid-cols-3 gap-4 w-full">
        {posts &&
          posts.map((post, index) => (
            <CardItem key={index} session={session} post={post} />
          ))}
      </div>
    </div>
  );
}
