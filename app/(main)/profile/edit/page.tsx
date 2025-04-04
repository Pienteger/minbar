import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProfilePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ProfilePictureUpload />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile editing form will be implemented here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
