import { Post } from "@prisma/client";
import { format } from "date-fns";
import { Session } from "next-auth";
import Link from "next/link";
import { Ref } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CardAvatar from "./card-avatar";

interface CardItemProps {
  session: Session | null;
  post: Post;
  innerRef?: Ref<HTMLParagraphElement>;
}

export default function CardItem({ session, post, innerRef }: CardItemProps) {
  return (
    <Card
      ref={innerRef}
      className="shadow-lg flex flex-col min-h-[14rem] max-h-[30rem]"
    >
      <CardHeader className="pb-2">
        <CardDescription>
          <span className="flex justify-between">
            {format(post.createdAt, "MMMM do, yyyy")}
            <span className="flex -space-x-3.5">
              {post.authorsId.map((id) => (
                <CardAvatar key={id} session={session} id={id} />
              ))}
            </span>
          </span>
        </CardDescription>
        <CardTitle>
          <Link
            className={`text-blue-500 antialiased line-clamp-1`}
            href={"/blog/" + generateSlug(post.slug)}
          >
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          dangerouslySetInnerHTML={{ __html: post.body }}
          className="text-gray-900 dark:text-gray-300 antialiased line-clamp-5"
        />
      </CardContent>
      <CardFooter className="flex pb-3.5 mt-auto">
        <Button
          asChild
          className="w-full bg-gray-300/30 text-zinc-600 hover:bg-gray-300/65 hover:text-zinc-700 dark:text-zinc-300 dark:bg-slate-700/50 dark:hover:bg-slate-900 dark:hover:text-zinc-200 transition duration-300"
        >
          <Link href={"/blog/" + generateSlug(post.slug)}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function generateSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

function htmlToText(html: string) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}
