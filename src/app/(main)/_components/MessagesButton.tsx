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
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const { MessageCircle } = icons;

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance
        .get(`${path.API + path.MESSAGES}/unread-count`)
        .json<MessageCountInfo>(),
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
            <Link href={`/${path.MESSAGES}`}>
              <div className="relative">
                <MessageCircle />
                {!!data.unreadCount && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
                    {data.unreadCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Messages</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          className="inline bg-card lg:hidden"
        >
          Messages
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
