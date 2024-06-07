import { Post } from "@prisma/client";
import { format } from "date-fns";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import BlogHeaderAvatar from "./blog-header-avatar";
import BlogHeaderShareButton from "./button/blog-header-share-button";

interface BlogTitleProps {
  post: Post;
}

export default function BlogHeader({ post }: BlogTitleProps) {
  return (
    <div>
      <div className="flex flex-col space-y-10">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
          <Link
            className="flex items-center gap-x-1 transition duration-300 hover:text-black dark:hover:text-white"
            href="/"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Back to Blog
          </Link>
          <BlogHeaderShareButton />
        </div>
        <div className="space-y-4">
          <div>{format(post.createdAt, "EEEE, MMMM do yyyy")}</div>
          <h1 className="text-4xl text-slate-900 dark:text-white">
            {post.title}
          </h1>
        </div>
        <div className="space-y-2">
          <div>Posted by:</div>
          <div className="grid md:grid-cols-5 grid-rows-1 gap-x-3 gap-y-1 md:gap-y-2">
            {post.authorsId.map((author) => (
              <BlogHeaderAvatar key={author} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
