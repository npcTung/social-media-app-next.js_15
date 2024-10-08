import { SearchField, UserButton } from "@/components";
import path from "@/lib/path";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link
          href={path.HOME}
          className="text-2xl font-bold capitalize text-primary"
        >
          social media app
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
