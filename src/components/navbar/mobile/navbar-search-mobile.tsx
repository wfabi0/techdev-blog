"use client";

import { Button } from "@/components/ui/button";
import { CommandDialog } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface NavbarSearchMobileProps {
  query: string;
  onQueryChange: (event: any) => void;
}

export default function NavbarSearchMobile({
  query,
  onQueryChange,
}: NavbarSearchMobileProps) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const onButtonClick = (event: any) => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Button onClick={onButtonClick} className="" variant="ghost" size="icon">
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Input
          type="search"
          onChange={onQueryChange}
          placeholder={"Search for a post..."}
          value={query}
        />
      </CommandDialog>
    </>
  );
}
