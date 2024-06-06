"use server";

import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getAllPosts(
  page: number = 1,
  limit: number = 9,
  filter?: string
) {
  try {
    const posts = await prisma?.post.findMany({
      where: filter
        ? {
            title: {
              contains: filter,
              mode: "insensitive",
            },
          }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
    });
    if (!posts) return { error: "No posts found", status: 404 };
    return { posts };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}
