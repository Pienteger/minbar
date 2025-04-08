import {restClient} from "../rest-client";
import {DisplayImageType} from "@/types/display-image-type";
import {ServiceResponse} from "@/blueprints/ServiceResponse";

export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
}

export interface TokenResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    resetCode: string;
    newPassword: string;
}

export interface RefreshTokenData {
    refreshToken: string;
}

export interface UpdateApplicationUserDisplayPictureCommand {
    DisplayPicture: File;
    ImageType: DisplayImageType;
}

export interface PublishSocialPostCommand {
    ImageFiles?: File[],
    Content?: string,
    SocialPostVisibility: string,
}

export const authApi = {
    register: (data: RegisterData) =>
        restClient.post<void>("/Identity/RegisterUser", data),

    login: (data: LoginData) => restClient.post<TokenResponse>("/account/login", data),

    logout: () => restClient.post<void>("/Identity/logout", {}),

    forgotPassword: (data: ForgotPasswordData) =>
        restClient.post<void>("/account/forgotPassword", data),

    resetPassword: (data: ResetPasswordData) =>
        restClient.post<void>("/account/resetPassword", data),

    refreshToken: (data: RefreshTokenData) =>
        restClient.post<TokenResponse>("/account/refresh", data),

    updateDisplayPicture: (command: UpdateApplicationUserDisplayPictureCommand) => {
        const formData = new FormData();
        formData.append("DisplayPicture", command.DisplayPicture);
        formData.append("ImageType", command.ImageType);

        return restClient.post<ServiceResponse>(
            `/identity/UpdateApplicationUserDisplayPicture`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            }
        );
    },

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

        return restClient.post<ServiceResponse>(`/identity/PublishSocialPost`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true
        })
    }
};
