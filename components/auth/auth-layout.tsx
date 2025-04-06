"use client"
import type React from "react"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Logo} from "@/components/logo"
import Link from "next/link"
import {useEffect} from "react"
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/auth-context";
import {usePathname} from 'next/navigation';

interface AuthLayoutProps {
    children: React.ReactNode
}

export function AuthLayout({children}: AuthLayoutProps) {

    const router = useRouter();
    const {isAuthenticated, isLoading, user, profileLoading} = useAuth();

    useEffect(() => {
        if (!isLoading && !profileLoading && isAuthenticated && user) {
            router.push("/feed");
        }
    }, [isAuthenticated, isLoading, profileLoading, user, router]);

    if (isLoading || (isAuthenticated && user)) return null;

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-6">
                        <Logo className="h-10"/>
                        {children}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

