"use client";

import type React from "react";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/auth-context";

export function ProtectedRoute({children}: { children: React.ReactNode }) {
    const {isAuthenticated, isLoading: authLoading} = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only redirect if authentication check is complete and user is not authenticated
        if (!authLoading && !isAuthenticated) {
            console.log("Not authenticated, redirecting to login")
            router.push("/auth/sign-in")
        } else if (!authLoading) {
            // Authentication check is complete and user is authenticated
            console.log("Authentication confirmed, rendering protected content")
            setIsLoading(false)
        }
    }, [isAuthenticated, authLoading, router])

    if (isLoading || !isAuthenticated) {
        return null;
    }

    return children;
}
