"use server";

import { lucia } from "@/auth";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
import streamSeverClient from "@/lib/stream";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { userName, email, password, displayName } =
      signUpSchema.parse(credentials);
    // hash password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    // create userId
    const userId = generateIdFromEntropySize(10);
    // check username
    const existingUsername = await prisma.user.findFirst({
      where: { userName: { equals: userName, mode: "insensitive" } },
    });
    if (existingUsername) return { error: "Username already taken." };
    // check email
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existingEmail) return { error: "Username already taken." };

    await prisma.$transaction(async (tx) => {
      // create new user
      await tx.user.create({
        data: { id: userId, userName, displayName, email, passwordHash },
      });

      await streamSeverClient.upsertUser({
        id: userId,
        username: userName,
        name: displayName,
      });
    });

    // set session cookies
    const session = await lucia.createSession(userId, {});
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
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
