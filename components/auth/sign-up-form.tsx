"use client"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useState} from "react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import { Controller } from "react-hook-form";
import {Checkbox} from "@/components/ui/checkbox"
import {Icons} from "@/components/icons"
import {useForm} from "react-hook-form"
import {useAuth} from "@/contexts/auth-context"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Eye, EyeOff, Radio} from "lucide-react";

export function SignUpForm() {
    const {register: registerUser, isLoading} = useAuth()
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const registerSchema = z
        .object({
            name: z.string().min(1, "Full name is required"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
            confirmPassword: z.string().min(1, "Please confirm your password"),
            gender: z.enum(["Male", "Female"], {
                required_error: "Gender is required",
                invalid_type_error: "Gender must be either Male or Female",
            }),
            terms: z.boolean().refine((val) => val, {
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
        setValue,
        watch,
        control,
        formState: {errors},
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "Male",
            terms: false,
        },
    });

    const gender = watch("gender");

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError("")
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                gender: "Male",
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
                        <Label htmlFor="gender">Gender</Label>
                        <RadioGroup
                            value={gender}
                            onValueChange={(val) => setValue("gender", val as "Male" | "Female", { shouldValidate: true })}
                                    className="flex justify-start items-center gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Male" id="r1"/>
                                <Label htmlFor="r1">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Female" id="r2"/>
                                <Label htmlFor="r2">Female</Label>
                            </div>
                        </RadioGroup>
                        {errors.gender && (
                            <p className="text-sm text-red-500">{errors.gender.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                {...register("password")}
                                disabled={isLoading}
                                required
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4"/>
                                ) : (
                                    <Eye className="h-4 w-4"/>
                                )}
                                <span className="sr-only">Toggle password visibility</span>
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                {...register("confirmPassword")}
                                disabled={isLoading}
                                required
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4"/>
                                ) : (
                                    <Eye className="h-4 w-4"/>
                                )}
                                <span className="sr-only">Toggle password visibility</span>
                            </Button>
                        </div>
                        {errors.confirmPassword &&
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Controller
                            name="terms"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="terms"
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(!!checked)}
                                />
                            )}
                        />
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
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    )
}

