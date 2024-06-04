import CardPosts from "@/components/card-posts/card-posts";
import { auth } from "@/modules/auth/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <main className="flex-1 py-10">
        <CardPosts session={session} />
      </main>
    </div>
  );
}
