import { CommentData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "@/components";
import Link from "next/link";
import path from "@/lib/path";
import { formatDate } from "date-fns";
import { formatRelativeDate } from "@/lib/utils";
import { vi } from "date-fns/locale";
import { useSession } from "@/app/(main)/SessionProvider";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  return (
    <div className="group/comment flex w-full gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/${path.USER}/${comment.user.userName}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1">
          <UserTooltip user={comment.user}>
            <Link
              href={`/${path.USER}/${comment.user.userName}`}
              className="text-md font-semibold"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <small className="cursor-default text-xs opacity-50">
                  {formatRelativeDate(comment.createdAt)}
                </small>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                {formatDate(comment.createdAt, "EEEE, d MMMM, yyyy, HH:mm", {
                  locale: vi,
                })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton comment={comment} className="ms-auto" />
      )}
    </div>
  );
}
