"use client";

import { Post } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CardItem from "./card-item";
import CardSkeleton from "./skeleton/card-skeleton";

interface CardPostsProps {
  session: Session | null;
}

export default function CardPosts({ session }: CardPostsProps) {
  const { ref, inView } = useInView();

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const resp = await fetch(`api/posts?page=${pageParam}`, {
      method: "GET",
      cache: "no-store",
    });
    const { posts } = await resp.json();
    return posts;
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length + 1 : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const postsContent = data?.pages.map((group: Post[]) =>
    group.map((post: Post, index: number) => {
      if (group.length == index + 1) {
        return (
          <CardItem innerRef={ref} key={index} session={session} post={post} />
        );
      } else {
        return <CardItem key={index} session={session} post={post} />;
      }
    })
  );

  return isLoading ? (
    <div className="flex pt-[10%] justify-center items-center">
      <div
        className={`h-14 w-14 animate-spin rounded-full border-t-4 border-solid border-gray-500 dark:border-white`}
      />
    </div>
  ) : (
    <div className="flex flex-col justify-center md:p-10 p-2 w-screen gap-y-10">
      <div className="grid md:grid-cols-3 gap-4 w-full">
        {postsContent}
        {isFetchingNextPage && <CardSkeleton />}
        {isFetchingNextPage && <CardSkeleton />}
        {isFetchingNextPage && <CardSkeleton />}
      </div>
    </div>
  );
}
