"use client";

import { newPost } from "@/modules/posts/posts-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Send, SquarePen } from "lucide-react";
import { User } from "next-auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import NavbarLoginSignOutForm from "./form/navbar-login-signout-form";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center w-full h-full">
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  ),
});

interface NavbarLoginMenuProps {
  session: User;
  newPost: typeof newPost;
}

export const formSchema = z.object({
  "post-title": z.string({ required_error: " " }).min(3).max(50),
  "post-body": z.string({ required_error: " " }).min(3).max(5000),
  "post-author": z.string({ required_error: " " }).min(1),
});

export default function NavbarLoginMenu({
  session,
  newPost,
}: NavbarLoginMenuProps) {
  const queryClient = useQueryClient();

  const pathname = usePathname();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "post-title": "",
      "post-body": "",
    },
  });

  if (!session) return null;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const post = await newPost(data);
    form.reset();
    if (!post || post?.error) {
      setIsDialogOpen(false);
      return toast.error(post.error || "Post not created, please try again.");
    }
    toast.success("Post created successfully.");
    setIsDialogOpen(false);
    queryClient.refetchQueries({
      queryKey: ["posts"],
    });
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ align: [] }],
      [{ color: [] }],
      ["code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "align",
    "color",
    "code-block",
  ];

  if (!session) return <></>;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <Avatar>
              <AvatarFallback>
                {session.name?.toString().length || 0 >= 2
                  ? session.name
                      ?.toString()
                      .normalize("NFD")
                      .substring(0, 2)
                      .toUpperCase()
                  : session.name?.toString()[0] || "CN"}
              </AvatarFallback>
              <AvatarImage
                src={session.image || "https://github.com/wfabi0.png"}
                alt="avatar"
              />
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32 mx-2">
          <DropdownMenuLabel className="text-center">
            {session.login || "My account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {pathname === "/" && (
              <>
                <DropdownMenuItem>
                  <DialogTrigger
                    onClick={() => {
                      form.setValue(
                        "post-author",
                        session.userId?.toString() || "128875797"
                      );
                    }}
                    asChild
                  >
                    <button className="flex items-center cursor-default">
                      <SquarePen className="mr-2 h-4 w-4" />
                      <span>Create post</span>
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href={"/profile"}>
                <Send className="mr-2 h-4 w-4" />
                <span>Publications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <NavbarLoginSignOutForm />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {pathname === "/" && (
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              <p className="flex items-center justify-center md:justify-normal">
                <SquarePen className="mr-1.5 h-5 w-5" />
                Create a new post.
              </p>
            </DialogTitle>
            <DialogDescription className="text-center md:text-left">
              Create a new post to share with the community.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              ref={ref}
              className="space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="post-title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Post Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your post name."
                        className="col-span-3"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="post-body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Post Body</FormLabel>
                    <FormControl className="col-span-4 max-h-80 h-64">
                      <Controller
                        control={form.control}
                        name="post-body"
                        render={({ field }) => (
                          <div className="md:max-w-[52.8rem] max-w-[19.4rem]">
                            <ReactQuill
                              value={field.value || ""}
                              onChange={field.onChange}
                              className="max-h-80 overflow-y-auto h-64 w-full bg-none shadow-lg"
                              placeholder="Write your post here..."
                              modules={quillModules}
                              formats={quillFormats}
                              style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                              }}
                            />
                          </div>
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="post-author"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="hidden">
                      <Input type="hidden" disabled {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-y-2">
                <DialogClose asChild>
                  <Button type="button" variant={"outline"}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Posting..." : "Post"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
