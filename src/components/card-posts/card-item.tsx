import { Post } from "@prisma/client";
import moment from "moment";
import { Session } from "next-auth";
import Link from "next/link";
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
}

export default function CardItem({ session, post }: CardItemProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardDescription>
          <span className="flex justify-between">
            {moment(post.createdAt).format("MMMM Do, YYYY")}
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
            title={post.title}
          >
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-900 dark:text-gray-300 antialiased line-clamp-5">
          {post.body}
        </p>
      </CardContent>
      <CardFooter className="pb-3.5">
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
