import axios from "axios";
import {
  getStoredToken,
  setStoredTokens,
  clearStoredTokens,
} from "@/lib/token-storage";
import { QueryRecordResponse } from "../blueprints/QueryRecordResponse";

const BASE_URL = "https://localhost:7102";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = getStoredToken();
        if (!token?.refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${BASE_URL}/account/refresh`, {
          refreshToken: token.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;
        setStoredTokens({ accessToken, refreshToken });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        clearStoredTokens();
        window.location.href = "/auth/sign-in";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export interface IdentityDto {
  fullName: string;
  userName: string;
  email: string;
  profilePictureUrl: string;
}

export const userApi = {
  identity: () => api.get<QueryRecordResponse<IdentityDto>>("/identity/get"),
};
