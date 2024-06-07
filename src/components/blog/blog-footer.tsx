import { Post } from "@prisma/client";
import { MessageCircle, Undo2 } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import BlogFooterTextarea from "./comment/blog-footer-textarea";
import { newComment } from "@/modules/posts/posts-actions";
import BlogFooterComments, {
  PostWithComments,
} from "./comment/blog-footer-comments";

interface BlogFooterProps {
  session: Session | null;
  post: Post;
}

export default function BlogFooter({ session, post }: BlogFooterProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        <div className="flex space-x-1 items-center">
          <MessageCircle />
          <span className="text-lg">
            Comments ({(post as PostWithComments)?.comments.length || 0})
          </span>
        </div>
      </h1>
      <div className="space-y-4">
        {(post as PostWithComments)?.comments?.map((comment, index) => (
          <BlogFooterComments
            key={index}
            post={post as PostWithComments}
            comment={comment}
            index={index}
          />
        ))}
        <div className="flex flex-row md:space-x-3 space-x-2">
          <Avatar>
            <AvatarFallback>
              {session?.user?.name?.toString().length || 0 >= 2
                ? session?.user?.name
                    ?.toString()
                    .normalize("NFD")
                    .substring(0, 2)
                    .toUpperCase()
                : session?.user?.name?.toString()[0] || "CN"}
            </AvatarFallback>
            <AvatarImage
              src={
                session?.user?.userId
                  ? `https://avatars.githubusercontent.com/u/${session.user.userId}?v=4`
                  : "https://github.com/identicons/novato.png"
              }
            />
          </Avatar>
          <BlogFooterTextarea
            newComment={newComment}
            session={session}
            post={post}
          />
        </div>
      </div>
      <div className="flex justify-center text-sm text-zinc-600 dark:text-zinc-300">
        <Link
          className="flex items-center gap-x-1 transition duration-300 hover:text-black dark:hover:text-white"
          href="/"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
