import BlogBodyContent from "@/components/blog/blog-body";
import BlogHeader from "@/components/blog/blog-header";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/modules/posts/posts-services";
import { Post } from "@prisma/client";
import { redirect } from "next/navigation";

interface PostPageProps {
  params: {
    post: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const slug = params.post.toString();
  const findPost = await getPostBySlug(slug);
  if (!findPost || findPost.error) {
    return redirect("/404");
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <main className="flex-1 py-10 md:px-52">
        <div className="container mx-auto px-4 space-y-4">
          <BlogHeader post={findPost.post as Post} />
          <Separator orientation="vertical" className="h-[1px] w-full" />
          <BlogBodyContent post={findPost.post as Post} />
        </div>
      </main>
    </div>
  );
}
