import { validateRequest } from "@/auth";
import { Button, Tooltip, TooltipContent, TooltipProvider } from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import prisma from "@/lib/prisma";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import MessagesButton from "./MessagesButton";
import streamSeverClient from "@/lib/stream";

const { Home, Bookmark } = icons;

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadNotificationCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: { recipientId: user.id, read: false },
    }),
    (await streamSeverClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              className="flex items-center justify-start lg:gap-3"
              asChild
            >
              <Link href={path.HOME}>
                <Home />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            className="inline bg-card lg:hidden"
          >
            Home
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              className="flex items-center justify-start lg:gap-3"
              asChild
            >
              <Link href={`/${path.BOOKMARKS}`}>
                <Bookmark />
                <span className="hidden lg:inline">Bookmarks</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            className="inline bg-card lg:hidden"
          >
            Bookmarks
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
