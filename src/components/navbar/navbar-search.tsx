"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import NavbarSearchMobile from "./mobile/navbar-search-mobile";

export default function NavbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const onQueryChange: any = (event: any) => {
    const value = event.target.value;
    setQuery(value);
    const queryChange = () => {
      const current = new URLSearchParams(searchParams.toString());
      if (!value) {
        current.delete("search");
      } else {
        current.set("search", value);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
    };
    debounce(queryChange, 1000)();
  };

  return (
    pathname === "/" &&
    (isMobile ? (
      <>
        <NavbarSearchMobile onQueryChange={onQueryChange} query={query} />
        <Separator
          className="bg-gray-400 h-full ml-1.5 mr-1.5"
          orientation="vertical"
        />
      </>
    ) : (
      <>
        <Input
          type="search"
          onChange={onQueryChange}
          placeholder={"Search for a post..."}
          value={query}
        />
        <Separator
          className="bg-gray-400 h-full ml-4 mr-1.5"
          orientation="vertical"
        />
      </>
    ))
  );
}

function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let debounceTimer: NodeJS.Timeout | null;
  return (...args: Parameters<F>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}
