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


};
