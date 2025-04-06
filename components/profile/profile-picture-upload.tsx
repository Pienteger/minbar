"use client";

import type React from "react";
import {useRef, useState} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Camera, Upload, X} from "lucide-react";
import {useAuth} from "@/contexts/auth-context";
import {Icons} from "@/components/icons";
import {imageApi, UploadImageRequest} from "@/lib/apis/image-api";
import {DisplayImageType} from "@/types/display-image-type";
import {EntityType} from "@/types/entity-type";

export function ProfilePictureUpload() {
    const {user, refetchProfile, isLoading} = useAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should not exceed 5MB");
            return;
        }

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const handleUpload = async () => {
        if (!fileInputRef.current?.files?.[0]) return;

        try {
            const request = {
                displayImageType: DisplayImageType.Profile,
                entityType: EntityType.ApplicationUser,
                entityId: user?.id || 0,
                imageFiles: [fileInputRef.current.files[0]],
            } as UploadImageRequest;

            // await updateProfilePicture(fileInputRef.current.files[0]);
            const response = await imageApi.uploadPhoto(request);

            if (response.status !== 201) {
                throw new Error("Failed to upload image");
            }

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Clear the preview
            setPreviewUrl(null);
            await refetchProfile();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    const handleCancel = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-muted">
                            {previewUrl || user?.profilePictureUrl ? (
                                <Image
                                    src={previewUrl || user?.profilePictureUrl || ""}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                    <Icons.user className="h-16 w-16 text-primary/40"/>
                                </div>
                            )}
                        </div>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                            onClick={triggerFileInput}
                        >
                            <Camera className="h-4 w-4"/>
                        </Button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {previewUrl && (
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleUpload}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                )}
                                <Upload className="h-4 w-4 mr-2"/>
                                Upload
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2"/>
                                Cancel
                            </Button>
                        </div>
                    )}

                    {!previewUrl && (
                        <Button
                            variant="outline"
                            className="mt-2"
                            onClick={triggerFileInput}
                        >
                            <Upload className="h-4 w-4 mr-2"/>
                            Change Profile Picture
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
