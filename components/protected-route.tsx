"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return children;
}
