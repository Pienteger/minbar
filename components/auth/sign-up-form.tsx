"use client"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useEffect, useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {Checkbox} from "@/components/ui/checkbox"
import {Icons} from "@/components/icons"
import {useForm} from "react-hook-form"
import {useAuth} from "@/contexts/auth-context"

export function SignUpForm() {
    const router = useRouter()
    const {register: registerUser, isLoading, isAuthenticated} = useAuth()
    const [error, setError] = useState("")


    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/feed")
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || isAuthenticated) return null

    const registerSchema = z
        .object({
            name: z.string().min(1, "Full name is required"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
            confirmPassword: z.string().min(1, "Please confirm your password"),
            terms: z.boolean().refine((val) => val === true, {
                message: "You must accept the terms and conditions",
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })

    type RegisterForm = z.infer<typeof registerSchema>

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    })

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError("")
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            })
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed")
        }
    }

    return (
        <div className="grid gap-6 w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" {...register("name")} disabled={isLoading} required/>
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
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
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="new-password"
                            {...register("password")}
                            disabled={isLoading}
                            required
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
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
                        {errors.confirmPassword &&
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" {...register("terms")} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the Terms and Privacy Policy
                        </label>
                    </div>
                    {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                        Create Account
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isLoading}>
                    <Icons.google className="mr-2 h-4 w-4"/>
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                    <Icons.apple className="mr-2 h-4 w-4"/>
                    Apple
                </Button>
            </div>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    )
}

