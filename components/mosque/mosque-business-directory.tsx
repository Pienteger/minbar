"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import type { MosqueRole, BusinessCategory } from "@/types/mosque"

interface MosqueBusinessDirectoryProps {
  mosqueId: string
  userRole?: MosqueRole
}

// Mock data for businesses
const mockBusinesses = [
  {
    id: "1",
    name: "Halal Delights Restaurant",
    description:
      "Authentic halal cuisine featuring dishes from across the Middle East and South Asia. Family-friendly atmosphere with private dining areas.",
    category: "food" as BusinessCategory,
    address: "123 Main Street, New York, NY",
    phone: "(555) 123-4567",
    email: "info@halaldelights.com",
    website: "www.halaldelights.com",
    isVerified: true,
    image: "/placeholder.svg?height=200&width=400&text=Halal+Delights",
    ownerName: "Ahmed Hassan",
  },
  {
    id: "2",
    name: "Barakah Bookstore",
    description:
      "Islamic books, Qurans, educational materials, and gifts. We offer a wide selection of literature for all ages in multiple languages.",
    category: "retail" as BusinessCategory,
    address: "456 Oak Avenue, New York, NY",
    phone: "(555) 987-6543",
    email: "contact@barakahbooks.com",
    website: "www.barakahbooks.com",
    isVerified: true,
    image: "/placeholder.svg?height=200&width=400&text=Barakah+Bookstore",
    ownerName: "Fatima Khan",
  },
  {
    id: "3",
    name: "Amanah Financial Services",
    description:
      "Shariah-compliant financial planning, investment advice, and insurance services. We help you manage your wealth according to Islamic principles.",
    category: "services" as BusinessCategory,
    address: "789 Maple Road, New York, NY",
    phone: "(555) 456-7890",
    email: "info@amanahfinancial.com",
    website: "www.amanahfinancial.com",
    isVerified: true,
    image: "/placeholder.svg?height=200&width=400&text=Amanah+Financial",
    ownerName: "Yusuf Ibrahim",
  },
  {
    id: "4",
    name: "Noor Islamic Education Center",
    description:
      "Quran classes, Arabic language courses, and Islamic studies for children and adults. We offer both in-person and online learning options.",
    category: "education" as BusinessCategory,
    address: "321 Pine Street, New York, NY",
    phone: "(555) 789-0123",
    email: "learn@nooreducation.com",
    website: "www.nooreducation.com",
    isVerified: false,
    image: "/placeholder.svg?height=200&width=400&text=Noor+Education",
    ownerName: "Mariam Ali",
  },
]

// Mock data for skills
const mockSkills = [
  {
    id: "1",
    title: "Arabic Language Tutoring",
    description:
      "Experienced Arabic teacher offering private lessons for all levels. Specializing in Quranic Arabic and Modern Standard Arabic.",
    category: "Education",
    rate: "$30/hour",
    availability: "Evenings and weekends",
    userName: "Omar Rahman",
    userAvatar: "/placeholder.svg?height=40&width=40&text=OR",
  },
  {
    id: "2",
    title: "Web Development Services",
    description:
      "Professional web developer offering website creation and maintenance services for small businesses and organizations.",
    category: "Technology",
    rate: "$50/hour",
    availability: "Weekdays",
    userName: "Aisha Malik",
    userAvatar: "/placeholder.svg?height=40&width=40&text=AM",
  },
  {
    id: "3",
    title: "Islamic Calligraphy",
    description:
      "Traditional Islamic calligraphy for home decor, gifts, and special occasions. Custom pieces available upon request.",
    category: "Art",
    rate: "Varies by project",
    availability: "Flexible",
    userName: "Hassan Ali",
    userAvatar: "/placeholder.svg?height=40&width=40&text=HA",
  },
  {
    id: "4",
    title: "Accounting & Tax Services",
    description:
      "Certified accountant offering bookkeeping, tax preparation, and financial advice for individuals and small businesses.",
    category: "Finance",
    rate: "$45/hour",
    availability: "By appointment",
    userName: "Layla Mahmoud",
    userAvatar: "/placeholder.svg?height=40&width=40&text=LM",
  },
]

