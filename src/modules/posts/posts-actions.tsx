import { generateSlug } from "@/components/card-posts/card-item";
import { formSchema } from "@/components/navbar/navbar-login-menu";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getLastPostByUser } from "./posts-services";

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
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}
