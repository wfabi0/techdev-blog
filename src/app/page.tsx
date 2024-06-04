import prisma from "../lib/prisma";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { auth } from "@/modules/auth/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 py-10">
        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
          {JSON.stringify(session || null, null, 2)}
        </pre>
      </main>
      <Footer />
    </div>
  );
}
