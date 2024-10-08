"use client";

import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui";
import "cropperjs/dist/cropper.css";

interface CropImageDialogProps {
  src: string;
  cropAspacetRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export default function CropImageDialog({
  src,
  cropAspacetRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) {
  const croppRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = croppRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blod) => onCropped(blod), "image/webp");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspacetRatio}
          guides={false}
          zoomable={false}
          ref={croppRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant={"secondary"} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
