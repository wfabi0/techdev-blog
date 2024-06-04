"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function NavbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const current = new URLSearchParams(searchParams.toString());
    const value = event.target.value;
    if (!value) {
      current.delete("search");
    } else {
      current.set("search", value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
    setQuery(current.get("search") || "");
  };

  return (
    pathname === "/" && (
      <>
        <Input
          type="search"
          onChange={onQueryChange}
          placeholder={searchParams.get("search") || "Search for a post..."}
          value={query}
        />
        <Separator
          className="bg-gray-400 h-full ml-4 mr-1.5"
          orientation="vertical"
        />
      </>
    )
  );
}
