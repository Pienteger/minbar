"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { MosqueRoleBadge } from "@/components/mosque/mosque-role-badge";
import type {
  MosqueRole,
  QuestionCategory,
  QuestionVisibility,
} from "@/types/mosque";
import { formatDistanceToNow } from "@/lib/date-utils";

interface ScholarQAProps {
  mosqueId: string;
  userRole?: MosqueRole;
}

// Mock data for questions
const mockQuestions = [
  {
    id: "1",
    title: "Ruling on combining prayers while traveling",
    content:
      "I will be traveling for business next week and will have a tight schedule. What are the conditions for combining prayers while traveling? Is it permissible to combine Zuhr with Asr, and Maghrib with Isha?",
    category: "fiqh" as QuestionCategory,
    visibility: "public" as QuestionVisibility,
    status: "answered" as const,
    askerName: "Ahmed Hassan",
    askerAvatar: "/placeholder.svg?height=40&width=40&text=AH",
    scholarName: "Imam Abdullah",
    scholarAvatar: "/placeholder.svg?height=40&width=40&text=IA",
    scholarRole: "imam" as MosqueRole,
    answer:
      "Yes, it is permissible to combine prayers while traveling. The Prophet (peace be upon him) combined prayers during his journeys. You can combine Zuhr with Asr, and Maghrib with Isha, either by performing them together during the time of the earlier prayer (jam' taqdeem) or during the time of the later prayer (jam' ta'kheer). The distance that constitutes travel is approximately 48 miles (80 kilometers) according to many scholars. Remember that while you can combine prayers, you should still maintain the correct number of rak'ahs for each prayer.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    answeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    upvotes: 12,
  },
  {
    id: "2",
    title: "Is it permissible to pay Zakat to family members?",
    content:
      "I have a cousin who is struggling financially and needs help for his education. Can I give my Zakat to him, or should I look for other recipients?",
    category: "fiqh" as QuestionCategory,
    visibility: "public" as QuestionVisibility,
    status: "pending" as const as QuestionCategory,
    askerName: "Fatima Khan",
    askerAvatar: "/placeholder.svg?height=40&width=40&text=FK",
    scholarName: null,
    scholarAvatar: null,
    scholarRole: null,
    answer: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    answeredAt: null,
    upvotes: 8,
  },
  {
    id: "3",
    title: "How to make up for missed fasts from previous Ramadan?",
    content:
      "I was unable to fast for 10 days during last Ramadan due to illness. What is the proper way to make up for these missed fasts? Is there a specific time period in which I must complete them?",
    category: "worship" as QuestionCategory,
    visibility: "public" as QuestionVisibility,
    status: "assigned" as const,
    askerName: "Mariam Ali",
    askerAvatar: "/placeholder.svg?height=40&width=40&text=MA",
    scholarName: "Dr. Yusuf Khan",
    scholarAvatar: "/placeholder.svg?height=40&width=40&text=YK",
    scholarRole: "scholar" as MosqueRole,
    answer: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    answeredAt: null,
    upvotes: 15,
  },
  {
    id: "4",
    title: "Islamic guidelines for business partnerships",
    content:
      "I'm considering entering into a business partnership. What are the Islamic guidelines for partnerships? What should I be aware of to ensure the business complies with Shariah principles?",
    category: "business" as QuestionCategory,
    visibility: "private" as QuestionVisibility,
    status: "answered" as const,
    askerName: "Omar Rahman",
    askerAvatar: "/placeholder.svg?height=40&width=40&text=OR",
    scholarName: "Imam Abdullah",
    scholarAvatar: "/placeholder.svg?height=40&width=40&text=IA",
    scholarRole: "imam" as MosqueRole,
    answer:
      "In Islamic business partnerships (Musharakah), there are several key principles to follow: 1) Clear agreement on profit-sharing ratios before starting the business, 2) Losses must be shared according to the capital contribution ratio, 3) All partners should have clear knowledge of the capital invested, 4) The business must involve halal activities and products, 5) Avoid interest-based financing, and 6) Maintain transparency in all transactions. I recommend consulting with an Islamic finance expert for your specific situation to ensure full compliance with Shariah principles.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    answeredAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    upvotes: 7,
  },
];

