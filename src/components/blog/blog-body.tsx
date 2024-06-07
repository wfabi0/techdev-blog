import { Post } from "@prisma/client";

interface BlogBodyContentProps {
  post: Post;
}

export default function BlogBodyContent({ post }: BlogBodyContentProps) {
  return (
    <div
      className="overflow-x-hidden"
      dangerouslySetInnerHTML={{
        __html: post.body,
      }}
    />
  );
}
