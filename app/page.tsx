"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  UserPlus,
  Link,
  TrendingUp,
  TrendingDown,
  Home,
  Wallet,
  User,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react"

type ActivityItem = {
  id: string
  type: "expense" | "settlement" | "join"
  title: string
  amount?: number
  timestamp: Date
  user: {
    name: string
    avatar?: string
  }
  groupName?: string
  isPositive?: boolean
}

const MOCK_USER = {
  name: "Alex",
  uid: "user1",
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "expense",
    title: "Groceries at Migros",
    amount: 25000,
    timestamp: new Date(Date.now() - 3600000),
    user: { name: "Sarah" },
    groupName: "Apartment 4B",
    isPositive: false,
  },
  {
    id: "2",
    type: "settlement",
    title: "Payment received",
    amount: 15000,
    timestamp: new Date(Date.now() - 7200000),
    user: { name: "Mike" },
    groupName: "Weekend Trip",
    isPositive: true,
  },
  {
    id: "3",
    type: "join",
    title: "Joined your group",
    timestamp: new Date(Date.now() - 10800000),
    user: { name: "Emma" },
    groupName: "Office Lunch",
  },
  {
    id: "4",
    type: "expense",
    title: "Dinner at restaurant",
    amount: 45000,
    timestamp: new Date(Date.now() - 14400000),
    user: { name: "John" },
    groupName: "Weekend Trip",
    isPositive: false,
  },
  {
    id: "5",
    type: "settlement",
    title: "You paid Mike",
    amount: 20000,
    timestamp: new Date(Date.now() - 18000000),
    user: { name: "Mike" },
    groupName: "Apartment 4B",
    isPositive: false,
  },
  {
    id: "6",
    type: "expense",
    title: "Coffee at Starbucks",
    amount: 8500,
    timestamp: new Date(Date.now() - 21600000),
    user: { name: "Lisa" },
    groupName: "Office Lunch",
    isPositive: false,
  },
  {
    id: "7",
    type: "settlement",
    title: "Payment received",
    amount: 30000,
    timestamp: new Date(Date.now() - 25200000),
    user: { name: "Tom" },
    groupName: "Weekend Trip",
    isPositive: true,
  },
  {
    id: "8",
    type: "expense",
    title: "Taxi ride",
    amount: 12000,
    timestamp: new Date(Date.now() - 28800000),
    user: { name: "Sarah" },
    groupName: "Apartment 4B",
    isPositive: false,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)
  const [activityDetailOpen, setActivityDetailOpen] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const youOwe = 45000
  const youAreOwed = 35000
  const netBalance = youAreOwed - youOwe

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(cents / 100)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a group name",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Group created",
      description: `${groupName} has been created successfully`,
    })
    setCreateGroupOpen(false)
    setGroupName("")
  }

  const handleJoinGroup = () => {
    if (!joinCode.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a join code",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Joined group",
      description: "You've successfully joined the group",
    })
    setJoinGroupOpen(false)
    setJoinCode("")
  }

  const filterActivities = (type?: string) => {
    if (!type || type === "all") return activities
    return activities.filter((activity) => activity.type === type)
  }

  const getLimitedActivities = (filteredActivities: ActivityItem[]) => {
    if (showAllActivities) return filteredActivities
    return filteredActivities.slice(0, 6)
  }

  const renderActivityItem = (activity: ActivityItem) => {
    const getIcon = () => {
      switch (activity.type) {
        case "expense":
          return <DollarSign className="h-4.5 w-4.5" />
        case "settlement":
          return <CheckCircle className="h-4.5 w-4.5" />
        case "join":
          return <UserPlus className="h-4.5 w-4.5" />
      }
    }

    const getIconBgColor = () => {
      switch (activity.type) {
        case "expense":
          return "bg-purple-100 dark:bg-purple-950/30"
        case "settlement":
          return activity.isPositive ? "bg-green-100 dark:bg-green-950/30" : "bg-orange-100 dark:bg-orange-950/30"
        case "join":
          return "bg-blue-100 dark:bg-blue-950/30"
      }
    }

    const getIconColor = () => {
      if (activity.type === "join") return "text-blue-600 dark:text-blue-400"
      if (activity.type === "settlement")
        return activity.isPositive ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
      return "text-purple-600 dark:text-purple-400"
    }

    return (
      <Card
        key={activity.id}
        className="h-full p-4 hover:bg-accent/50 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col gap-2 group"
        onClick={() => {
          setSelectedActivity(activity)
          setActivityDetailOpen(true)
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className={`rounded-full ${getIconBgColor()} h-7 w-7 flex items-center justify-center shrink-0 ${getIconColor()}`}
          >
            <div className="h-[18px] w-[18px] flex items-center justify-center">{getIcon()}</div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-none whitespace-nowrap" suppressHydrationWarning>
            {mounted ? formatTime(activity.timestamp) : ""}
          </p>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate leading-snug">{activity.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
              {activity.user.name}
              {activity.groupName && ` • ${activity.groupName}`}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            {activity.amount && (
              <Badge
                variant={activity.isPositive ? "default" : "secondary"}
                className={`shrink-0 whitespace-nowrap text-xs px-2.5 py-1 h-6 transition-colors duration-200 ${
                  activity.isPositive
                    ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400"
                    : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                }`}
              >
                {activity.isPositive ? "+" : "-"}
                {formatCurrency(activity.amount)}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto" />
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Hello, {MOCK_USER.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Welcome to Kasa</p>
          </div>

          <Card className="p-8 sm:p-12 text-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">No groups yet</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create a group to start tracking expenses with friends and family, or join an existing group with a
                  code.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 h-11 sm:h-10">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input
                          id="group-name"
                          placeholder="Weekend Trip, Apartment 4B, etc."
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <Button onClick={handleCreateGroup} className="w-full">
                        Create Group
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 h-11 sm:h-10 bg-transparent">
                      <Link className="mr-2 h-4 w-4" />
                      Join via Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="join-code">Invite Code</Label>
                        <Input
                          id="join-code"
                          placeholder="Enter the group invite code"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <Button onClick={handleJoinGroup} className="w-full">
                        Join Group
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border z-50">
          <div className="mx-auto max-w-4xl px-6 py-3">
            <div className="flex items-center justify-around">
              <button
                onClick={() => router.push("/groups")}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
                aria-label="Groups"
              >
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </button>

              <button
                onClick={() => router.push("/")}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                aria-label="Home"
              >
                <Home className="h-6 w-6 text-green-600" />
              </button>

              <button
                onClick={() => router.push("/profile")}
                className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
                aria-label="Profile"
              >
                <User className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-4xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Hello, {MOCK_USER.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Here's your expense overview</p>
            </div>
            <Avatar
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/profile")}
            >
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">AJ</AvatarFallback>
            </Avatar>
          </div>

          <div className="sm:hidden">
            <div className="grid grid-cols-3 gap-1">
              <Card className="p-2 rounded-md flex flex-col items-center justify-center text-center min-h-0">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <p className="text-[11px] text-muted-foreground mb-0.5">You owe</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[13px] font-semibold text-red-600">{formatCurrency(youOwe)}</span>
                    <span className="rounded-full bg-red-100 dark:bg-red-950/20 p-0.5">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="p-2 rounded-md flex flex-col items-center justify-center text-center min-h-0">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <p className="text-[11px] text-muted-foreground mb-0.5">You're owed</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[13px] font-semibold text-green-600">{formatCurrency(youAreOwed)}</span>
                    <span className="rounded-full bg-green-100 dark:bg-green-950/20 p-0.5">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="p-2 rounded-md flex flex-col items-center justify-center text-center min-h-0 bg-muted/50">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <p className="text-[11px] text-muted-foreground mb-0.5">Net Balance</p>
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`text-[13px] font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {netBalance >= 0 ? "+" : ""}
                      {formatCurrency(Math.abs(netBalance))}
                    </span>
                    <span
                      className={`rounded-full p-0.5 ${netBalance >= 0 ? "bg-green-100 dark:bg-green-950/20" : "bg-red-100 dark:bg-red-950/20"}`}
                    >
                      {netBalance >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
            <Card className="p-1.5 sm:p-2 md:p-3 rounded-md">
              <div className="leading-[1.05]">
                <p className="text-[11px] text-muted-foreground">You owe</p>
                <div className="mt-0.5 inline-flex items-center gap-1.5">
                  <span className="text-[13px] sm:text-sm md:text-xl font-bold text-red-600">
                    {formatCurrency(youOwe)}
                  </span>
                  <span className="rounded-full bg-red-100 dark:bg-red-950/20 p-0.5 sm:p-1 md:p-1.5">
                    <TrendingDown className="h-3.5 w-3.5 md:h-5 md:w-5 text-red-600" />
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-1.5 sm:p-2 md:p-3 rounded-md">
              <div className="leading-[1.05]">
                <p className="text-[11px] text-muted-foreground">You're owed</p>
                <div className="mt-0.5 inline-flex items-center gap-1.5">
                  <span className="text-[13px] sm:text-sm md:text-xl font-bold text-green-600">
                    {formatCurrency(youAreOwed)}
                  </span>
                  <span className="rounded-full bg-green-100 dark:bg-green-950/20 p-0.5 sm:p-1 md:p-1.5">
                    <TrendingUp className="h-3.5 w-3.5 md:h-5 md:w-5 text-green-600" />
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="hidden sm:flex mt-1.5 md:mt-3 p-1.5 sm:p-2 md:p-3 bg-muted/50 rounded-md">
            <div className="leading-[1.05] w-full">
              <p className="text-[10px] md:text-xs text-muted-foreground">Net Balance</p>
              <div className="mt-0.5 inline-flex items-center gap-1.5">
                <span
                  className={`text-[13px] md:text-xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {netBalance >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(netBalance))}
                </span>
                <span
                  className={`rounded-full p-0.5 sm:p-1 md:p-1.5 ${netBalance >= 0 ? "bg-green-100 dark:bg-green-950/20" : "bg-red-100 dark:bg-red-950/20"}`}
                >
                  {netBalance >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5 md:h-5 md:w-5 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 md:h-5 md:w-5 text-red-600" />
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto mb-3 sm:mb-4">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All
            </TabsTrigger>
            <TabsTrigger value="expense" className="flex-1 sm:flex-none">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="settlement" className="flex-1 sm:flex-none">
              Settlements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {getLimitedActivities(filterActivities("all")).map(renderActivityItem)}
            </div>
            {filterActivities("all").length > 6 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="gap-2"
                >
                  {showAllActivities ? (
                    <>
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View All ({filterActivities("all").length})
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expense" className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {getLimitedActivities(filterActivities("expense")).length > 0 ? (
                getLimitedActivities(filterActivities("expense")).map(renderActivityItem)
              ) : (
                <Card className="p-8 text-center col-span-2">
                  <p className="text-muted-foreground">No expenses yet</p>
                </Card>
              )}
            </div>
            {filterActivities("expense").length > 6 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="gap-2"
                >
                  {showAllActivities ? (
                    <>
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View All ({filterActivities("expense").length})
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settlement" className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {getLimitedActivities(filterActivities("settlement")).length > 0 ? (
                getLimitedActivities(filterActivities("settlement")).map(renderActivityItem)
              ) : (
                <Card className="p-8 text-center col-span-2">
                  <p className="text-muted-foreground">No settlements yet</p>
                </Card>
              )}
            </div>
            {filterActivities("settlement").length > 6 && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="gap-2"
                >
                  {showAllActivities ? (
                    <>
                      Show Less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View All ({filterActivities("settlement").length})
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={activityDetailOpen} onOpenChange={setActivityDetailOpen}>
        <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-3 ${
                    selectedActivity.type === "expense"
                      ? "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                      : selectedActivity.type === "settlement"
                        ? selectedActivity.isPositive
                          ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                          : "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"
                        : "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {selectedActivity.type === "expense" ? (
                    <DollarSign className="h-6 w-6" />
                  ) : selectedActivity.type === "settlement" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <UserPlus className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedActivity.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedActivity.type}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {selectedActivity.amount && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <Badge
                      variant={selectedActivity.isPositive ? "default" : "secondary"}
                      className={`text-base px-3 py-1 ${
                        selectedActivity.isPositive
                          ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400"
                          : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                      }`}
                    >
                      {selectedActivity.isPositive ? "+" : "-"}
                      {formatCurrency(selectedActivity.amount)}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">User</span>
                  <span className="font-medium">{selectedActivity.user.name}</span>
                </div>

                {selectedActivity.groupName && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Group</span>
                    <span className="font-medium">{selectedActivity.groupName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="font-medium">{formatTime(selectedActivity.timestamp)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-card/80 backdrop-blur-lg border-t border-border z-50">
        <div className="mx-auto max-w-4xl px-6 py-2.5">
          <div className="flex items-center justify-around">
            <button
              onClick={() => router.push("/groups")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label="Groups"
            >
              <Wallet className="h-6 w-6 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Groups</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center gap-1 p-2 px-4 rounded-full transition-colors bg-green-100 dark:bg-green-950/30"
              aria-label="Home"
            >
              <Home className="h-6 w-6 text-green-600" />
              <span className="text-[11px] text-green-600 font-medium">Home</span>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label="Profile"
            >
              <User className="h-6 w-6 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
