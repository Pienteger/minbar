"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import type {
  MosqueRole,
  EventType,
  FundraisingCategory,
} from "@/types/mosque";

interface MosqueEventsProps {
  mosqueId: string;
  userRole?: MosqueRole;
}

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Friday Khutbah: The Importance of Gratitude",
    description:
      "Join us for this week's Friday sermon focusing on the importance of gratitude in Islam and how it affects our daily lives.",
    type: "khutbah" as EventType,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60), // 2 days + 1 hour from now
    location: "Main Prayer Hall",
    image: "/placeholder.svg?height=200&width=400&text=Khutbah",
    isOnline: false,
    attendees: 0,
    organizer: "Imam Abdullah",
  },
  {
    id: "2",
    title: "Community Iftar Dinner",
    description:
      "Join us for a community iftar dinner to break fast together during Ramadan. All are welcome! Please bring a dish to share if possible.",
    type: "iftar" as EventType,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    endDate: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 60 * 3
    ), // 5 days + 3 hours from now
    location: "Community Hall",
    image: "/placeholder.svg?height=200&width=400&text=Iftar",
    isOnline: false,
    attendees: 45,
    organizer: "Community Committee",
  },
  {
    id: "3",
    title: "Islamic Finance Workshop",
    description:
      "Learn about Islamic finance principles, halal investments, and how to manage your finances according to Shariah guidelines.",
    type: "lecture" as EventType,
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    endDate: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2
    ), // 7 days + 2 hours from now
    location: "Classroom 2",
    image: "/placeholder.svg?height=200&width=400&text=Finance+Workshop",
    isOnline: true,
    onlineLink: "https://zoom.us/j/123456789",
    attendees: 28,
    organizer: "Dr. Yusuf Khan",
  },
];

// Mock data for fundraising campaigns
const mockFundraisers = [
  {
    id: "1",
    title: "Mosque Renovation Fund",
    description:
      "Help us renovate the mosque's facilities including the wudu area, carpeting, and sound system to better serve our growing community.",
    category: "renovation" as FundraisingCategory,
    targetAmount: 50000,
    currentAmount: 32500,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
    image: "/placeholder.svg?height=200&width=400&text=Renovation",
  },
  {
    id: "2",
    title: "Ramadan Food Packages",
    description:
      "Donate to provide food packages for families in need during the blessed month of Ramadan. Each package costs $50 and feeds a family for a week.",
    category: "community" as FundraisingCategory,
    targetAmount: 10000,
    currentAmount: 7500,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
    image: "/placeholder.svg?height=200&width=400&text=Food+Packages",
  },
  {
    id: "3",
    title: "Zakat Fund",
    description:
      "Contribute to our Zakat fund which helps those in need in our community. All Zakat funds are distributed according to Islamic guidelines.",
    category: "zakat" as FundraisingCategory,
    targetAmount: 100000,
    currentAmount: 45000,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 275), // 275 days from now (ongoing)
    image: "/placeholder.svg?height=200&width=400&text=Zakat+Fund",
  },
];

