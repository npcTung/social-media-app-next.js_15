"use server";

import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import path from "@/lib/path";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { userName, password } = loginSchema.parse(credentials);
    // check user
    const existingUser = await prisma.user.findFirst({
      where: { userName: { equals: userName, mode: "insensitive" } },
    });
    if (!existingUser || !existingUser.passwordHash)
      return { error: "Incorrect userName or password." };
    // check password
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) return { error: "Incorrect password." };
    // set session cookies
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    // navigate
    return redirect(path.HOME);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return { error: "Something went wrong. Please try again." };
  }
}
