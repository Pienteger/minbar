import axios from "axios";
import {
    getStoredToken,
    setStoredTokens,
    clearStoredTokens,
} from "@/lib/token-storage";

const BASE_URL = "https://localhost:7215";

export const restClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Flag and queue for token refresh
let isRefreshing = false;

type TokenQueueItem = {
    resolve: (token: string | null) => void;
    reject: (err?: any) => void;
};

let failedQueue: TokenQueueItem[] = [];


const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// Request interceptor
restClient.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token?.accessToken) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
restClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const token = getStoredToken();
            if (!token?.refreshToken) {
                clearStoredTokens();
                window.location.href = "/auth/sign-in";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string | null) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(restClient(originalRequest));
                        },
                        reject: (err) => {
                            reject(err);
                        },
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(`${BASE_URL}/account/refresh`, {
                    refreshToken: token.refreshToken,
                });

                const {accessToken, refreshToken, expiresIn} = res.data;
                setStoredTokens({accessToken, refreshToken, expiresIn});
                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return restClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearStoredTokens();
                window.location.href = "/auth/sign-in";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

