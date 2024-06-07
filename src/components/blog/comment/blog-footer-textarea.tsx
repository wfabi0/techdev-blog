"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { newComment } from "@/modules/posts/posts-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { Session } from "next-auth";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface BlogFooterTextareaProps {
  session: Session | null;
  post: Post;
  newComment: typeof newComment;
}

export const commentSchema = z.object({
  comment: z
    .string({
      required_error: " ",
    })
    .min(3)
    .max(1000),
  postId: z.string(),
  authorId: z.string(),
});

export default function BlogFooterTextarea({
  session,
  post,
  newComment,
}: BlogFooterTextareaProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const notifications: { type: string; message: string; createAt: number }[] =
      JSON.parse(localStorage.getItem("notifications") as string) || [];

    notifications.forEach((notification) => {
      console.log(notification);
      if (notification.type === "success") {
        toast.success(notification.message);
      } else if (notification.type === "error") {
        toast.error(notification.message);
      } else {
        toast.info(notification.message);
      }
    });

    localStorage.removeItem("notifications");
  }, []);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId: post.id,
      authorId: session?.user?.userId?.toString(),
    },
  });

  const onSubmit = async (formData: z.infer<typeof commentSchema>) => {
    const comment = await newComment(formData);
    form.reset({
      comment: "",
    });
    if (!comment || comment?.error) {
      return toast.error(
        comment?.error || "Failed to submit comment, try again."
      );
    }

    const notifications: { type: string; message: string; createAt: number }[] =
      JSON.parse(localStorage.getItem("notifications") as string) || [];

    notifications.push({
      type: "success",
      message: "Comment submitted successfully.",
      createAt: Date.now(),
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));
    window.location.reload();
  };

  const handleCommentClick = (event: MouseEvent<HTMLTextAreaElement>) => {
    if (!session || !session.user) {
      setOpen(true);
      return;
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="w-full space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a comment</FormLabel>
                <FormControl>
                  <Textarea
                    onClick={handleCommentClick}
                    readOnly={!session || !session.user}
                    placeholder="Enter your comment or feedback here..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input disabled type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input disabled type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              variant={"secondary"}
              type="submit"
              disabled={
                !session?.user ||
                !!form.formState.errors.comment ||
                form.formState.isSubmitting
              }
            >
              {form.formState.isSubmitting ? "Commenting..." : "Comment"}
            </Button>
          </div>
        </form>
      </Form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              You need to be logged in to comment.{" "}
              <Link href={"/auth/login"} className="text-blue-500">
                Click here to login.
              </Link>
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
