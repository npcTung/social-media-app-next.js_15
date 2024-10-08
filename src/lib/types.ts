import { Prisma } from "@prisma/client";

// function
export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    userName: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    gender: true,
    followers: {
      where: { followerId: loggedInUserId },
      select: { followerId: true },
    },
    _count: { select: { followers: true, posts: true } },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: { select: getUserDataSelect(loggedInUserId) },
    attachments: true,
    likes: {
      where: { userId: loggedInUserId },
      select: { userId: true },
    },
    bookmarks: {
      where: { userId: loggedInUserId },
      select: { userId: true },
    },
    _count: { select: { likes: true, comments: true } },
  } satisfies Prisma.PostInclude;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: { select: getUserDataSelect(loggedInUserId) },
  } satisfies Prisma.CommentInclude;
}

// const
export const notificationsInclude = {
  isSuer: {
    select: {
      userName: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: { select: { content: true } },
} satisfies Prisma.NotificationInclude;

// type
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

// interface
export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikeByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedUser: boolean;
}

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}
