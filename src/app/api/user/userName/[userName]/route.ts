import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userName } }: { params: { userName: string } },
) {
  try {
    const { user: loggindInUser } = await validateRequest();

    if (!loggindInUser)
      return Response.json({ error: "Unauthorized." }, { status: 401 });

    const user = await prisma.user.findFirst({
      where: { userName: { equals: userName, mode: "insensitive" } },
      select: getUserDataSelect(loggindInUser.id),
    });

    if (!user)
      return Response.json({ error: "User not found." }, { status: 404 });

    return Response.json(user);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
