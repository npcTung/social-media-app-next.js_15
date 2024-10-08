"use server";

import { lucia, validateRequest } from "@/auth";
import path from "@/lib/path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const { session } = await validateRequest();

  if (!session) throw new Error("UnAuthorized.");

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect(`/${path.AUTH}/${path.LOGIN}`);
}
