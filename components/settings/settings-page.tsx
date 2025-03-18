"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  // Mock user data
  const userData = {
    name: "Mahmudul Hasan",
    username: "mahmudx",
    email: "mahmudx@example.com",
    bio: "Photographer, traveler, and coffee enthusiast. Always looking for the next adventure!",
    location: "Mirpur 12, Dhaka, Bangladesh",
    website: "mahmudx.com",
    phone: "+880 123 456 7890",
    avatar: "/me.jpg?height=100&width=100",
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate saving profile
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleSavePreferences = () => {
    setIsLoading(true)

    // Simulate saving preferences
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="account"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="rounded-xl border-primary/20">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="rounded-full border-primary/20">
                    <Icons.camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} className="border-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={userData.username} className="border-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userData.email} className="border-primary/20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" defaultValue={userData.bio} className="border-primary/20 resize-none" rows={3} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={userData.location} className="border-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={userData.website} className="border-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={userData.phone} className="border-primary/20" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl border-primary/20">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="border-primary/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="border-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="border-primary/20" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="rounded-full border-primary/20 mr-2">
                Cancel
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                Update Password
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl border-primary/20 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all of your content
                  </p>
                </div>
                <Button variant="destructive" className="rounded-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-xl border-primary/20">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Color Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme" className="w-full border-primary/20">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/20">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`rounded-xl border-2 ${theme === "light" ? "border-primary" : "border-primary/20"} cursor-pointer`}
                  onClick={() => setTheme("light")}
                >
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="h-24 w-full bg-[#FFFFFF] rounded-lg mb-2 flex items-center justify-center">
                      <Icons.sun className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="font-medium">Light</p>
                  </CardContent>
                </Card>

                <Card
                  className={`rounded-xl border-2 ${theme === "dark" ? "border-primary" : "border-primary/20"} cursor-pointer`}
                  onClick={() => setTheme("dark")}
                >
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="h-24 w-full bg-[#1F1F1F] rounded-lg mb-2 flex items-center justify-center">
                      <Icons.moon className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="font-medium">Dark</p>
                  </CardContent>
                </Card>

                <Card
                  className={`rounded-xl border-2 ${theme === "system" ? "border-primary" : "border-primary/20"} cursor-pointer`}
                  onClick={() => setTheme("system")}
                >
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="h-24 w-full bg-gradient-to-r from-[#FFFFFF] to-[#1F1F1F] rounded-lg mb-2 flex items-center justify-center">
                      <Icons.laptop className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="font-medium">System</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-primary/20">
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize how content is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch id="reduced-motion" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch id="high-contrast" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size" className="w-full border-primary/20">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/20">
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl border-primary/20">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-comments">Comments</Label>
                    <p className="text-sm text-muted-foreground">Receive emails when someone comments on your posts</p>
                  </div>
                  <Switch id="email-comments" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-likes">Likes</Label>
                    <p className="text-sm text-muted-foreground">Receive emails when someone likes your posts</p>
                  </div>
                  <Switch id="email-likes" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-follows">New Followers</Label>
                    <p className="text-sm text-muted-foreground">Receive emails when someone follows you</p>
                  </div>
                  <Switch id="email-follows" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-messages">Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Receive emails for new direct messages</p>
                  </div>
                  <Switch id="email-messages" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Push Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-all">All Activity</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications for all activity</p>
                  </div>
                  <Switch id="push-all" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-mentions">Mentions</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications when you're mentioned</p>
                  </div>
                  <Switch id="push-mentions" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-messages">Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications for new direct messages</p>
                  </div>
                  <Switch id="push-messages" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

