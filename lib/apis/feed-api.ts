import {restClient} from "@/lib/rest-client";
import {ServiceResponse} from "@/blueprints/ServiceResponse";

export interface PublishSocialPostCommand {
    ImageFiles?: File[],
    Content?: string,
    SocialPostVisibility: string,
}


export const feedApi = {
    publishSocialPost: (command: PublishSocialPostCommand) => {

        if (!command.SocialPostVisibility) {
            throw new Error("SocialPostVisibility is required");
        }

        if (command.ImageFiles && !Array.isArray(command.ImageFiles)) {
            throw new Error("ImageFiles should be an array");
        }

        if (command.Content && typeof command.Content !== "string") {
            throw new Error("Content should be a string");
        }

        if (command.ImageFiles && command.ImageFiles.length > 5) {
            throw new Error("You can only upload a maximum of 5 images");
        }

        if (command.ImageFiles && command.ImageFiles.some(file => file.size > 5 * 1024 * 1024)) {
            throw new Error("Each image file must be less than 5MB");
        }

        if (command.Content && command.Content.length > 5000) {
            throw new Error("Content length exceeds the maximum limit of 5000 characters");
        }

        // Content and images both cannot be empty
        if (!command.Content && !command.ImageFiles) {
            throw new Error("Either Content or ImageFiles must be provided");
        }

        const formData = new FormData();

        if (command.ImageFiles) {
            command.ImageFiles.forEach((file, index) => {
                formData.append(`ImageFiles[${index}]`, file);
            });
        }

        formData.append("SocialPostVisibility", command.SocialPostVisibility);
        if (command.Content) {
            formData.append("Content", command.Content);
        }

        return restClient.post<ServiceResponse>(`/feed/PublishSocialPost`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true
        })
    }
};