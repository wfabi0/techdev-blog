"use server";

import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getAllPosts() {
  try {
    const posts = await prisma?.post.findMany({
      take: 10,
    });
    if (!posts) return { error: "No posts found", status: 404 };
    return { posts, status: 200 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}
