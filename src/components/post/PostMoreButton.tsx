"use client";

import { PostData } from "@/lib/types";
import { useState } from "react";
import {
  Button,
  DeletePostDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useToast,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";

const { Ellipsis, Trash2, LinkIcon } = icons;

interface PostMoreButtonPros {
  post: PostData;
  className?: string;
  isEdit: boolean;
}

export default function PostMoreButton({
  post,
  className,
  isEdit,
}: PostMoreButtonPros) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  function handleCoppyLink() {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_CLIENT_URL + path.POSTS}/${post.id}`,
    );
    toast({
      variant: "default",
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
      duration: 3000,
      className: "bg-green-600 text-white border-green-600",
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <Ellipsis className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleCoppyLink}
          >
            <span className="flex items-center gap-3">
              <LinkIcon className="size-4" />
              Coppy link
            </span>
          </DropdownMenuItem>
          {isEdit && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-3 text-destructive">
                  <Trash2 className="size-4" />
                  Delete
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        post={post}
      />
    </>
  );
}
