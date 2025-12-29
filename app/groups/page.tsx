"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { auth, db } from "@/lib/firebase"
import { collection, onSnapshot, query, where, doc, getDoc, updateDoc, arrayUnion, addDoc, serverTimestamp } from "firebase/firestore"
import { createGroup } from "@/lib/groupService"
import { Plus, Users, DollarSign, TrendingUp, TrendingDown, Link, Home, Wallet, User, Clock, MoreVertical, Archive, RefreshCw } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { EmptyState } from "@/components/EmptyState"
import { SkeletonCard } from "@/components/SkeletonCard"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Group = {
  id: string
  name: string
  memberCount: number
  totalExpenses: number
  yourBalance: number
  lastActivity: string
  lastActivityTime: Date
  isActive: boolean
}

export default function GroupsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { formatMoney, t } = useSettings()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Group[]>([])
  useEffect(() => {
    let unsubGroups: undefined | (() => void)
  
    const unsubAuth = auth.onAuthStateChanged((user) => {
      // Logout
      if (!user) {
        if (unsubGroups) {
          unsubGroups()
          unsubGroups = undefined
        }
        setGroups([])
        setLoading(false)
        return
      }
  
      setLoading(true)
  
      // Listen to groups where the user is a member (created or joined)
      const q = query(collection(db, "groups"), where("memberIds", "array-contains", user.uid))
  
      // Reset previous listener if any
      if (unsubGroups) {
        unsubGroups()
        unsubGroups = undefined
      }
  
      unsubGroups = onSnapshot(
        q,
        (snap) => {
          const fetched: Group[] = snap.docs.map((docSnap) => {
            const data = docSnap.data() as any
            const memberIds: string[] = Array.isArray(data.memberIds) ? data.memberIds : []
  
            return {
              id: docSnap.id,
              name: data.name ?? t("unnamedGroup"),
              memberCount: memberIds.length || 1,
              totalExpenses: 0,
              yourBalance: 0,
              lastActivity: t("groupCreated"),
              lastActivityTime:
                data.createdAt && typeof data.createdAt.toDate === "function"
                  ? data.createdAt.toDate()
                  : new Date(),
              isActive: data.isActive ?? true,
            }
          })
  
          setGroups(fetched)
          setLoading(false)
        },
        (error) => {
          console.error("Failed to fetch groups:", error)
          setGroups([])
          setLoading(false)
        },
      )
    })
  
    return () => {
      if (unsubGroups) unsubGroups()
      unsubAuth()
    }
  }, [])
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [activeTab, setActiveTab] = useState("active")

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

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: t("invalidInput"),
        description: t("enterGroupNameError"),
        variant: "destructive",
      })
      return
    }

    const name = groupName.trim()
    setLoading(true)

    try {
      const { groupId } = await createGroup(name)

      toast({
        title: t("groupCreated"),
        description: `${name} ${t("groupCreatedDesc")}`,
      })

      setCreateGroupOpen(false)
      setGroupName("")
      router.push(`/groups/${groupId}`)
    } catch (error) {
      console.error("Failed to create group:", error)
      toast({
        title: t("genericErrorTitle"),
        description: t("genericErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    const user = auth.currentUser
    const inviteCode = joinCode.trim().toUpperCase()
  
    if (!user) {
      toast({
        title: t("loginRequired"),
        description: t("loginRequiredDesc"),
        variant: "destructive",
      })
      return
    }
  
    if (!inviteCode) {
      toast({
        title: t("enterCodeTitle"),
        description: t("enterCodeDesc"),
        variant: "destructive",
      })
      return
    }
  
    setLoading(true)
  
    try {
      // 1) invite doc oku
      const inviteRef = doc(db, "groupInvites", inviteCode)
      const inviteSnap = await getDoc(inviteRef)
  
      if (!inviteSnap.exists()) {
        toast({
          title: t("invalidCode"),
          description: t("inviteNotFound"),
          variant: "destructive",
        })
        return
      }
  
      const invite = inviteSnap.data() as any
      if (invite.disabled) {
        toast({
          title: t("inviteDisabled"),
          description: t("inviteDisabledDesc"),
          variant: "destructive",
        })
        return
      }
  
      const groupId = invite.groupId as string
      if (!groupId) {
        toast({
          title: t("invalidInput"),
          description: t("inviteMissingInfo"),
          variant: "destructive",
        })
        return
      }
  
      
      // 2) Gruba ekle (group doc'u okumadan). arrayUnion idempotenttir.
      const groupRef = doc(db, "groups", groupId)
      await updateDoc(groupRef, {
        memberIds: arrayUnion(user.uid),
      })

      try {
        await addDoc(collection(db, "groups", groupId, "feed"), {
          type: "join",
          title: "memberJoined",
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          createdByName: user.displayName || user.email || "Someone",
        })
      } catch (e) {
        console.warn("Failed to write join activity:", e)
      }
  
      toast({
        title: t("joinedTitle"),
        description: t("joinedDesc"),
      })
  
      setJoinGroupOpen(false)
      setJoinCode("")
      router.push(`/groups/${groupId}`)
    } catch (error: any) {
      console.error("Failed to join group:", error)
      toast({
        title: t("genericErrorTitle"),
        description: t("genericErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  

  

  const handleArchiveGroup = async (group: Group, isActive: boolean) => {
    try {
      await updateDoc(doc(db, "groups", group.id), {
        isActive: isActive
      })
      
      toast({
        title: isActive ? t("unarchiveSuccess") : t("archiveSuccess"),
        description: group.name,
      })
    } catch (error) {
      console.error("Failed to update group status:", error)
      toast({
        title: t("genericErrorTitle"),
        description: t("failedToUpdate"),
        variant: "destructive",
      })
    }
  }

  const filteredGroups = groups.filter((group) => {
    if (activeTab === "active") return group.isActive
    if (activeTab === "archived") return !group.isActive
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-4xl p-3 sm:p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-4xl p-3 sm:p-6 space-y-3 sm:space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-4xl p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{t("myGroups")}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {groups.filter((g) => g.isActive).length} {t("activeGroups")}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1 sm:flex-none h-10 sm:h-9">
                  <Plus className="mr-1 h-4 w-4" />
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
                      placeholder={t("enterGroupNamePlaceholder")}
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

            <Dialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-10 sm:h-9 bg-transparent">
                  <Link className="mr-1 h-4 w-4" />
                  {t("joinViaCode")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("joinGroup")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="join-code">{t("inviteCode")}</Label>
                    <Input
                      id="join-code"
                      placeholder={t("enterInviteCodePlaceholder")}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleJoinGroup} className="w-full" disabled={loading || !joinCode.trim()}>
                  {loading ? t("joining") : t("joinGroup")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-3 sm:mb-4">
            <TabsTrigger value="active" className="flex-1 sm:flex-none">
              {t("activeTab")}
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1 sm:flex-none">
              {t("archivedTab")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors relative group"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{group.memberCount}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{formatMoney(group.totalExpenses)}</span>
                            </div>
                          </div>
                        </div>
                        {group.yourBalance !== 0 && (
                          <Badge
                            variant={group.yourBalance >= 0 ? "default" : "secondary"}
                            className={`shrink-0 ${
                              group.yourBalance >= 0
                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-400"
                                : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-400"
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              {group.yourBalance >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span>
                                {group.yourBalance >= 0 ? "+" : ""}
                                {formatMoney(Math.abs(group.yourBalance))}
                              </span>
                            </div>
                          </Badge>
                        )}
                      </div>

                       {/* Dropdown Menu for Active Groups */}
                       <div className="absolute top-2 right-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-background/80"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={(e) => {
                                handleArchiveGroup(group, false)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              {t("archiveGroup")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="border-t pt-2 sm:pt-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <p className="truncate flex-1">{group.lastActivity}</p>
                          <span className="shrink-0">{formatTime(group.lastActivityTime)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Users}
                title={t("noActiveGroups")}
                description={t("createGroupDesc")}
                action={
                  <Button onClick={() => setCreateGroupOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("createFirstGroup")}
                  </Button>
                }
                secondaryAction={
                  <Button variant="outline" onClick={() => setJoinGroupOpen(true)}>
                    {t("joinGroup")}
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {[1, 2].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors opacity-75 relative group"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{group.memberCount}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{formatMoney(group.totalExpenses)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Menu for Archived Groups */}
                      <div className="absolute top-2 right-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-background/80"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={(e) => {
                                handleArchiveGroup(group, true)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              {t("unarchiveGroup")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="border-t pt-2 sm:pt-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <p className="truncate flex-1">{group.lastActivity}</p>
                          <span className="shrink-0">{formatTime(group.lastActivityTime)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Archive}
                title={t("noArchivedGroups")}
                description="Arşivlediğin gruplar burada görünecek."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border z-50">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => router.push("/groups")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              aria-label={t("navGroups")}
            >
              <Wallet className="h-6 w-6 text-green-600" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label={t("navHome")}
            >
              <Home className="h-6 w-6 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label={t("navProfile")}
            >
              <User className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
