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
import { Plus, Users, DollarSign, TrendingUp, TrendingDown, Link, Home, Wallet, User, Clock } from "lucide-react"

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
              name: data.name ?? "Unnamed group",
              memberCount: memberIds.length || 1,
              totalExpenses: 0,
              yourBalance: 0,
              lastActivity: "Group created",
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

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a group name",
        variant: "destructive",
      })
      return
    }

    const name = groupName.trim()
    setLoading(true)

    try {
      const { groupId } = await createGroup(name)

      toast({
        title: "Group created",
        description: `${name} has been created successfully`,
      })

      setCreateGroupOpen(false)
      setGroupName("")
      router.push(`/groups/${groupId}`)
    } catch (error) {
      console.error("Failed to create group:", error)
      toast({
        title: "Error",
        description: "Something went wrong while creating the group. Please try again.",
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
        title: "Login required",
        description: "Please sign in to join a group.",
        variant: "destructive",
      })
      return
    }
  
    if (!inviteCode) {
      toast({
        title: "Enter a code",
        description: "Please paste the invite code.",
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
          title: "Invalid code",
          description: "No invite found for this code.",
          variant: "destructive",
        })
        return
      }
  
      const invite = inviteSnap.data() as any
      if (invite.disabled) {
        toast({
          title: "Invite disabled",
          description: "This invite code is no longer active.",
          variant: "destructive",
        })
        return
      }
  
      const groupId = invite.groupId as string
      if (!groupId) {
        toast({
          title: "Invite error",
          description: "Invite is missing group information.",
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
          title: "Member joined",
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          createdByName: user.displayName || user.email || "Someone",
        })
      } catch (e) {
        console.warn("Failed to write join activity:", e)
      }
  
      toast({
        title: "Joined!",
        description: "You have joined the group.",
      })
  
      setJoinGroupOpen(false)
      setJoinCode("")
      router.push(`/groups/${groupId}`)
    } catch (error: any) {
      console.error("Failed to join group:", error)
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
              <h1 className="text-xl sm:text-2xl font-bold">My Groups</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {groups.filter((g) => g.isActive).length} active groups
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1 sm:flex-none h-10 sm:h-9">
                  <Plus className="mr-1 h-4 w-4" />
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
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-10 sm:h-9 bg-transparent">
                  <Link className="mr-1 h-4 w-4" />
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
                  <Button onClick={handleJoinGroup} className="w-full" disabled={loading || !joinCode.trim()}>
                  {loading ? "Joining..." : "Join Group"}
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
              Active
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex-1 sm:flex-none">
              Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 sm:space-y-4">
            {filteredGroups.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors"
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
                              <span>{formatCurrency(group.totalExpenses)}</span>
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
                                {formatCurrency(Math.abs(group.yourBalance))}
                              </span>
                            </div>
                          </Badge>
                        )}
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
              <Card className="p-8 sm:p-12 text-center">
                <div className="mx-auto max-w-md space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">No active groups</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Create a group to start tracking expenses with friends and family.
                    </p>
                  </div>
                  <Button onClick={() => setCreateGroupOpen(true)} className="h-11 sm:h-10">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Group
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-3 sm:space-y-4">
            {filteredGroups.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors opacity-75"
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
                              <span>{formatCurrency(group.totalExpenses)}</span>
                            </div>
                          </div>
                        </div>
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
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No archived groups</p>
              </Card>
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
              aria-label="Groups"
            >
              <Wallet className="h-6 w-6 text-green-600" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label="Home"
            >
              <Home className="h-6 w-6 text-muted-foreground" />
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
