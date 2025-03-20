import { api } from "../api";

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const authApi = {
  register: (data: RegisterData) =>
    api.post<void>("/account/registerUser", data),

  login: (data: LoginData) => api.post<TokenResponse>("/account/login", data),

  logout: (data: {}) => api.post<void>("/account/logout", data),
};
