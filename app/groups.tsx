"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Users, DollarSign, Clock, LinkIcon } from "lucide-react"
import { createGroup } from "@/lib/groupService"
import { useSettings } from "@/lib/settings-context"

type Group = {
  id: string
  name: string
  memberCount: number
  latestActivity: string
  latestActivityTime: Date
  balance: number
  totalExpenses: number
}

const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Weekend Trip",
    memberCount: 3,
    latestActivity: "Gas for the car",
    latestActivityTime: new Date(Date.now() - 1800000),
    balance: 5000,
    totalExpenses: 45000,
  },
  {
    id: "2",
    name: "Apartment Expenses",
    memberCount: 4,
    latestActivity: "Electricity bill",
    latestActivityTime: new Date(Date.now() - 86400000),
    balance: -2500,
    totalExpenses: 120000,
  },
  {
    id: "3",
    name: "Office Lunch",
    memberCount: 5,
    latestActivity: "Pizza delivery",
    latestActivityTime: new Date(Date.now() - 3600000),
    balance: 1200,
    totalExpenses: 8500,
  },
]

export default function GroupsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { formatMoney, t } = useSettings()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Group[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setGroups(MOCK_GROUPS)
      setLoading(false)
    }, 800)
  }, [])

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast({
        title: t("invalidInput"),
        description: t("enterGroupNameError"),
        variant: "destructive",
      })
      return
    }

    const newGroup: Group = {
      id: `${Date.now()}`,
      name: groupName,
      memberCount: 1,
      latestActivity: "Group created",
      latestActivityTime: new Date(),
      balance: 0,
      totalExpenses: 0,
    }

    setGroups((prev) => [newGroup, ...prev])
    toast({
      title: t("groupCreated"),
      description: `${groupName} ${t("groupCreatedDesc")}`,
    })

    setGroupName("")
    setCreateDialogOpen(false)
  }

  const handleJoinGroup = () => {
    if (!inviteCode.trim()) {
      toast({
        title: t("invalidInput"),
        description: t("enterInviteCodeError"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("joinedGroup"),
      description: t("joinedGroupDesc"),
    })

    setInviteCode("")
    setJoinDialogOpen(false)
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return t("justNow")
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}${t("minutesAgo")}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}${t("hoursAgo")}`
    const days = Math.floor(hours / 24)
    return `${days}${t("daysAgo")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-4xl p-4 sm:p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-4xl p-4 sm:p-6">
          <h1 className="text-xl font-bold mb-3 sm:mb-4 sm:text-2xl">{t("groupsTitle")}</h1>
          <div className="flex flex-wrap gap-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1 sm:flex-none h-9">
                  <Plus className="mr-1.5 h-4 w-4" />
                  {t("createNewGroup")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createNewGroup")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="group-name">{t("groupName")}</Label>
                    <Input
                      id="group-name"
                      placeholder={t("enterGroupName")}
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleCreateGroup} className="w-full">
                    {t("createNewGroup")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-9 bg-transparent">
                  <LinkIcon className="mr-1.5 h-4 w-4" />
                  {t("joinViaCode")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("joinGroup")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invite-code">{t("inviteCode")}</Label>
                    <Input
                      id="invite-code"
                      placeholder={t("enterInviteCode")}
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="mt-2 font-mono"
                    />
                  </div>
                  <Button onClick={handleJoinGroup} className="w-full">
                    {t("joinGroup")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        {groups.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 sm:text-xl">{t("noGroupsYet")}</h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {t("noGroupsDesc")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button onClick={() => setCreateDialogOpen(true)} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("createNewGroup")}
                </Button>
                <Button onClick={() => setJoinDialogOpen(true)} variant="outline" className="flex-1 bg-transparent">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {t("joinViaCode")}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="p-4 sm:p-5 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/groups/${group.id}`)}
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Group Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{group.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm mt-0.5">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>{group.memberCount} {t("membersCount")}</span>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-md text-xs font-semibold shrink-0 sm:text-sm ${
                        group.balance >= 0
                          ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}
                    >
                      {group.balance >= 0 ? "+" : ""}
                      {formatMoney(group.balance)}
                    </div>
                  </div>

                  {/* Latest Activity */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTimeAgo(group.latestActivityTime)}</span>
                    </div>
                    <p className="text-sm text-foreground truncate sm:text-base">{group.latestActivity}</p>
                  </div>

                  {/* Total Expenses */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                      <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{t("totalExpenses")}</span>
                    </div>
                    <p className="text-sm font-semibold sm:text-base">{formatMoney(group.totalExpenses)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
