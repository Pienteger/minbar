import { SignUpForm } from "@/components/auth/sign-up-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details to create your account</p>
      </div>
      <SignUpForm />
    </AuthLayout>
  )
}

