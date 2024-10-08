import { BookmarkInfo } from "@/lib/types";
import { useToast } from "../ui";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";

const { Bookmark } = icons;

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`${path.API + path.POSTS}/${postId}/${path.BOOKMARKS}`)
        .json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isBookmarkedUser
        ? kyInstance.delete(
            `${path.API + path.POSTS}/${postId}/${path.BOOKMARKS}`,
          )
        : kyInstance.post(
            `${path.API + path.POSTS}/${postId}/${path.BOOKMARKS}`,
          ),
    onMutate: async () => {
      toast({
        variant: "default",
        title: "Bookmarked",
        description: `Post ${data.isBookmarkedUser ? "un" : ""}bookmarked.`,
        duration: 3000,
        className: "bg-green-600 text-white border-green-600",
      });
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedUser: !previousState?.isBookmarkedUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to follow user. Please try again.",
        duration: 3000,
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data?.isBookmarkedUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
