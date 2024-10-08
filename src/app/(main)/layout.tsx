import { validateRequest } from "@/auth";
import path from "@/lib/path";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SessionProvider from "./SessionProvider";
import { MenuBar, Navbar } from "./_components";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await validateRequest();

  if (!session.user) redirect(`/${path.AUTH}/${path.LOGIN}`);

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl border bg-card px-3 py-5 shadow-md sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
