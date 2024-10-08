"use client";

import { InfiniteScrollContainer, PostsLoadingSkeleton } from "@/components";
import icons from "@/lib/icons";
import kyInstance from "@/lib/ky";
import path from "@/lib/path";
import { NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Notification from "./Notification";
import { useEffect } from "react";

const { Loader2 } = icons;

export default function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [path.NOTIFICATIONS],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `${path.API + path.NOTIFICATIONS}`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance.patch(`${path.API + path.NOTIFICATIONS}/mark-as-read`),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && !notifications.length && !hasNextPage)
    return (
      <span className="text-center text-muted-foreground">
        You dont have any notifications yet.
      </span>
    );

  if (status === "error")
    return (
      <span className="text-center text-destructive">
        An error occurred while loading notifications.
      </span>
    );

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
    </InfiniteScrollContainer>
  );
}
