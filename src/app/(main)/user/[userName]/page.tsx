import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";
import { EditProfileButton, TrendsSidebar, UserPosts } from "../../_components";
import {
  FollowButton,
  FollowerCount,
  Linkify,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
} from "@/components";
import { formatDate } from "date-fns";
import { formmatNumber } from "@/lib/utils";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import Image from "next/image";
import { vi } from "date-fns/locale";

interface UserPageProps {
  params: { userName: string };
}

const getUser = cache(async (userName: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { userName: { equals: userName, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { userName },
}: UserPageProps) {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId) return {};

  const user = await getUser(userName, loggedInUserId.id);

  return {
    title: `${user.displayName} (@${user.userName})`,
  };
}

export default async function UserPage({
  params: { userName },
}: UserPageProps) {
  const { user: loggedInUserId } = await validateRequest();

  if (!loggedInUserId)
    return (
      <span className="text-destructive">
        You're not authrized to view this page.
      </span>
    );

  const user = await getUser(userName, loggedInUserId.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUserId.id} />
        <div className="rounded-2xl border bg-card p-5 shadow-md">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl border bg-card p-5 shadow-md">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="flex items-center gap-1 text-muted-foreground">
              @{user.userName}{" "}
              {user.gender && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {user.gender === "female" ? (
                        <Image
                          src={femaleIcon}
                          alt={`${user.gender} icon`}
                          className="size-4"
                        />
                      ) : (
                        <Image
                          src={maleIcon}
                          alt={`${user.gender} icon`}
                          className="size-4"
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="capitalize"
                    >
                      {user.gender}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div>{`Member since ${formatDate(user.createdAt, "d MMM, yyyy", { locale: vi })}`}</div>
          <div className="flex items-center gap-3">
            <span>
              Post:{" "}
              <span className="font-semibold">
                {formmatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
