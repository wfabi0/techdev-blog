"use client";

import { Send, SquarePen } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import NavbarLoginSignOutForm from "./form/navbar-login-signout-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface NavbarLoginMenuProps {
  session: User;
}

export const formSchema = z.object({
  "post-title": z.string({ required_error: " " }).min(3).max(50),
  "post-body": z.string({ required_error: " " }).min(3).max(500),
});

export default function NavbarLoginMenu({ session }: NavbarLoginMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submit!!!", data);
  }

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
            <DropdownMenuItem>
              <DialogTrigger>
                <button className="flex items-center cursor-default">
                  <SquarePen className="mr-2 h-4 w-4" />
                  <span>Create post</span>
                </button>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={"/profile/posts"}>
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
      <DialogContent>
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
            className="space-y-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="post-title"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Post Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your post name."
                          className="col-span-3"
                          autoComplete="false"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="post-body"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Post Body</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          placeholder="Your post body."
                          className="col-span-3"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
