import { getAllPosts } from "@/modules/posts/posts-services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const filter = searchParams.get("filter")?.toString() || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");
  const posts = await getAllPosts(page, limit, filter);
  return NextResponse.json(
    { posts: posts?.posts || [] },
    { status: posts?.status }
  );
}

export const revalidate = 0;
