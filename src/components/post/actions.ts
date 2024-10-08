"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { UTApi } from "uploadthing/server";

export async function deletePost(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized.");

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found.");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  if (deletedPost.attachments.length > 0) {
    deletedPost.attachments.map(async (attachment) => {
      const key = attachment.url.split(
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      )[1];

      await new UTApi().deleteFiles(key);
    });
  }

  return deletedPost;
}
