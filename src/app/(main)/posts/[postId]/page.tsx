import { validateRequest } from "@/auth";
import {
  FollowButton,
  Linkify,
  Post,
  UserAvatar,
  UserTooltip,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

const { Loader2 } = icons;

interface PostPageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PostPageProps) {
  const { user } = await validateRequest();
  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostPage({ params: { postId } }: PostPageProps) {
  const { user } = await validateRequest();
  if (!user)
    return (
      <span className="text-destructive">
        You&apos;re not authrized to view this page.
      </span>
    );

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUserId } = await validateRequest();
  if (!loggedInUserId) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-md">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/${path.USER}/${user.userName}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} />
          <div>
            <span className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </span>
            <span className="line-clamp-1 break-all text-muted-foreground">{`@${user.userName}`}</span>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-wrap break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUserId.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUserId.id,
            ),
          }}
        />
      )}
    </div>
  );
}
