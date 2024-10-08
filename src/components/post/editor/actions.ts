"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";
import { UTApi } from "uploadthing/server";

export async function submitPost(input: {
  conten: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized.");

  const { content, mediaIds } = createPostSchema.parse({
    content: input.conten,
    mediaIds: input.mediaIds,
  });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: { connect: mediaIds.map((id) => ({ id })) },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

export async function deleteMedia(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized.");

  const deleteMedia = await prisma.media.delete({
    where: { id },
  });

  if (deleteMedia) {
    const key = deleteMedia.url.split(
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
    )[1];
    await new UTApi().deleteFiles(key);
  }
}
