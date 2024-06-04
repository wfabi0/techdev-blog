import { Post } from "@prisma/client";
import moment from "moment";
import { Session } from "next-auth";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import CardAvatar from "./card-avatar";

interface CardItemProps {
  session: Session | null;
  post: Post;
}

export default function CardItem({ session, post }: CardItemProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
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
            className={`text-blue-500 ${post.title.length > 15 && "truncate"}`}
            href={generateSlug(post.slug)}
          >
            {post.title.length > 15
              ? post.title.substring(0, 15) + "..."
              : post.title}
          </Link>
        </CardTitle>
      </CardHeader>
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
