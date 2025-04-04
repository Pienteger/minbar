"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/auth-context";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const [error, setError] = useState("");

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const resetPasswordSchema = z
    .object({
      email: z.string().email("Invalid email address"),
      resetCode: z.string().min(1, "Reset code is required"),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      resetCode: code,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (email) setValue("email", email);
    if (code) setValue("resetCode", code);
  }, [email, code, setValue]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setError("");
      await resetPassword({
        email: data.email,
        resetCode: data.resetCode,
        newPassword: data.newPassword,
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  };

  return (
    <div className="grid gap-6 w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...register("email")}
              disabled={!!email || isLoading}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resetCode">Reset Code</Label>
            <Input
              id="resetCode"
              placeholder="Enter your reset code"
              {...register("resetCode")}
              disabled={!!code || isLoading}
              required
            />
            {errors.resetCode && (
              <p className="text-sm text-red-500">{errors.resetCode.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              {...register("newPassword")}
              disabled={isLoading}
              required
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              {...register("confirmPassword")}
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}
