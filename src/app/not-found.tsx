import path from "@/lib/path";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="my-40 flex h-full w-full flex-col items-center space-y-3 text-center">
      <h1 className="text-3xl font-bold">Not Found</h1>
      <span>The page you are looking for does not exits.</span>
      <Link href={path.HOME} className="w-fit text-primary hover:underline">
        Go to home
      </Link>
    </main>
  );
}
