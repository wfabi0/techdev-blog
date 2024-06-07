"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogHeaderShareButton() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  return (
    <button
      title="Share"
      onClick={handleCopy}
      className="transition duration-300 hover:text-black dark:hover:text-white"
    >
      <Share2 className="h-[1.2rem] w-[1.2rem]" />
    </button>
  );
}