export function MosqueBusinessDirectory({ mosqueId, userRole }: MosqueBusinessDirectoryProps) {
  const [activeTab, setActiveTab] = useState("businesses")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddBusinessDialogOpen, setIsAddBusinessDialogOpen] = useState(false)
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [businesses, setBusinesses] = useState(mockBusinesses)
  const [skills, setSkills] = useState(mockSkills)

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSkills = skills.filter(
    (skill) =>
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddBusiness = () => {
    // Simulate API call
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddBusinessDialogOpen(false)
      // In a real app, this would add the new business to the list
    }, 1000)
  }

  const handleAddSkill = () => {
    // Simulate API call
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddSkillDialogOpen(false)
      // In a real app, this would add the new skill to the list
    }, 1000)
  }

  const getBusinessCategoryBadge = (category: BusinessCategory) => {
    let color = ""
    let icon = null

    switch (category) {
      case "food":
        color = "bg-amber-500"
        icon = <Icons.pizza className="h-3 w-3 mr-1" />
        break
      case "retail":
        color = "bg-blue-500"
        icon = <Icons.shopping className="h-3 w-3 mr-1" />
        break
      case "services":
        color = "bg-green-500"
        icon = <Icons.settings className="h-3 w-3 mr-1" />
        break
      case "education":
        color = "bg-purple-500"
        icon = <Icons.graduationCap className="h-3 w-3 mr-1" />
        break
      default:
        color = "bg-gray-500"
        icon = <Icons.briefcase className="h-3 w-3 mr-1" />
    }

    return (
      <Badge className={`${color} text-white flex items-center`}>
        {icon}
        <span className="capitalize">{category}</span>
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold">Business & Skills Directory</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 rounded-full border-primary/20 w-full sm:w-64"
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={() => setIsAddBusinessDialogOpen(true)}
            >
              <Icons.briefcase className="mr-2 h-4 w-4" />
              Add Business
            </Button>

            <Button
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              onClick={() => setIsAddSkillDialogOpen(true)}
            >
              <Icons.tool className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="businesses"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Businesses
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Skills & Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="mt-6">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Icons.briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No businesses found</h3>
              <p className="text-muted-foreground">Be the first to add a business to the directory</p>
              <Button
                className="mt-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => setIsAddBusinessDialogOpen(true)}
              >
                Add Business
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="rounded-xl border-primary/20 overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={business.image || "/placeholder.svg?height=160&width=400"}
                      alt={business.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="font-bold text-lg">{business.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm">By {business.ownerName}</span>
                        {business.isVerified && (
                          <Badge className="ml-2 bg-green-500 text-white">
                            <Icons.check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {getBusinessCategoryBadge(business.category)}
                    </div>

                    <p className="text-sm line-clamp-3">{business.description}</p>

                    <div className="mt-3 space-y-1 text-sm">
                      {business.address && (
                        <div className="flex items-center text-muted-foreground">
                          <Icons.mapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{business.address}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Icons.phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center text-muted-foreground">
                          <Icons.globe className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{business.website}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" className="rounded-full border-primary/20">
                      <Icons.info className="mr-2 h-4 w-4" />
                      Details
                    </Button>

                    <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Icons.contact className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          {filteredSkills.length === 0 ? (
            <div className="text-center py-12">
              <Icons.tool className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No skills or services found</h3>
              <p className="text-muted-foreground">Be the first to add your skills to the directory</p>
              <Button
                className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                onClick={() => setIsAddSkillDialogOpen(true)}
              >
                Add Skill
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <Card key={skill.id} className="rounded-xl border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={skill.userAvatar || "/placeholder.svg"}
                          alt={skill.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.title}</h3>
                        <p className="text-xs text-muted-foreground">By {skill.userName}</p>
                      </div>
                    </div>

                    <Badge className="mb-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      {skill.category}
                    </Badge>

                    <p className="text-sm mb-3">{skill.description}</p>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Icons.dollar className="h-4 w-4 mr-1" />
                        <span>{skill.rate}</span>
                      </div>
                      <div className="flex items-center">
                        <Icons.clock className="h-4 w-4 mr-1" />
                        <span>{skill.availability}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 border-t border-primary/10 mt-3">
                    <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                      <Icons.contact className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Business Dialog */}
      <Dialog open={isAddBusinessDialogOpen} onOpenChange={setIsAddBusinessDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Add Business</DialogTitle>
            <DialogDescription>
              Add your business to the mosque directory. All submissions will be reviewed before being published.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="business-name" className="text-sm font-medium">
                Business Name
              </label>
              <Input id="business-name" placeholder="E.g., 'Halal Delights Restaurant'" className="border-primary/20" />
            </div>

            <div className="space-y-2">
              <label htmlFor="business-description" className="text-sm font-medium">
                Business Description
              </label>
              <Textarea
                id="business-description"
                placeholder="Describe your business..."
                className="resize-none border-primary/20 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="business-category" className="text-sm font-medium">
                  Category
                </label>
                <Select defaultValue="food">
                  <SelectTrigger id="business-category" className="border-primary/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Restaurant</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="services">Professional Services</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="business-phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input id="business-phone" placeholder="E.g., '(555) 123-4567'" className="border-primary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="business-address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="business-address"
                placeholder="E.g., '123 Main Street, New York, NY'"
                className="border-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="business-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="business-email"
                  type="email"
                  placeholder="E.g., 'info@example.com'"
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="business-website" className="text-sm font-medium">
                  Website
                </label>
                <Input id="business-website" placeholder="E.g., 'www.example.com'" className="border-primary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="business-image" className="text-sm font-medium">
                Business Image
              </label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Click to upload an image</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddBusinessDialogOpen(false)}
              className="rounded-full border-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBusiness}
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Business"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Add Skill or Service</DialogTitle>
            <DialogDescription>
              Share your skills or services with the mosque community. All submissions will be reviewed before being
              published.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="skill-title" className="text-sm font-medium">
                Title
              </label>
              <Input id="skill-title" placeholder="E.g., 'Arabic Language Tutoring'" className="border-primary/20" />
            </div>

            <div className="space-y-2">
              <label htmlFor="skill-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="skill-description"
                placeholder="Describe your skill or service..."
                className="resize-none border-primary/20 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="skill-category" className="text-sm font-medium">
                  Category
                </label>
                <Select defaultValue="Education">
                  <SelectTrigger id="skill-category" className="border-primary/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="skill-rate" className="text-sm font-medium">
                  Rate
                </label>
                <Input id="skill-rate" placeholder="E.g., '$30/hour' or 'Free'" className="border-primary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="skill-availability" className="text-sm font-medium">
                Availability
              </label>
              <Input
                id="skill-availability"
                placeholder="E.g., 'Evenings and weekends'"
                className="border-primary/20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSkillDialogOpen(false)}
              className="rounded-full border-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSkill}
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Skill"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

