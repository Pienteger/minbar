import { api } from "../api";

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

export const authApi = {
  register: (data: RegisterData) =>
    api.post<void>("/Identity/RegisterUser", data),

  login: (data: LoginData) => api.post<TokenResponse>("/account/login", data),

  logout: () => api.post<void>("/Identity/logout", {}),

  forgotPassword: (data: ForgotPasswordData) =>
    api.post<void>("/account/forgotPassword", data),

  resetPassword: (data: ResetPasswordData) =>
    api.post<void>("/account/resetPassword", data),

  refreshToken: (data: RefreshTokenData) =>
    api.post<TokenResponse>("/account/refresh", data),

  updateProfilePicture: (userId: number, profilePicture: File) => {
    const formData = new FormData();
    formData.append("ProfilePicture", profilePicture);

    return api.post<void>(
      `/Identity/UpdateProfilePicture?ApplicationUserId=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
