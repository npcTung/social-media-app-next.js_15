import { UserAvatar } from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import Link from "next/link";

const { User2, MessageCircle, Heart } = icons;

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; herf: string }
  > = {
    FOLLOW: {
      message: `${notification.isSuer.displayName} followed you.`,
      icon: <User2 className="size-7 text-primary" />,
      herf: `/${path.USER}/${notification.isSuer.userName}`,
    },
    COMMENT: {
      message: `${notification.isSuer.displayName} commented on your post.`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      herf: `/${path.POSTS}/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.isSuer.displayName} liked your post.`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      herf: `/${path.POSTS}/${notification.postId}`,
    },
  };

  const { message, icon, herf } = notificationTypeMap[notification.type];

  return (
    <Link href={herf} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-md transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.isSuer.avatarUrl} size={36} />
          <div className="flex gap-1">
            <span className="font-bold">
              {`${notification.isSuer.displayName}:`}
            </span>
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
