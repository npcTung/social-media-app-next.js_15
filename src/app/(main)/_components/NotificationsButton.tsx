"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import icons from "@/lib/icons";
import kyInstance from "@/lib/ky";
import path from "@/lib/path";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const { Bell } = icons;

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get(`${path.API + path.NOTIFICATIONS}/unread-count`)
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            className="flex items-center justify-start lg:gap-3"
            asChild
          >
            <Link href={`/${path.NOTIFICATIONS}`}>
              <div className="relative">
                <Bell />
                {!!data.unreadCount && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
                    {data.unreadCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="inline bg-card lg:hidden"
        >
          Notifications
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
