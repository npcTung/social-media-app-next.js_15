"use client";

import { PostsPage } from "@/lib/types";
import { useToast } from "../ui";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import path from "@/lib/path";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        variant: "default",
        title: "Success",
        description: "Your post has been successfully deleted.",
        duration: 3000,
        className: "bg-green-600 text-white border-green-600",
      });

      if (pathname === `/${path.POSTS}/${deletedPost.id}`)
        router.push(`/${path.USER}/${deletedPost.user.userName}`);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again.",
        duration: 3000,
      });
    },
  });

  return mutation;
}
