import { Post } from "@prisma/client";
import { format } from "date-fns";
import BlogHeaderAvatar from "./blog-header-avatar";

interface BlogTitleProps {
  post: Post;
}

export default function BlogHeader({ post }: BlogTitleProps) {
  return (
    <div className="flex flex-col space-y-10">
      <div className="space-y-4">
        <div>{format(post.createdAt, "EEEE, MMMM do yyyy")}</div>
        <h1 className="text-4xl text-slate-900 dark:text-white">
          {post.title}
        </h1>
      </div>
      <div>
        <div>Posted by:</div>
        <div className="grid grid-cols-5 gap-x-3">
          {post.authorsId.map((author) => (
            <BlogHeaderAvatar key={author} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
