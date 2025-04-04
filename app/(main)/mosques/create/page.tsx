import CreateMosqueForm from "@/components/mosque/create-mosque-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Mosque | Social Connect",
  description: "Create a new mosque in the Social Connect platform",
}

export default function CreateMosquePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Mosque</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new mosque in the community</p>
      </div>
      <CreateMosqueForm />
    </div>
  )
}

