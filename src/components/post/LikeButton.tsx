import { LikeInfo } from "@/lib/types";
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

const { Heart } = icons;

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`${path.API + path.POSTS}/${postId}${path.LIKES}`)
        .json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isLikeByUser
        ? kyInstance.delete(`${path.API + path.POSTS}/${postId}${path.LIKES}`)
        : kyInstance.post(`${path.API + path.POSTS}/${postId}${path.LIKES}`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikeByUser ? -1 : 1),
        isLikeByUser: !previousState?.isLikeByUser,
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
      <Heart
        className={cn(
          "size-5",
          data?.isLikeByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data?.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
