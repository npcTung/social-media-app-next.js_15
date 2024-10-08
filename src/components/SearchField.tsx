"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "./ui";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const { SearchIcon } = icons;

export default function SearchField() {
  const router = useRouter();
  const { theme } = useTheme();

  function handleSumbit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/${path.SEARCH}?q=${encodeURIComponent(q)}`);
  }
  return (
    <form onSubmit={handleSumbit} method="GET" action={`/${path.SEARCH}`}>
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          className={cn(
            "md:pe-10",
            theme === "dark" ? "bg-background" : "bg-muted",
          )}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
