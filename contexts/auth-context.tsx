"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStoredToken,
  setStoredTokens,
  clearStoredTokens,
} from "@/lib/token-storage";
import {
  authApi,
  LoginData,
  RegisterData,
  TokenResponse,
} from "@/lib/apis/auth-api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: null | { email: string };
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setIsAuthenticated(true);
      // In a real app, you'd want to fetch the user profile here
      setUser({ email: "user@example.com" });
    }
  }, []);

  const handleAuthResponse = (response: TokenResponse) => {
    const { accessToken, refreshToken } = response;
    setStoredTokens({ accessToken, refreshToken });
    setIsAuthenticated(true);
    // In a real app, you'd want to fetch the user profile here
    setUser({ email: "user@example.com" });
  };

  const login = async (data: LoginData) => {
    try {
      const response = await authApi.login(data);
      handleAuthResponse(response.data);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await authApi.register(data);
      const loginResponse = await authApi.login({
        email: data.email,
        password: data.password,
      });
      handleAuthResponse(loginResponse.data);
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout({});
      clearStoredTokens();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
