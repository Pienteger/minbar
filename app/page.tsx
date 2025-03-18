import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check if user is authenticated
  // If not, redirect to sign-in page
  const isAuthenticated = false

  if (!isAuthenticated) {
    redirect("/auth/sign-in")
  }

  // If authenticated, redirect to feed
  redirect("/feed")
}

