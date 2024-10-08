import { useToast } from "@/components";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { deleteMedia } from "./actions";

export interface Attachment {
  file: File;
  meidaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();

        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);
          if (!uploadResult) return a;

          return {
            ...a,
            meidaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        title: "Error",
        description: `${e.message}.`,
        duration: 3000,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Please wait for the curent upload finish.`,
        duration: 3000,
      });

      return;
    }

    if (attachments.length + files.length > 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You can only upload up to 5 attachments per post.`,
        duration: 3000,
      });

      return;
    }

    startUpload(files);
  }

  function removeAttachment({
    fileName,
    id,
  }: {
    fileName: string;
    id: string;
  }) {
    deleteMedia(id);
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