export function ScholarQA({ mosqueId, userRole }: ScholarQAProps) {
  const [questions, setQuestions] = useState(mockQuestions);
  const [activeTab, setActiveTab] = useState("all");
  const [isAskDialogOpen, setIsAskDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    category: "general" as QuestionCategory,
    visibility: "public" as QuestionVisibility,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isScholar =
    userRole === "imam" || userRole === "scholar" || userRole === "khatib";

  const filteredQuestions = questions.filter((q) => {
    // Filter by search query
    if (
      searchQuery &&
      !q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by tab
    if (activeTab === "pending" && q.status !== "pending") return false;
    if (activeTab === "answered" && q.status !== "answered") return false;
    if (activeTab === "my-questions" && q.askerName !== "Current User")
      return false;
    if (
      activeTab === "assigned" &&
      !(isScholar && q.scholarName === "Imam Abdullah")
    )
      return false;

    return true;
  });

  const handleAskQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newQuestionObj = {
        id: Date.now().toString(),
        title: newQuestion.title,
        content: newQuestion.content,
        category: newQuestion.category,
        visibility: newQuestion.visibility,
        status: "pending" as const,
        askerName: "Current User",
        askerAvatar: "/placeholder.svg?height=40&width=40&text=CU",
        scholarName: null,
        scholarAvatar: null,
        scholarRole: null,
        answer: null,
        createdAt: new Date(),
        answeredAt: null,
        upvotes: 0,
      };

      setQuestions([newQuestionObj, ...questions]);
      setNewQuestion({
        title: "",
        content: "",
        category: "general",
        visibility: "public",
      });
      setIsSubmitting(false);
      setIsAskDialogOpen(false);
    }, 1000);
  };

  const handleUpvote = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            upvotes: q.upvotes + 1,
          };
        }
        return q;
      })
    );
  };

  const handleAssignQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            status: "assigned" as const,
            scholarName: "Imam Abdullah",
            scholarAvatar: "/placeholder.svg?height=40&width=40&text=IA",
            scholarRole: "imam",
          };
        }
        return q;
      })
    );
  };

  const getCategoryBadge = (category: QuestionCategory) => {
    let color = "";
    let icon = null;

    switch (category) {
      case "fiqh":
        color = "bg-blue-500";
        icon = <Icons.book className="h-3 w-3 mr-1" />;
        break;
      case "aqeedah":
        color = "bg-purple-500";
        icon = <Icons.heart className="h-3 w-3 mr-1" />;
        break;
      case "family":
        color = "bg-green-500";
        icon = <Icons.users className="h-3 w-3 mr-1" />;
        break;
      case "business":
        color = "bg-amber-500";
        icon = <Icons.briefcase className="h-3 w-3 mr-1" />;
        break;
      case "worship":
        color = "bg-indigo-500";
        icon = <Icons.pray className="h-3 w-3 mr-1" />;
        break;
      default:
        color = "bg-gray-500";
        icon = <Icons.help className="h-3 w-3 mr-1" />;
    }

    return (
      <Badge className={`${color} text-white flex items-center`}>
        {icon}
        <span className="capitalize">{category}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    let color = "";
    let text = "";

    switch (status) {
      case "pending":
        color = "bg-amber-500";
        text = "Pending";
        break;
      case "assigned":
        color = "bg-blue-500";
        text = "Assigned";
        break;
      case "answered":
        color = "bg-green-500";
        text = "Answered";
        break;
      case "closed":
        color = "bg-gray-500";
        text = "Closed";
        break;
    }

    return <Badge className={`${color} text-white`}>{text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold">Scholar Q&A</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 rounded-full border-primary/20 w-full sm:w-64"
            />
          </div>

          <Button
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            onClick={() => setIsAskDialogOpen(true)}
          >
            <Icons.help className="mr-2 h-4 w-4" />
            Ask a Question
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            All Questions
          </TabsTrigger>
          <TabsTrigger
            value="answered"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Answered
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Pending
          </TabsTrigger>
          {isScholar ? (
            <TabsTrigger
              value="assigned"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Assigned to Me
            </TabsTrigger>
          ) : (
            <TabsTrigger
              value="my-questions"
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              My Questions
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <Icons.help className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No questions found</h3>
              <p className="text-muted-foreground">
                {activeTab === "my-questions"
                  ? "You haven't asked any questions yet"
                  : activeTab === "assigned"
                  ? "No questions are currently assigned to you"
                  : "Be the first to ask a question"}
              </p>
              <Button
                className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                onClick={() => setIsAskDialogOpen(true)}
              >
                Ask a Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card
                  key={question.id}
                  className="rounded-xl border-primary/20"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {question.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          {getCategoryBadge(question.category)}
                          {getStatusBadge(question.status)}
                          {question.visibility === "private" && (
                            <Badge
                              variant="outline"
                              className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                            >
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-primary/20 flex items-center"
                          onClick={() => handleUpvote(question.id)}
                        >
                          <Icons.arrowUp className="h-4 w-4 mr-1" />
                          {question.upvotes}
                        </Button>

                        {isScholar && question.status === "pending" && (
                          <Button
                            size="sm"
                            className="rounded-full bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleAssignQuestion(question.id)}
                          >
                            <Icons.check className="h-4 w-4 mr-1" />
                            Assign to Me
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={question.askerAvatar}
                          alt={question.askerName}
                        />
                        <AvatarFallback>{question.askerName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {question.askerName}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            asked {formatDistanceToNow(question.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap">
                          {question.content}
                        </p>
                      </div>
                    </div>

                    {question.status === "answered" && question.answer && (
                      <div className="mt-6 pt-6 border-t border-primary/10">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={question.scholarAvatar!}
                              alt={question.scholarName!}
                            />
                            <AvatarFallback>
                              {question.scholarName![0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <span className="font-medium">
                                {question.scholarName}
                              </span>
                              <MosqueRoleBadge
                                role={question.scholarRole!}
                                size="sm"
                                className="ml-2"
                              />
                              <span className="text-xs text-muted-foreground ml-2">
                                answered{" "}
                                {formatDistanceToNow(question.answeredAt!)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap">
                              {question.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {question.status === "assigned" &&
                    isScholar &&
                    question.scholarName === "Imam Abdullah" && (
                      <CardFooter className="p-4 border-t border-primary/10">
                        <div className="w-full">
                          <Textarea
                            placeholder="Write your answer here..."
                            className="w-full resize-none border-primary/20 min-h-[100px]"
                          />
                          <div className="flex justify-end mt-3">
                            <Button className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                              Submit Answer
                            </Button>
                          </div>
                        </div>
                      </CardFooter>
                    )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ask Question Dialog */}
      <Dialog open={isAskDialogOpen} onOpenChange={setIsAskDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Ask our scholars about Islamic matters. Questions may be reviewed
              by the mosque imam before being assigned to a scholar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="question-title" className="text-sm font-medium">
                Question Title
              </label>
              <Input
                id="question-title"
                placeholder="E.g., 'Ruling on combining prayers while traveling'"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                className="border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="question-content" className="text-sm font-medium">
                Question Details
              </label>
              <Textarea
                id="question-content"
                placeholder="Provide details about your question..."
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
                className="resize-none border-primary/20 min-h-[150px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="question-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>
                <Select
                  value={newQuestion.category}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      category: value as QuestionCategory,
                    })
                  }
                >
                  <SelectTrigger
                    id="question-category"
                    className="border-primary/20"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiqh">Fiqh (Jurisprudence)</SelectItem>
                    <SelectItem value="aqeedah">Aqeedah (Creed)</SelectItem>
                    <SelectItem value="family">Family Matters</SelectItem>
                    <SelectItem value="business">Business & Finance</SelectItem>
                    <SelectItem value="worship">Acts of Worship</SelectItem>
                    <SelectItem value="general">General Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="question-visibility"
                  className="text-sm font-medium"
                >
                  Visibility
                </label>
                <Select
                  value={newQuestion.visibility}
                  onValueChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      visibility: value as QuestionVisibility,
                    })
                  }
                >
                  <SelectTrigger
                    id="question-visibility"
                    className="border-primary/20"
                  >
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      Public (Visible to all)
                    </SelectItem>
                    <SelectItem value="private">
                      Private (Only visible to scholars)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAskDialogOpen(false)}
              className="rounded-full border-primary/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAskQuestion}
              disabled={
                !newQuestion.title.trim() ||
                !newQuestion.content.trim() ||
                isSubmitting
              }
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Question"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
