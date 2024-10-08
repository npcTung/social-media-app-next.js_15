import { UpdateUserProfileValues } from "@/lib/validation";
import { useToast } from "@/components";
import { useUploadThing } from "@/lib/uploadthing";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostsPage } from "@/lib/types";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updateUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
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
              posts: page.posts.map((post) => {
                if (post.user.id === updateUser.id)
                  return {
                    ...post,
                    user: {
                      ...updateUser,
                      avatarUrl: newAvatarUrl || updateUser.avatarUrl,
                    },
                  };

                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast({
        variant: "default",
        title: "Success",
        description: "Your update profile has been successfully deleted.",
        duration: 3000,
        className: "bg-green-600 text-white border-green-600",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to updete profile. Please try again.",
        duration: 3000,
      });
    },
  });

  return mutation;
}
