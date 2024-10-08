"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import React from "react";
import {
  FollowButton,
  FollowerCount,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
} from "@/components";
import Link from "next/link";
import path from "@/lib/path";
import { formmatNumber } from "@/lib/utils";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import Image from "next/image";

interface UserTooltipProps extends React.PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();
  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex w-60 max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/${path.USER}/${user.userName}`}>
                <UserAvatar avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/${path.USER}/${user.userName}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  @{user.userName}{" "}
                  {user.gender === "female" && (
                    <Image
                      src={femaleIcon}
                      alt={`${user.gender} icon`}
                      className="size-4"
                    />
                  )}
                  {user.gender === "male" && (
                    <Image
                      src={maleIcon}
                      alt={`${user.gender} icon`}
                      className="size-4"
                    />
                  )}
                </div>
              </Link>
            </div>
            {user.bio && (
              <div className="line-clamp-4 whitespace-pre-line">{user.bio}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span>
              Post:{" "}
              <span className="font-semibold">
                {formmatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
