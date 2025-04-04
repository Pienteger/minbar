"use client"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useAuth } from "@/contexts/auth-context"

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
  })

  type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError("")
      await forgotPassword(data)
      setIsSubmitted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send reset email")
    }
  }

  return (
    <div className="grid gap-6 w-full">
      {isSubmitted ? (
        <div className="space-y-4">
          <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>
              If an account exists with that email, we&apos;ve sent a password reset link.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Return to Sign In</Link>
          </Button>
        </div>
      ) : (
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
                disabled={isLoading}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
            <Button variant="ghost" type="button" disabled={isLoading} asChild className="mt-2">
              <Link href="/auth/sign-in">Back to Sign In</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

