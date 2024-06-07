"use client";

import { Post } from "@prisma/client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CardItem from "./card-item";
import CardSkeleton from "./skeleton/card-skeleton";

interface CardPostsProps {
  session: Session | null;
}

export default function CardPosts({ session }: CardPostsProps) {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  const fetchPosts = async ({
    pageParam,
    filter = "",
  }: {
    pageParam: number;
    filter?: string;
  }) => {
    const resp = await fetch(
      `api/posts?page=${pageParam}${
        filter && `&filter=${encodeURIComponent(filter)}`
      }`,
      {
        method: "GET",
        cache: "no-store",
        next: {
          tags: ["posts"],
        },
      }
    );
    const { posts } = await resp.json();
    return posts;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["posts", query],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, filter: query }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
  });

  const filterPosts = useCallback(
    (post: Post) => {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedQuery, "i");
      return regex.test(post.title) || regex.test(post.body);
    },
    [query]
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString());
    const search = current.get("search") || "";
    setQuery(search);
  }, [searchParams]);

  useEffect(() => {
    const cachedData:
      | { pages: Array<Post[]>; pageParams: number[] }
      | undefined = queryClient.getQueryData(["posts", query]);

    const cachedDataMap = cachedData?.pages.flatMap((group: Post[]) =>
      group.filter(filterPosts)
    );

    if (!cachedData && !isLoading) {
      refetch();
    } else if (!isLoading && cachedDataMap?.length === 0) {
      refetch();
    }
  }, [query, queryClient, filterPosts, isLoading, refetch]);

  const postContentFind = data?.pages.flatMap((group: Post[]) => {
    return group.filter(filterPosts);
  });

  const postsContent = data?.pages.map((group: Post[]) =>
    group.filter(filterPosts).map((post: Post, index: number) => {
      if (group.length == index + 1) {
        return (
          <CardItem innerRef={ref} key={index} session={session} post={post} />
        );
      } else {
        return <CardItem key={index} session={session} post={post} />;
      }
    })
  );

  return isLoading || isRefetching ? (
    <div className="flex pt-[10%] justify-center items-center">
      <div
        className={`h-14 w-14 animate-spin rounded-full border-t-4 border-solid border-gray-500 dark:border-white`}
      />
    </div>
  ) : (
    <div className="flex flex-col justify-center md:p-10 p-2 w-screen gap-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {postContentFind && postContentFind.length > 0
          ? postsContent
          : "No posts found"}
        {isFetchingNextPage && <CardSkeleton />}
        {isFetchingNextPage && <CardSkeleton />}
        {isFetchingNextPage && <CardSkeleton />}
      </div>
    </div>
  );
}
