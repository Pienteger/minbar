"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {
    getStoredToken,
    setStoredTokens,
    clearStoredTokens, isTokenExpired,
} from "@/lib/token-storage";
import {
    authApi,
    type LoginData,
    type RegisterData,
    type TokenResponse,
    type ForgotPasswordData,
    type ResetPasswordData,
} from "@/lib/apis/auth-api";
import {useToast} from "@/components/ui/use-toast";
import {useUserProfile} from "@/hooks/use-user-profile";

interface User {
    id: number;
    email: string;
    name: string;
    userName?: string;
    profilePictureUrl?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (data: ForgotPasswordData) => Promise<void>;
    resetPassword: (data: ResetPasswordData) => Promise<void>;
    updateProfilePicture: (file: File) => Promise<void>;
    profileLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const {toast} = useToast();

    const {
        data,
        loading: profileLoading,
        error,
        refetch: refetchProfile,
    } = useUserProfile();

    useEffect(() => {
        if (data?.me) {
            const {me} = data;
            setUser({
                id: me.id,
                email: me.email,
                name: me.name,
                userName: me.userName,
                profilePictureUrl:
                    me.displayImages?.[0]?.imageUrl ||
                    "/placeholder.svg?height=200&width=200",
            });
        }
    }, [data]);

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const token = getStoredToken();

                if (token?.accessToken && !isTokenExpired()) {
                    setIsAuthenticated(true);
                } else if (token?.refreshToken) {
                    const response = await authApi.refreshToken({refreshToken: token.refreshToken});
                    handleAuthResponse(response.data);
                    await refetchProfile();
                } else {
                    clearStoredTokens();
                    setIsAuthenticated(false);
                }
            } catch (e) {
                clearStoredTokens();
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };


        checkAuth();
    }, []);

    const handleAuthResponse = (response: TokenResponse) => {
        const {accessToken, refreshToken, expiresIn} = response;
        setStoredTokens({accessToken, refreshToken, expiresIn});
        setIsAuthenticated(true);
    };

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(data);
            handleAuthResponse(response.data);
            await refetchProfile();
            toast({title: "Login successful", description: "Welcome back!"});
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login failed",
                description: "Invalid email or password",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            await authApi.register(data);
            const loginResponse = await authApi.login({
                email: data.email,
                password: data.password,
            });
            handleAuthResponse(loginResponse.data);
            await refetchProfile();
            toast({
                title: "Registration successful",
                description: "Your account has been created",
            });
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                title: "Registration failed",
                description: "Please check your information and try again",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authApi.logout();
            clearStoredTokens();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/auth/sign-in");
            toast({
                title: "Logged out",
                description: "You have been successfully logged out",
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast({
                title: "Logout failed",
                description: "An error occurred during logout",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (data: ForgotPasswordData) => {
        try {
            setIsLoading(true);
            await authApi.forgotPassword(data);
            toast({
                title: "Password reset email sent",
                description: "Please check your email for instructions",
            });
        } catch (error) {
            console.error("Forgot password error:", error);
            toast({
                title: "Request failed",
                description: "Unable to send password reset email",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (data: ResetPasswordData) => {
        try {
            setIsLoading(true);
            await authApi.resetPassword(data);
            toast({
                title: "Password reset successful",
                description: "Your password has been updated",
            });
            router.push("/auth/sign-in");
        } catch (error) {
            console.error("Reset password error:", error);
            toast({
                title: "Password reset failed",
                description: "Invalid or expired reset code",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfilePicture = async (file: File) => {
        try {
            setIsLoading(true);
            if (!user) throw new Error("User not authenticated");
            await authApi.updateProfilePicture(user.id, file);
            setUser({
                ...user,
                profilePictureUrl: URL.createObjectURL(file),
            });
            toast({
                title: "Profile picture updated",
                description: "Your profile picture has been updated successfully",
            });
        } catch (error) {
            console.error("Update profile picture error:", error);
            toast({
                title: "Update failed",
                description: "Unable to update profile picture",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfilePicture,
        profileLoading
    };

    if (isLoading || profileLoading) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
