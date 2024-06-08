"use server";

import { cacheCommentsCount, cachePostsCount } from "@/lib/controllers";
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

export async function getLastPostByUser(userId: string) {
  try {
    const posts = await prisma?.post.findFirst({
      where: {
        authorsId: {
          has: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!posts) return { error: "No post found", status: 404 };
    return { posts };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma?.post.findUnique({
      where: {
        slug,
      },
      include: {
        comments: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!post) return { error: "No post found", status: 404 };
    return { post };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getLastCommentByUser(userId: string) {
  try {
    const comment = await prisma?.comment.findFirst({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!comment) return { error: "No comment found", status: 404 };
    return { comment };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getTotalPostByAuthor(userId: string) {
  if (isNaN(parseInt(userId))) {
    return {
      error: "User not found.",
      status: 404,
    };
  }

  if (cachePostsCount.has(userId)) {
    const cache = cachePostsCount.get(userId);
    if (Date.now() - cache.expires < 30000) {
      return cachePostsCount.get(userId).data;
    } else {
      cachePostsCount.remove(userId);
    }
  }

  try {
    const total = await prisma?.post.count({
      where: {
        authorsId: {
          has: userId.toString(),
        },
      },
    });

    cachePostsCount.set(userId, { total: total || 0 });
    return { total: total || 0 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}

export async function getTotalCommentByAuthor(userId: string) {
  if (isNaN(parseInt(userId))) {
    return {
      error: "User not found.",
      status: 404,
    };
  }

  if (cacheCommentsCount.has(userId)) {
    const cache = cacheCommentsCount.get(userId);
    if (Date.now() - cache.expires < 30000) {
      return cacheCommentsCount.get(userId).data;
    } else {
      cacheCommentsCount.remove(userId);
    }
  }

  try {
    const total = await prisma?.comment.count({
      where: {
        authorId: userId.toString(),
      },
    });

    cacheCommentsCount.set(userId, { total: total || 0 });
    return { total: total || 0 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}
