import { validateRequest } from "@/auth";
import path from "@/lib/path";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();

  if (user) redirect(path.HOME);

  return <>{children}</>;
}
