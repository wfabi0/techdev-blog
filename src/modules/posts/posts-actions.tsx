import { generateSlug } from "@/components/card-posts/card-item";
import { formSchema } from "@/components/navbar/navbar-login-menu";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

export async function newPost(formData: z.infer<typeof formSchema>) {
  "use server";

  try {
    const {
      "post-title": title,
      "post-body": body,
      "post-author": author,
    } = formData;
    const post = await prisma.post.create({
      data: {
        slug: generateSlug(title),
        title,
        body,
        authorsId: [author],
        feedback: {},
      },
    });
    if (!post) return { error: "Post not created", status: 500 };
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
