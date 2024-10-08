"use client";

import path from "@/lib/path";
import Link from "next/link";
import {
  BookmarkButton,
  Carousel,
  CarouselContent,
  CarouselItem,
  Comments,
  DialogShowFullImage,
  LikeButton,
  Linkify,
  PostMoreButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserAvatar,
  UserTooltip,
} from "@/components";
import { cn, formatRelativeDate } from "@/lib/utils";
import React, { useState } from "react";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { Media } from "@prisma/client";
import Image from "next/image";
import icons from "@/lib/icons";

const { MessageSquare } = icons;

interface PostProps {
  post: PostData;
  className?: string;
}

export default function Post({ post, className }: PostProps) {
  const { user } = useSession();
  const [showFull, setShowFull] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <DialogShowFullImage
        open={showFullImage}
        attachments={post.attachments}
        onOpenChange={setShowFullImage}
      />
      <article
        className={cn(
          "group/post space-y-3 rounded-2xl bg-card p-5 shadow-md",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <UserTooltip user={post.user}>
              <Link href={`/${path.USER}/${post.user.userName}`}>
                <UserAvatar avatarUrl={post.user.avatarUrl} />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={post.user}>
                <Link
                  href={`/${path.USER}/${post.user.userName}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserTooltip>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href={`/${path.POSTS}/${post.id}`}
                      className="block text-sm text-muted-foreground transition-all hover:underline"
                      suppressHydrationWarning
                    >
                      {formatRelativeDate(post.createdAt)}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    {formatDate(post.createdAt, "EEEE, d MMMM, yyyy, HH:mm", {
                      locale: vi,
                    })}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <PostMoreButton isEdit={post.user.id === user.id} post={post} />
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">
            {post.content.split(" ").length > 50
              ? showFull
                ? post.content
                : `${post.content.split(" ").slice(0, 50).join(" ")}...`
              : post.content}
          </div>
          {post.content.split(" ").length > 50 && !showFull && (
            <span
              onClick={() => setShowFull(!showFull)}
              className="cursor-pointer text-primary transition-all hover:underline"
            >
              {!showFull && " Xem thêm"}
            </span>
          )}
        </Linkify>
        {!!post.attachments.length && (
          <MediaPreviews
            attachments={post.attachments}
            onChangeOpen={() => setShowFullImage(true)}
          />
        )}
        <hr className="text-muted-foreground" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikeByUser: post.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />
            <CommentButton
              post={post}
              onClick={() => setShowComments(!showComments)}
            />
          </div>
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedUser: post.bookmarks.some(
                (bookmark) => bookmark.userId === user.id,
              ),
            }}
          />
        </div>
        {showComments && (
          <>
            <hr className="text-muted-foreground" />
            <Comments post={post} />
          </>
        )}
      </article>
    </>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
  onChangeOpen: () => void;
}

function MediaPreviews({ attachments, onChangeOpen }: MediaPreviewsProps) {
  return (
    <Carousel
      opts={{ align: "start" }}
      className="w-full overflow-hidden rounded-2xl"
    >
      <CarouselContent>
        {attachments.map((m) => (
          <CarouselItem
            key={m.id}
            className={cn(
              attachments.length === 2 && "md:basis-1/2 lg:basis-1/2",
              attachments.length > 2 && "md:basis-1/2 lg:basis-1/3",
            )}
          >
            <MediaPreview media={m} handelShowFullImage={onChangeOpen} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

interface MediaPreviewProps {
  media: Media;
  handelShowFullImage: () => void;
}

function MediaPreview({ media, handelShowFullImage }: MediaPreviewProps) {
  if (media.type === "IMAGE")
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-full max-h-[30rem] rounded-2xl object-cover"
        onClick={handelShowFullImage}
      />
    );
  if (media.type === "VIDEO")
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-full max-h-[30rem] rounded-2xl"
        />
      </div>
    );

  return <span className="text-destructive">Unsupported media type.</span>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
