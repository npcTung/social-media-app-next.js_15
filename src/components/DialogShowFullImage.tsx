import { Media } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogHeader,
} from "./ui";
import Image from "next/image";

interface DialogShowFullImageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachments: Media[];
}

export default function DialogShowFullImage({
  open,
  onOpenChange,
  attachments,
}: DialogShowFullImageProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-screen min-w-full flex-col items-center">
        <DialogHeader />
        <MediaPreviews attachments={attachments} />
      </DialogContent>
    </Dialog>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="relative h-full w-[95%] rounded-2xl"
    >
      <CarouselContent>
        {attachments.map((m) => (
          <CarouselItem key={m.id}>
            <MediaPreview media={m} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-muted text-white" />
      <CarouselNext className="bg-muted text-white" />
    </Carousel>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE")
    return (
      <Image
        src={media.url}
        alt="Attachment"
        className="mx-auto h-full w-[500px] rounded-2xl object-cover"
      />
    );

  return <span className="text-destructive">Unsupported media type.</span>;
}
