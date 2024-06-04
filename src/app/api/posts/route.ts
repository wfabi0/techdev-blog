import { auth } from "@/modules/auth/auth";
import { PostsServices } from "@/modules/posts/posts-services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const posts = await PostsServices.getAllPosts();
  return NextResponse.json(
    { posts: posts?.posts || [] },
    {
      status: posts?.status,
    }
  );
}
