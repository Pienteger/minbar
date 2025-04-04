"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {
    getStoredToken,
    setStoredTokens,
    clearStoredTokens,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const {toast} = useToast();

    const {data, loading: profileLoading, error} = useUserProfile();

    useEffect(() => {
        if (data?.me) {
            const {me} = data;
            setUser({
                id: me.id,
                email: me.email,
                name: me.name,
                profilePictureUrl:
                    me.displayImages?.[0]?.imageUrl || "/placeholder.svg?height=200&width=200",
            });
            console.log(typeof me, me);
            setIsAuthenticated(true);
        }
    }, [data]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getStoredToken()
                if (token) {
                    console.log("Found stored token, setting authenticated state")
                    setIsAuthenticated(true)
                    // In a real app, you'd want to fetch the user profile here
                    // await fetchUserProfile()
                } else {
                    console.log("No stored token found")
                }
            } catch (error) {
                console.error("Auth initialization error:", error)
                clearStoredTokens()
                setIsAuthenticated(false)
                setUser(null)
            } finally {
                console.log("Auth initialization complete, setting isLoading to false")
                setIsLoading(false)
            }
        }

        checkAuth()
    }, []);

    // const fetchUserProfile = async () => {
    //     try {
    //         // This would be a real API call in production
    //         // For now, we'll use mock data
    //         // setUser({
    //         //     id: 1,
    //         //     email: "user@example.com",
    //         //     name: "John Doe",
    //         //     profilePictureUrl: "/placeholder.svg?height=200&width=200",
    //         // });
    //
    //         const GET_USER_GRAPH_QUERY = gql`
    //             query Me {
    //                 user {
    //                     displayImages(types: PROFILE) {
    //                         displayImageType
    //                         imageUrl
    //                     }
    //                     name
    //                     id
    //                     email
    //                 }
    //             }
    //         `;
    //
    //         const {loading, error, data, fetchMore} = useQuery(GET_USER_GRAPH_QUERY, {
    //             notifyOnNetworkStatusChange: true,
    //             fetchPolicy: "cache-first", // cache-first is the default
    //         });
    //
    //         alert(data);
    //
    //         if (data && data.user) {
    //             const {user} = data;
    //             setUser({
    //                 id: user.id,
    //                 email: user.email,
    //                 name: user.name,
    //                 profilePictureUrl:
    //                     user.displayImages?.[0]?.imageUrl || "/placeholder.svg?height=200&width=200",
    //             });
    //         } else {
    //             console.error("No user data found");
    //         }
    //
    //     } catch (error) {
    //         console.error("Error fetching user profile:", error);
    //         throw error;
    //     }
    // };

    const handleAuthResponse = (response: TokenResponse) => {
        const {accessToken, refreshToken} = response;
        setStoredTokens({accessToken, refreshToken});
        setIsAuthenticated(true);
    };

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(data);
            handleAuthResponse(response.data);
            //await fetchUserProfile();
            router.push("/feed");
            toast({
                title: "Login successful",
                description: "Welcome back!",
            });
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
            //await fetchUserProfile();
            router.push("/feed");
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
            // Update the user profile with the new picture URL
            // In a real app, you'd want to fetch the updated user profile
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
