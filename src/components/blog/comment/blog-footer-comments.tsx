import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GithubService } from "@/modules/github/github-services";
import { Comment, Post } from "@prisma/client";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

export interface PostWithComments extends Post {
  comments: Comment[];
}

interface BlogFooterCommentsProps {
  post: PostWithComments;
  comment: Comment;
  index: number;
}

export default async function BlogFooterComments({
  post,
  comment,
  index,
}: BlogFooterCommentsProps) {
  let displayData;
  if (differenceInDays(new Date(), comment.createdAt) > 7) {
    displayData = format(comment.createdAt, "dd/MM/yyyy");
  } else {
    displayData = formatDistanceToNow(comment.createdAt, {
      addSuffix: true,
    });
  }

  const data =
    process.env.NODE_ENV === "production"
      ? await GithubService.fetchUser(comment.authorId)
      : null;

  const username = data?.username || data?.name || comment.authorId;
  const login = data?.login || comment.authorId;

  return (
    <div
      className="flex flex-row md:space-x-3 space-x-2"
      id={`comment-${index + 1}`}
    >
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
        <AvatarImage
          src={`https://avatars.githubusercontent.com/u/${comment.authorId}?v=4`}
        />
      </Avatar>
      <div className="w-full border border-gray-300 dark:border-slate-700 rounded-sm">
        <div className="text-sm space-x-1 bg-slate-200/50 border-b border-gray-300 dark:border-slate-700 dark:bg-slate-900 p-2">
          <Link
            className="font-semibold hover:underline hover:decoration-[0.5px] hover:text-blue-500 hover:decoration-blue-500"
            href={`https://github.com/${login}`}
          >
            {username || "Not identified"}
          </Link>
          <span className="text-zinc-600 dark:text-gray-400 space-x-1">
            <span>commented</span>
            <Link
              className="hover:underline hover:decoration-[0.5px] hover:text-blue-500 hover:decoration-blue-500"
              href={`#comment-${index + 1}`}
            >
              {displayData}
            </Link>
          </span>
        </div>
        <div className="p-3.5 text-[0.9rem]">{comment.body}</div>
      </div>
    </div>
  );
}