export function MosqueEvents({ mosqueId, userRole }: MosqueEventsProps) {
  const [activeTab, setActiveTab] = useState("events");
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isCreateFundraiserDialogOpen, setIsCreateFundraiserDialogOpen] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState(mockEvents);
  const [fundraisers, setFundraisers] = useState(mockFundraisers);

  const canCreateEvent =
    userRole === "imam" || userRole === "muezzin" || userRole === "khadem";

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const handleCreateEvent = () => {
    // Simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreateEventDialogOpen(false);
      // In a real app, this would add the new event to the list
    }, 1000);
  };

  const handleCreateFundraiser = () => {
    // Simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreateFundraiserDialogOpen(false);
      // In a real app, this would add the new fundraiser to the list
    }, 1000);
  };

  const handleAttend = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attendees + 1,
          };
        }
        return event;
      })
    );
  };

  const handleDonate = (fundraiserId: string, amount: number) => {
    setFundraisers((prev) =>
      prev.map((fundraiser) => {
        if (fundraiser.id === fundraiserId) {
          return {
            ...fundraiser,
            currentAmount: fundraiser.currentAmount + amount,
          };
        }
        return fundraiser;
      })
    );
  };

  const getEventTypeBadge = (type: EventType) => {
    let color = "";
    let icon = null;

    switch (type) {
      case "khutbah":
        color = "bg-blue-500";
        icon = <Icons.fileText className="h-3 w-3 mr-1" />;
        break;
      case "lecture":
        color = "bg-purple-500";
        icon = <Icons.graduationCap className="h-3 w-3 mr-1" />;
        break;
      case "iftar":
        color = "bg-amber-500";
        icon = <Icons.pizza className="h-3 w-3 mr-1" />;
        break;
      case "fundraiser":
        color = "bg-green-500";
        icon = <Icons.billing className="h-3 w-3 mr-1" />;
        break;
      case "community":
        color = "bg-indigo-500";
        icon = <Icons.users className="h-3 w-3 mr-1" />;
        break;
      default:
        color = "bg-gray-500";
        icon = <Icons.calendar className="h-3 w-3 mr-1" />;
    }

    return (
      <Badge className={`${color} text-white flex items-center`}>
        {icon}
        <span className="capitalize">{type}</span>
      </Badge>
    );
  };

  const getFundraisingCategoryBadge = (category: FundraisingCategory) => {
    let color = "";
    let icon = null;

    switch (category) {
      case "zakat":
        color = "bg-green-500";
        icon = <Icons.heart className="h-3 w-3 mr-1" />;
        break;
      case "sadaqah":
        color = "bg-blue-500";
        icon = <Icons.gift className="h-3 w-3 mr-1" />;
        break;
      case "renovation":
        color = "bg-amber-500";
        icon = <Icons.settings className="h-3 w-3 mr-1" />;
        break;
      case "community":
        color = "bg-purple-500";
        icon = <Icons.users className="h-3 w-3 mr-1" />;
        break;
      default:
        color = "bg-gray-500";
        icon = <Icons.billing className="h-3 w-3 mr-1" />;
    }

    return (
      <Badge className={`${color} text-white flex items-center`}>
        {icon}
        <span className="capitalize">{category}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Events & Fundraising</h2>

        <div className="flex flex-wrap gap-2">
          {canCreateEvent && (
            <>
              <Button
                className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                onClick={() => setIsCreateEventDialogOpen(true)}
              >
                <Icons.calendar className="mr-2 h-4 w-4" />
                Create Event
              </Button>

              <Button
                className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={() => setIsCreateFundraiserDialogOpen(true)}
              >
                <Icons.billing className="mr-2 h-4 w-4" />
                Start Fundraiser
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="events"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="fundraising"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Fundraising
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Icons.calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No upcoming events</h3>
              <p className="text-muted-foreground">
                Check back later for new events
              </p>
              {canCreateEvent && (
                <Button
                  className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={() => setIsCreateEventDialogOpen(true)}
                >
                  Create Event
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="rounded-xl border-primary/20 overflow-hidden"
                >
                  <div className="relative h-40">
                    <Image
                      src={
                        event.image || "/placeholder.svg?height=160&width=400"
                      }
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="flex items-center mt-1">
                        <Icons.calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {getEventTypeBadge(event.type)}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Icons.users className="h-4 w-4 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <p className="text-sm line-clamp-3">{event.description}</p>

                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <Icons.mapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                      {event.isOnline && (
                        <Badge className="ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          Online
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button
                      variant="outline"
                      className="rounded-full border-primary/20"
                    >
                      <Icons.info className="mr-2 h-4 w-4" />
                      Details
                    </Button>

                    <Button
                      className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      onClick={() => handleAttend(event.id)}
                    >
                      <Icons.check className="mr-2 h-4 w-4" />
                      Attend
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fundraising" className="mt-6">
          {fundraisers.length === 0 ? (
            <div className="text-center py-12">
              <Icons.billing className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">
                No active fundraisers
              </h3>
              <p className="text-muted-foreground">
                Check back later for new fundraising campaigns
              </p>
              {canCreateEvent && (
                <Button
                  className="mt-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  onClick={() => setIsCreateFundraiserDialogOpen(true)}
                >
                  Start Fundraiser
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {fundraisers.map((fundraiser) => {
                const progressPercentage = Math.min(
                  100,
                  Math.round(
                    (fundraiser.currentAmount / fundraiser.targetAmount) * 100
                  )
                );

                return (
                  <Card
                    key={fundraiser.id}
                    className="rounded-xl border-primary/20 overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="relative h-48 md:h-auto md:w-1/3">
                        <Image
                          src={
                            fundraiser.image ||
                            "/placeholder.svg?height=200&width=200"
                          }
                          alt={fundraiser.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 md:w-2/3">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <h3 className="font-bold text-lg">
                            {fundraiser.title}
                          </h3>
                          {getFundraisingCategoryBadge(fundraiser.category)}
                        </div>

                        <p className="text-sm mb-4">{fundraiser.description}</p>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              ${fundraiser.currentAmount.toLocaleString()}{" "}
                              raised
                            </span>
                            <span className="text-muted-foreground">
                              of ${fundraiser.targetAmount.toLocaleString()}{" "}
                              goal
                            </span>
                          </div>

                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-2.5 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {progressPercentage}% of goal reached
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="rounded-full border-primary/20"
                                onClick={() => handleDonate(fundraiser.id, 10)}
                              >
                                $10
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-full border-primary/20"
                                onClick={() => handleDonate(fundraiser.id, 50)}
                              >
                                $50
                              </Button>
                              <Button
                                className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                                onClick={() => handleDonate(fundraiser.id, 100)}
                              >
                                Donate
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog
        open={isCreateEventDialogOpen}
        onOpenChange={setIsCreateEventDialogOpen}
      >
        <DialogContent className="sm:max-w-lg rounded-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Create a new event for the mosque community. Fill in the details
              below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="event-title" className="text-sm font-medium">
                Event Title
              </label>
              <Input
                id="event-title"
                placeholder="E.g., 'Friday Khutbah: The Importance of Gratitude'"
                className="border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="event-description"
                className="text-sm font-medium"
              >
                Event Description
              </label>
              <Textarea
                id="event-description"
                placeholder="Provide details about the event..."
                className="resize-none border-primary/20 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="event-type" className="text-sm font-medium">
                  Event Type
                </label>
                <Select defaultValue="khutbah">
                  <SelectTrigger id="event-type" className="border-primary/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="khutbah">Khutbah (Sermon)</SelectItem>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="iftar">Iftar</SelectItem>
                    <SelectItem value="fundraiser">Fundraiser</SelectItem>
                    <SelectItem value="community">Community Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="event-location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="event-location"
                  placeholder="E.g., 'Main Prayer Hall'"
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="event-start-date"
                  className="text-sm font-medium"
                >
                  Start Date & Time
                </label>
                <Input
                  id="event-start-date"
                  type="datetime-local"
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="event-end-date" className="text-sm font-medium">
                  End Date & Time
                </label>
                <Input
                  id="event-end-date"
                  type="datetime-local"
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-online"
                className="rounded border-primary/20"
              />
              <label htmlFor="is-online" className="text-sm font-medium">
                This is an online event
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="event-image" className="text-sm font-medium">
                Event Image
              </label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload an image
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateEventDialogOpen(false)}
              className="rounded-full border-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Fundraiser Dialog */}
      <Dialog
        open={isCreateFundraiserDialogOpen}
        onOpenChange={setIsCreateFundraiserDialogOpen}
      >
        <DialogContent className="sm:max-w-lg rounded-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Start Fundraiser</DialogTitle>
            <DialogDescription>
              Create a new fundraising campaign for the mosque community. Fill
              in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="fundraiser-title" className="text-sm font-medium">
                Fundraiser Title
              </label>
              <Input
                id="fundraiser-title"
                placeholder="E.g., 'Mosque Renovation Fund'"
                className="border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="fundraiser-description"
                className="text-sm font-medium"
              >
                Fundraiser Description
              </label>
              <Textarea
                id="fundraiser-description"
                placeholder="Describe the purpose of this fundraiser..."
                className="resize-none border-primary/20 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="fundraiser-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>
                <Select defaultValue="renovation">
                  <SelectTrigger
                    id="fundraiser-category"
                    className="border-primary/20"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zakat">Zakat</SelectItem>
                    <SelectItem value="sadaqah">Sadaqah</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="community">Community Aid</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fundraiser-target"
                  className="text-sm font-medium"
                >
                  Target Amount ($)
                </label>
                <Input
                  id="fundraiser-target"
                  type="number"
                  placeholder="E.g., 10000"
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="fundraiser-start-date"
                  className="text-sm font-medium"
                >
                  Start Date
                </label>
                <Input
                  id="fundraiser-start-date"
                  type="date"
                  className="border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fundraiser-end-date"
                  className="text-sm font-medium"
                >
                  End Date
                </label>
                <Input
                  id="fundraiser-end-date"
                  type="date"
                  className="border-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fundraiser-image" className="text-sm font-medium">
                Fundraiser Image
              </label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Icons.image className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to upload an image
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateFundraiserDialogOpen(false)}
              className="rounded-full border-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFundraiser}
              disabled={isSubmitting}
              className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Start Fundraiser"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
