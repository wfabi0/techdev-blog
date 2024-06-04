import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-center p-6 border-gray-300 dark:border-gray-900 border-t-[0.01px]">
      <div className="flex text-sm text-gray-600 items-center">
        By
        <span className="pl-1 underline font-semibold">
          <Link href={"https://github.com/wfabi0"}>wfabi0</Link>
        </span>
        . The source code is avaible on
        <span className="pl-1 underline font-semibold">
          <Link href={"https://github.com/wfabi0/techdev-blog"}>GitHub</Link>
        </span>
        .
      </div>
    </footer>
  );
}
