import { validateRequest } from "@/auth";
import {
  FollowButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formmatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

const { Loader2 } = icons;

export default function TredsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: { id: user.id },
      followers: { none: { followerId: user.id } },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    usersToFollow.length > 0 && (
      <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-md">
        <div className="text-xl font-bold">Who to follow</div>
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <UserTooltip user={user}>
              <Link
                href={`/${path.USER}/${user.userName}`}
                className="flex items-center gap-3"
              >
                <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
                <div>
                  <span className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </span>
                  <span className="line-clamp-1 break-all text-muted-foreground">{`@${user.userName}`}</span>
                </div>
              </Link>
            </UserTooltip>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </div>
        ))}
      </div>
    )
  );
}

const getTrandingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content,'#[[:alnum:]_]+','g'))) AS hashtag, COUNT(*) AS count
      FROM posts
      GROUP BY (hashtag)
      ORDER BY count DESC, hashtag ASC
      LIMIT 5
    `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);

async function TrendingTopics() {
  const trendingTopics = await getTrandingTopics();

  return (
    trendingTopics.length > 0 && (
      <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-md">
        <div className="text-xl font-bold">Trending topics</div>
        {trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
          return (
            <Link
              key={title}
              href={`/${path.HASH_TAG}/${title}`}
              className="block"
            >
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="line-clamp-1 break-all font-semibold transition-all hover:underline">
                      {hashtag}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center">
                    {hashtag}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-muted-foreground">
                {`${formmatNumber(count)} bài viết`}
              </span>
            </Link>
          );
        })}
      </div>
    )
  );
}
