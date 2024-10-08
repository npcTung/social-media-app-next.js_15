"use client";

import {
  InfiniteScrollContainer,
  Post,
  PostsLoadingSkeleton,
} from "@/components";
import icons from "@/lib/icons";
import kyInstance from "@/lib/ky";
import path from "@/lib/path";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const { Loader2 } = icons;

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", path.FOR_YOU],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `${path.API + path.POSTS}/${path.FOR_YOU}`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <span className="text-center text-muted-foreground">
        No one has posted anything yet.
      </span>
    );

  if (status === "error")
    return (
      <span className="text-center text-destructive">
        An error occurred while loading posts.
      </span>
    );

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} className="border" />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
