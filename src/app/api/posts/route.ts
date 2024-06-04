import { auth } from "@/modules/auth/auth";
import { PostsServices } from "@/modules/posts/posts-services";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const posts = await PostsServices.getAllPosts();
  return NextResponse.json(
    { posts: posts?.posts || [] },
    {
      status: posts?.status,
    }
  );
}
