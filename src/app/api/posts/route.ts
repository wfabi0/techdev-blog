import { getAllPosts } from "@/modules/posts/posts-services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const posts = await getAllPosts();
  return NextResponse.json(
    { posts: posts?.posts || [] },
    { status: posts?.status }
  );
}

export const revalidate = 0;