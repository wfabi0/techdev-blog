import { Post } from "@prisma/client";

interface BlogBodyContentProps {
  post: Post;
}

export default function BlogBodyContent({ post }: BlogBodyContentProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: post.body,
      }}
    />
  );
}
