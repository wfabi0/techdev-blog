import { generateSlug } from "@/components/card-posts/card-item";
import { formSchema } from "@/components/navbar/navbar-login-menu";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function newPost(formData: z.infer<typeof formSchema>) {
  "use server";

  try {
    const { "post-title": title, "post-body": body } = formData;
    const post = await prisma.post.create({
      data: {
        slug: generateSlug(title),
        title,
        body,
        feedback: {},
      },
    });
    if (!post) return { error: "Post not created", status: 500 };
    revalidatePath("/", "page");
    return { post, status: 201 };
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message, code: error.code, status: 500 };
    } else {
      throw new Error(error.message);
    }
  }
}