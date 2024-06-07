import { commentSchema } from "@/components/blog/comment/blog-footer-textarea";
import { generateSlug } from "@/components/card-posts/card-item";
import { formSchema } from "@/components/navbar/navbar-login-menu";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getLastCommentByUser, getLastPostByUser } from "./posts-services";

export async function newPost(formData: z.infer<typeof formSchema>) {
  "use server";

  const {
    "post-title": title,
    "post-body": body,
    "post-author": author,
  } = formData;

  const lastPost = await getLastPostByUser(author);
  if (
    lastPost?.posts &&
    Date.now() - (lastPost.posts.createdAt.getTime() as number) < 30 * 1000
  ) {
    const timeSince =
      Date.now() - (lastPost.posts.createdAt.getTime() as number);
    const timeRemaining = 30 * 1000 - timeSince;
    return {
      error: `You need to wait ${Math.ceil(
        timeRemaining / 1000
      )} seconds to post again`,
      status: 429,
    };
  }

  try {
    const post = await prisma.post.create({
      data: {
        slug: generateSlug(title),
        title,
        body,
        authorsId: [author],
        feedback: {},
      },
    });
    if (!post)
      return { error: "Post not created, please try again.", status: 500 };
    revalidatePath("/", "page");
    revalidateTag("posts");
    return { post, status: 201 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: "Post not created, please use a different name.",
          code: error.code,
          status: 500,
        };
      } else {
        return {
          error: "Post not created, please try again later.",
          code: error.code,
          status: 500,
        };
      }
    } else {
      throw new Error(error.message);
    }
  }
}

export async function newComment(formData: z.infer<typeof commentSchema>) {
  "use server";

  const { comment, postId, authorId } = formData;

  const lastComment = await getLastCommentByUser(authorId);
  if (
    lastComment.comment &&
    Date.now() - lastComment.comment.createdAt.getTime() < 30 * 1000
  ) {
    const timeSince =
      Date.now() - (lastComment.comment.createdAt.getTime() as number);
    const timeRemaining = 30 * 1000 - timeSince;
    return {
      error: `You need to wait ${Math.ceil(
        timeRemaining / 1000
      )} seconds to comment again`,
      status: 429,
    };
  }
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return {
        error: "Post not found, please try again later.",
        status: 404,
      };
    }
    const newComment = await prisma.comment.create({
      data: {
        body: comment,
        postId: postId,
        authorId: authorId,
      },
    });
    if (!newComment)
      return {
        error: "Comment not created, please try again.",
        status: 500,
      };
    return { comment: newComment, status: 201 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error: "Post not created, please use a different name.",
          code: error.code,
          status: 500,
        };
      } else {
        return {
          error: "Post not created, please try again later.",
          code: error.code,
          status: 500,
        };
      }
    } else {
      throw new Error(error.message);
    }
  }
}
