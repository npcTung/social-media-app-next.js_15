import { Metadata } from "next";
import { TrendsSidebar } from "../_components";
import SearchResults from "./SearchResults";

interface SearchPageProps {
  searchParams: { q: string };
}

export function generateMetadata({
  searchParams: { q },
}: SearchPageProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  };
}

export default function SearchPage({ searchParams: { q } }: SearchPageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-md">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
