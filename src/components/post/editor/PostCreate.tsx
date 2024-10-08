"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  LoadingButton,
  UserAvatar,
} from "@/components";
import { useSession } from "@/app/(main)/SessionProvider";
import "./styles.css";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSubmitPostMutation } from "./mutations";
import Link from "next/link";
import path from "@/lib/path";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { ClipboardEvent, useRef } from "react";
import icons from "@/lib/icons";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";

const { ImageIcon, X, Loader2 } = icons;

export default function PostCreate() {
  const { user } = useSession();
  const { theme } = useTheme();
  const mutation = useSubmitPostMutation();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset: resetMediaUploads,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "What's crack-a-lackin'?" }),
    ],
    immediatelyRender: false,
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        conten: input,
        mediaIds: attachments.map((a) => a.meidaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];

    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-md">
      <div className="flex w-full gap-5">
        <Link href={`/${path.USER}/${user.userName}`}>
          <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        </Link>
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full max-w-[752px] overflow-y-auto rounded-2xl px-5 py-3",
              theme === "dark" ? "bg-background" : "bg-muted",
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AttachmentButton
          onFileSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: ({
    fileName,
    id,
  }: {
    fileName: string;
    id: string;
  }) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <Carousel
      opts={{ align: "start" }}
      className="w-full overflow-hidden rounded-2xl"
    >
      <CarouselContent>
        {attachments.map((m) => (
          <CarouselItem
            key={m.file.name}
            className={cn(
              attachments.length === 2 && "md:basis-1/2 lg:basis-1/2",
              attachments.length > 2 && "md:basis-1/2 lg:basis-1/3",
            )}
          >
            <AttachmentPreview
              key={m.file.name}
              attachment={m}
              onRemoveClick={() =>
                removeAttachment({
                  fileName: m.file.name,
                  id: m.meidaId as string,
                })
              }
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

interface AttachmentButtonProps {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
}

function AttachmentButton({ onFileSelected, disabled }: AttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        hidden
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-full max-h-[30rem] rounded-2xl object-cover"
        />
      ) : (
        <video
          controls
          className="size-full max-h-[30rem] rounded-2xl object-cover"
        >
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
