"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  aspectRatio?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({
  onImageSelected,
  aspectRatio = "1:1",
  maxSize = 5,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Clear any previous errors
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Clear any previous errors
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onImageSelected(file);
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected(null as unknown as File);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Calculate aspect ratio styles
  let aspectRatioStyle = {};
  if (aspectRatio) {
    const [width, height] = aspectRatio.split(":").map(Number);
    aspectRatioStyle = {
      aspectRatio: `${width} / ${height}`,
    };
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!preview ? (
        <div
          className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors h-full"
          style={aspectRatioStyle}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Click or drag to upload an image
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {maxSize}MB
          </p>
        </div>
      ) : (
        <div
          className="relative rounded-lg overflow-hidden h-full"
          style={aspectRatioStyle}
        >
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
