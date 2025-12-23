/* eslint-disable */
"use client"
import {
  doc,
  updateDoc,
  onSnapshot,
  runTransaction,
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs,
  limit,
} from "firebase/firestore"
import { db ,auth } from "@/lib/firebase"

import { useEffect, useState, useRef, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/lib/settings-context"
import {
  ArrowLeft,
  Plus,
  Send,
  DollarSign,
  Users,
  BarChart3,
  MoreVertical,
  Trash2,
  Edit,
  Zap,
  Droplets,
  ShoppingCart,
  Wifi,
  Home,
  Bus,
  Utensils,
  Film,
  Tag,
  Copy,
  Link,
  Crown,
  UserMinus,
  CheckCircle,
} from "lucide-react"

type GroupDoc = {
  name: string
  memberIds: string[]
  totalAmount: number
  createdBy: string
  balances: Record<string, number>
}

type FeedItem = {
  id: string
  type: "message" | "expense"
  createdAt: Date
  createdBy: string
  // Message fields
  text?: string
  // Expense fields
  title?: string
  amountCents?: number
  payerUid?: string
  participantIds?: string[]
  splitCents?: Record<string, number>
  category?: string
  receiptUrl?: string
}

type UserProfile = {
  displayName: string
  email: string
}

const MOCK_USERS: Record<string, UserProfile> = {
  user1: { displayName: "Alice Johnson", email: "alice@example.com" },
  user2: { displayName: "Bob Smith", email: "bob@example.com" },
  user3: { displayName: "Charlie Davis", email: "charlie@example.com" },
}

const CATEGORY_OPTIONS = [
  { value: "Electricity", label: "Electricity", icon: Zap },
  { value: "Water", label: "Water", icon: Droplets },
  { value: "Groceries", label: "Groceries/Market", icon: ShoppingCart },
  { value: "Internet", label: "Internet", icon: Wifi },
  { value: "Rent", label: "Rent", icon: Home },
  { value: "Transport", label: "Transport", icon: Bus },
  { value: "Dining", label: "Dining", icon: Utensils },
  { value: "Entertainment", label: "Entertainment", icon: Film },
  { value: "Other", label: "Other", icon: Tag },
  { value: "Custom", label: "Custom", icon: Tag },
]

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { formatMoney, settings } = useSettings()
  const groupId = params?.id as string
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState<GroupDoc | null>(null)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [userProfiles] = useState<Record<string, UserProfile>>(MOCK_USERS)
  const [messageText, setMessageText] = useState("")
  const [sending, setSending] = useState(false)

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [addingExpense, setAddingExpense] = useState(false)
  const addExpenseRequestIdRef = useRef<string | null>(null)
  const [expenseTitle, setExpenseTitle] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [categoryMode, setCategoryMode] = useState<"select" | "custom">("select")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal")
  const [customSplitAmounts, setCustomSplitAmounts] = useState<Record<string, string>>({})

  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  const [expenseDetailOpen, setExpenseDetailOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<FeedItem | null>(null)

  const [kickMemberDialog, setKickMemberDialog] = useState(false)
  const [transferOwnerDialog, setTransferOwnerDialog] = useState(false)
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<string | null>(null)
  const [leaveGroupDialog, setLeaveGroupDialog] = useState(false)
  const [deleteGroupDialog, setDeleteGroupDialog] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<Record<string, Record<string, boolean>>>({})

  const [paymentMember, setPaymentMember] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")

  const currentUid = auth.currentUser?.uid ?? ""

  useEffect(() => {
    if (!groupId) return
  
    const unsub = onSnapshot(doc(db, "groups", groupId), (snap) => {
      if (!snap.exists()) {
        setGroup(null)
        setLoading(false)
        return
      }
  
      setGroup(snap.data() as GroupDoc)
      setLoading(false)
    })
  
    return () => unsub()
  }, [groupId])

  useEffect(() => {
    if (!groupId) return

    const q = query(collection(db, "groups", groupId, "feed"), orderBy("createdAt", "asc"))
    const unsub = onSnapshot(q, (snap) => {
      const items: FeedItem[] = snap.docs
        .map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            type: data.type,
            createdAt: toDateSafe(data.createdAt),
            createdBy: data.createdBy,
            text: data.text,
            title: data.title,
            amountCents: data.amountCents,
            payerUid: data.payerUid,
            participantIds: data.participantIds,
            splitCents: data.splitCents,
            category: data.category,
            receiptUrl: data.receiptUrl,
          } as FeedItem
        })
        .filter((x) => x.type === "message" || x.type === "expense")

      setFeedItems(items)
    })

    return () => unsub()
  }, [groupId])

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [feedItems, autoScroll])

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || sending) return

    const text = messageText.trim()
    setMessageText("")
    setSending(true)

    try {
      await addDoc(collection(db, "groups", groupId, "feed"), {
        type: "message",
        createdAt: serverTimestamp(),
        createdBy: currentUid,
        text,
      })

      toast({
        title: "Message sent",
      })
    } catch (err) {
      console.error("Failed to send message:", err)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleAddExpense = async () => {
    if (addingExpense) return

    const title = expenseTitle.trim()
    const amountTRY = Number.parseFloat(expenseAmount)

    if (!title || !amountTRY || amountTRY <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid title and amount",
        variant: "destructive",
      })
      return
    }
    setAddingExpense(true)

    // stable request id for this submission (idempotency)
    if (!addExpenseRequestIdRef.current) {
      const uuid = (globalThis as any)?.crypto?.randomUUID?.()
      addExpenseRequestIdRef.current =
        uuid || `${currentUid}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    }
    const requestId = addExpenseRequestIdRef.current

    const participants = selectedParticipants.length > 0 ? selectedParticipants : [currentUid]
    const totalCents = Math.round(amountTRY * 100)

    const participantIds = [...participants].sort()
    const splitCents: Record<string, number> = {}

    if (splitMode === "custom") {
      // Validate and use custom split amounts
      let customTotal = 0
      for (const uid of participantIds) {
        const customAmount = Number.parseFloat(customSplitAmounts[uid] || "0")
        if (customAmount <= 0) {
          toast({
            title: "Invalid split amount",
            description: `Please enter a valid amount for ${getUserName(uid)}`,
            variant: "destructive",
          })
          return
        }
        const customCents = Math.round(customAmount * 100)
        splitCents[uid] = customCents
        customTotal += customCents
      }

      // Check if custom amounts sum to total
      if (Math.abs(customTotal - totalCents) > participantIds.length) {
        toast({
          title: "Split amounts don't match",
          description: `Split amounts (${formatMoney(customTotal)}) must equal total (${formatMoney(totalCents)})`,
          variant: "destructive",
        })
        return
      }

      // Adjust for rounding differences
      const diff = totalCents - customTotal
      if (diff !== 0) {
        splitCents[participantIds[0]] += diff
      }
    } else {
      // Equal split logic 
      const n = participantIds.length
      const base = Math.floor(totalCents / n)
      let remainder = totalCents - base * n

      for (const uid of participantIds) {
        const extra = remainder > 0 ? 1 : 0
        splitCents[uid] = base + extra
        if (remainder > 0) remainder--
      }
    }

    try {
      await runTransaction(db, async (tx) => {
        const groupRef = doc(db, "groups", groupId)
        const snap = await tx.get(groupRef)
        if (!snap.exists()) throw new Error("GROUP_NOT_FOUND")

        const data = snap.data() as any
        const currentBalances: Record<string, number> = data.balances || {}

        const nextBalances: Record<string, number> = { ...currentBalances }
        const payerShare = splitCents[currentUid] || 0
        nextBalances[currentUid] = (nextBalances[currentUid] || 0) + (totalCents - payerShare)

        for (const uid of participantIds) {
          if (uid === currentUid) continue
          nextBalances[uid] = (nextBalances[uid] || 0) - (splitCents[uid] || 0)
        }

        const feedRef = doc(db, "groups", groupId, "feed", requestId)
        tx.set(feedRef, {
          type: "expense",
          createdAt: serverTimestamp(),
          createdBy: currentUid,
          title,
          amountCents: totalCents,
          payerUid: currentUid,
          participantIds,
          splitCents,
          category: expenseCategory || null,
          clientRequestId: requestId,
        })

        tx.update(groupRef, {
          balances: nextBalances,
          totalAmount: (data.totalAmount || 0) + totalCents,
        })
      })

      toast({
        title: "Expense added",
        description: `${title} - ${formatMoney(totalCents)}`,
      })

      setExpenseTitle("")
      setExpenseAmount("")
      setExpenseCategory("")
      setCategoryMode("select")
      setSelectedParticipants([])
      setSplitMode("equal")
      setCustomSplitAmounts({})
      setExpenseDialogOpen(false)
    } catch (err) {
      console.error("Failed to add expense:", err)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingExpense(false)
      addExpenseRequestIdRef.current = null
    }
  }

  
  const handleGenerateInviteCode = async () => {
    if (!currentUid || !groupId) {
      toast({
        title: "Error",
        description: "You must be signed in to generate an invite code.",
        variant: "destructive",
      })
      return
    }
  
    try {
      // 1) Bu grup için zaten aktif bir kod var mı? varsa onu kullan
      const existingQ = query(
        collection(db, "groupInvites"),
        where("groupId", "==", groupId),
        where("disabled", "==", false),
        limit(1)
      )
  
      const existingSnap = await getDocs(existingQ)
      if (!existingSnap.empty) {
        const existingCode = existingSnap.docs[0].id
        setInviteCode(existingCode)
        toast({
          title: "Invite code ready",
          description: "Bu grup için zaten aktif bir davet kodu var.",
        })
        return
      }
  
      // 2) Yoksa yeni kod üret ve kaydet
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
  
      await setDoc(doc(db, "groupInvites", code), {
        groupId,
        createdBy: currentUid,
        createdAt: serverTimestamp(),
        disabled: false,
      })
  
      setInviteCode(code)
      toast({
        title: "Invite code generated",
        description: "Share this code with others to join the group",
      })
    } catch (err) {
      console.error("Failed to generate invite code:", err)
      toast({
        title: "Error",
        description: "Failed to generate invite code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      toast({
        title: "Copied to clipboard",
        description: "Invite code copied successfully",
      })
    }
  }

  const handleExpenseClick = (expense: FeedItem) => {
    setSelectedExpense(expense)
    setExpenseDetailOpen(true)
  }

  const handleKickMember = async (uid: string) => {
    const me = currentUid
    if (!me || !group) return

    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, "groups", groupId)
        const snap = await tx.get(ref)
        if (!snap.exists()) throw new Error("GROUP_NOT_FOUND")

        const data = snap.data() as any
        const memberIds: string[] = Array.isArray(data.memberIds) ? data.memberIds : []

        // Only owner can kick
        if (data.createdBy !== me) throw new Error("NOT_OWNER")

        // If target is not a member, no-op
        if (!memberIds.includes(uid)) return

        // Prevent kicking the owner
        if (uid === data.createdBy) throw new Error("CANNOT_KICK_OWNER")

        const next = memberIds.filter((m) => m !== uid)
        tx.update(ref, { memberIds: next })
      })

      toast({
        title: "Member removed",
        description: `${getUserName(uid)} has been removed from the group`,
      })
    } catch (e: any) {
      console.error("Failed to remove member:", e)
      toast({
        title: "Error",
        description:
          e?.message === "NOT_OWNER"
            ? "Only the group owner can remove members."
            : e?.message === "CANNOT_KICK_OWNER"
              ? "You cannot remove the group owner."
              : "Failed to remove member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setKickMemberDialog(false)
      setSelectedMemberForAction(null)
    }
  }

  const handleTransferOwnership = async (uid: string) => {
    if (!group) return

    try {
      await updateDoc(doc(db, "groups", groupId), {
        createdBy: uid,
      })

      toast({
        title: "Ownership transferred",
        description: `${getUserName(uid)} is now the group owner`,
      })
    } catch (error) {
      console.error("Failed to transfer ownership:", error)
      toast({
        title: "Error",
        description: "Failed to transfer ownership. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTransferOwnerDialog(false)
      setSelectedMemberForAction(null)
    }
  }

  const handleLeaveGroup = async () => {
    const uid = currentUid
    if (!uid || !group) return
  
    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, "groups", groupId)
        const snap = await tx.get(ref)
        if (!snap.exists()) return
  
        const data = snap.data() as GroupDoc
        const memberIds = Array.isArray(data.memberIds) ? data.memberIds : []
  
        if (!memberIds.includes(uid)) return
  
        const remaining = memberIds.filter((m) => m !== uid)
        const isOwner = data.createdBy === uid
  
        // Owner + başka üyeler varsa çıkamaz
        if (isOwner && remaining.length > 0) {
          throw new Error("OWNER_MUST_TRANSFER")
        }
  
        // Son kişi çıkıyorsa → grup silinir
        if (remaining.length === 0) {
          tx.delete(ref)
          return
        }
  
        // Normal leave
        tx.update(ref, { memberIds: remaining })
      })
  
      toast({
        title: "Left group",
        description: `You have left ${group.name}`,
      })
  
      setLeaveGroupDialog(false)
      router.push("/groups")
    } catch (e: any) {
      if (e?.message === "OWNER_MUST_TRANSFER") {
        toast({
          title: "Transfer ownership first",
          description: "You're the group owner. Transfer ownership to someone else before leaving.",
          variant: "destructive",
        })
        setLeaveGroupDialog(false)
        setMemberDialogOpen(true)
        return
      }
  
      console.error(e)
      toast({
        title: "Error",
        description: "Something went wrong while leaving the group.",
        variant: "destructive",
      })
    }
  }

  const handleTogglePayment = (expenseId: string, userId: string) => {
    setPaymentStatus((prev) => ({
      ...prev,
      [expenseId]: {
        ...(prev[expenseId] || {}),
        [userId]: !(prev[expenseId]?.[userId] || false),
      },
    }))

    const isPaid = !(paymentStatus[expenseId]?.[userId] || false)
    toast({
      title: isPaid ? "Marked as paid" : "Marked as unpaid",
      description: `${getUserName(userId)} ${isPaid ? "has paid" : "hasn't paid"} their share`,
    })
  }

  const handleRecordPayment = () => {
    if (!paymentMember || !paymentAmount || !group) return

    const amountTRY = Number.parseFloat(paymentAmount)
    if (amountTRY <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    const amountCents = Math.round(amountTRY * 100)
    const balances = { ...group.balances }

    // Update balances: the payer's debt decreases, current user's credit decreases
    balances[paymentMember] = (balances[paymentMember] || 0) + amountCents
    balances[currentUid] = (balances[currentUid] || 0) - amountCents

    setGroup({ ...group, balances })

    toast({
      title: "Payment recorded",
      description: `${getUserName(paymentMember)} paid you ${formatMoney(amountCents)}`,
    })

    setPaymentMember("")
    setPaymentAmount("")
  }

  const toDateSafe = (v: any): Date => {
    if (!v) return new Date(0)
    if (v instanceof Date) return v
    if (v?.toDate && typeof v.toDate === "function") return v.toDate()
    if (typeof v === "number") return new Date(v)
    return new Date(0)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUserName = (uid: string) => {
    return userProfiles[uid]?.displayName || uid.slice(0, 8)
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 space-y-4 p-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6">
          <p className="text-destructive">Group not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const isOwner = currentUid === group.createdBy
  const memberIds = group.memberIds || []
  const balances = group.balances || {}
  const myBalance = balances[currentUid || ""] || 0

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 sm:h-9 sm:w-9">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-base font-semibold sm:text-lg">{group.name || "Group"}</h1>
                <p className="text-xs text-muted-foreground sm:text-sm">{memberIds.length} members</p>
              </div>
            </div>
            
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <BarChart3 className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-3">
                  <p className="mb-2 text-sm font-semibold">Your Balance</p>
                  <p className={`text-2xl font-bold sm:text-xl ${myBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatMoney(myBalance)}
                  </p>
                  <p className="mt-1 sm:mt-2 text-xs text-muted-foreground">
                    {myBalance >= 0 ? "You are owed" : "You owe"}
                  </p>
                </div>
                <div className="border-t p-2">
                  {memberIds.map((uid) => (
                    <div key={uid} className="flex items-center justify-between py-2 text-sm sm:text-base">
                      <span>{getUserName(uid)}</span>
                      <span className={(balances[uid] || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatMoney(balances[uid] || 0)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-semibold">Record Payment</p>
                  </div>
                  <div className="space-y-2">
                    <Select value={paymentMember} onValueChange={setPaymentMember}>
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="Who paid you?" />
                      </SelectTrigger>
                      <SelectContent>
                        {memberIds
                          .filter((uid) => uid !== currentUid)
                          .map((uid) => (
                            <SelectItem key={uid} value={uid}>
                              {getUserName(uid)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Amount (${settings.currency})`}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="h-9"
                    />
                    <Button
                      onClick={handleRecordPayment}
                      disabled={!paymentMember || !paymentAmount}
                      className="w-full h-9"
                      size="sm"
                    >
                      Record Payment
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <Users className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                  Members
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Group Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {memberIds.map((uid) => (
                      <div key={uid} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex-1">
                          <p className="font-medium">{getUserName(uid)}</p>
                          <p className="text-sm text-muted-foreground">{userProfiles[uid]?.email || ""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {uid === group.createdBy && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded">
                              <Crown className="h-3 w-3" />
                              <span>Owner</span>
                            </div>
                          )}
                          {isOwner && uid !== currentUid && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMemberForAction(uid)
                                    setTransferOwnerDialog(true)
                                  }}
                                >
                                  <Crown className="mr-2 h-4 w-4" />
                                  Transfer Ownership
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedMemberForAction(uid)
                                    setKickMemberDialog(true)
                                  }}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <Label>Invite Code</Label>
                    <p className="text-xs text-muted-foreground mb-2">Generate a code to share with others</p>
                    {!inviteCode ? (
                      <Button onClick={handleGenerateInviteCode} variant="outline" className="w-full bg-transparent">
                        <Link className="mr-2 h-4 w-4" />
                        Generate Invite Code
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input value={inviteCode} readOnly className="font-mono" />
                        <Button onClick={handleCopyInviteCode} size="icon" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  

                  {isOwner && memberIds.length > 1 && (
                    <div className="border-t pt-4">
                      <Label>Leave Group</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        You're the group owner. Transfer ownership to someone else before leaving.
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Transfer ownership first",
                            description: "You're the group owner. Transfer ownership to someone else before leaving.",
                            variant: "destructive",
                          })
                        }}
                      >
                        Leave Group
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Use the <span className="font-medium">⋮</span> menu next to a member to transfer ownership.
                      </p>
                    </div>
                  )}
                  {(!isOwner || memberIds.length === 1) && (
                    <div className="border-t pt-4">
                      <Label>Leave Group</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        {memberIds.length === 1
                          ? "You're the last member. Leaving will permanently delete this group."
                          : "You can leave this group anytime."}
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          setMemberDialogOpen(false)
                          if (memberIds.length === 1) {
                            setDeleteGroupDialog(true)
                          } else {
                            setLeaveGroupDialog(true)
                          }
                        }}
                      >
                        Leave Group
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <ScrollArea
        ref={scrollRef}
        className="flex-1 p-3 sm:p-4"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement
          const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50
          setAutoScroll(isAtBottom)
        }}
      >
        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          {feedItems.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            feedItems.map((item, index) => {
              const prevItem = index > 0 ? feedItems[index - 1] : null
              const showAuthor = !prevItem || prevItem.createdBy !== item.createdBy || prevItem.type !== item.type

              if (item.type === "message") {
                const isMe = item.createdBy === currentUid
                return (
                  <div key={item.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                      {showAuthor && (
                        <p className="mb-1 px-3 text-xs text-muted-foreground">{getUserName(item.createdBy)}</p>
                      )}
                      <div
                        className={`rounded-2xl px-3 py-2 sm:px-4 ${
                          isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{item.text}</p>
                        <p className={`mt-1 text-xs ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {formatTime(toDateSafe(item.createdAt))}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              } else {
                const categoryOption = CATEGORY_OPTIONS.find((opt) => opt.value === item.category)
                const CategoryIcon = categoryOption?.icon || DollarSign

                return (
                  <Card
                    key={item.id}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleExpenseClick(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base truncate">{item.title}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              Paid by {getUserName(item.payerUid || "")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-xl sm:text-2xl font-bold">{formatMoney(item.amountCents || 0)}</p>
                            {item.category && (
                              <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
                            )}
                          </div>
                          <div className="sm:text-right">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Split between {item.participantIds?.length || 0} people
                            </p>
                            <p className="text-xs text-muted-foreground">{formatTime(toDateSafe(item.createdAt))}</p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                )
              }
            })
          )}
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 border-t bg-card p-3 sm:p-4 z-10">
        <form onSubmit={handleSendMessage} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" size="icon" variant="outline" className="h-11 w-11 shrink-0 bg-transparent">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expense-title">Description</Label>
                    <Input
                      id="expense-title"
                      placeholder="Groceries, dinner, etc."
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-amount">Amount ({settings.currency})</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="150.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-category">Category (optional)</Label>
                    <Select
                      value={categoryMode === "custom" ? "Custom" : expenseCategory || ""}
                      onValueChange={(value) => {
                        if (value === "Custom") {
                          setCategoryMode("custom")
                          setExpenseCategory("")
                        } else {
                          setCategoryMode("select")
                          setExpenseCategory(value)
                        }
                      }}
                    >
                      <SelectTrigger id="expense-category" className="w-full">
                        <SelectValue placeholder="Select a category">
                          {expenseCategory && categoryMode === "select" && (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const option = CATEGORY_OPTIONS.find((opt) => opt.value === expenseCategory)
                                const Icon = option?.icon
                                return (
                                  <>
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span>{option?.label}</span>
                                  </>
                                )
                              })()}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => {
                          const Icon = option.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {categoryMode === "custom" && (
                      <Input
                        placeholder="Enter custom category"
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <Label>Split with</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {memberIds.map((uid) => (
                        <Button
                          key={uid}
                          size="sm"
                          variant={selectedParticipants.includes(uid) ? "default" : "outline"}
                          onClick={() => {
                            setSelectedParticipants((prev) => {
                              const newParticipants = prev.includes(uid)
                                ? prev.filter((id) => id !== uid)
                                : [...prev, uid]

                              if (splitMode === "custom") {
                                setCustomSplitAmounts({})
                              }

                              return newParticipants
                            })
                          }}
                        >
                          {getUserName(uid)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedParticipants.length > 0 && (
                    <div className="border-t pt-4">
                      <Label>Split Mode</Label>
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={splitMode === "equal" ? "default" : "outline"}
                          onClick={() => {
                            setSplitMode("equal")
                            setCustomSplitAmounts({})
                          }}
                          className="flex-1"
                        >
                          Equal Split
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={splitMode === "custom" ? "default" : "outline"}
                          onClick={() => setSplitMode("custom")}
                          className="flex-1"
                        >
                          Custom Split
                        </Button>
                      </div>

                      {splitMode === "custom" && (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Enter custom amounts for each person (must sum to total)
                          </p>
                          {selectedParticipants.map((uid) => (
                            <div key={uid} className="flex items-center gap-2">
                              <Label className="flex-1 text-sm">{getUserName(uid)}</Label>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">{settings.currency}</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={customSplitAmounts[uid] || ""}
                                  onChange={(e) => {
                                    setCustomSplitAmounts((prev) => ({
                                      ...prev,
                                      [uid]: e.target.value,
                                    }))
                                  }}
                                  className="w-28"
                                />
                              </div>
                            </div>
                          ))}
                          {expenseAmount && (
                            <div className="flex items-center justify-between text-sm pt-2 border-t">
                              <span className="font-medium">Total:</span>
                              <span className="font-bold">
                                {formatMoney(
                                  Math.round(
                                    Object.values(customSplitAmounts).reduce(
                                      (sum, val) => sum + (Number.parseFloat(val) || 0),
                                      0,
                                    ) * 100,
                                  ),
                                )}{" "}
                                /{" "}
                                {formatMoney(Math.round((Number.parseFloat(expenseAmount || "0") || 0) * 100))}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Button onClick={handleAddExpense} className="w-full" disabled={addingExpense}>
                    {addingExpense ? "Adding..." : "Add Expense"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Textarea
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              className="min-h-[44px] max-h-32 resize-none text-sm sm:text-base"
              rows={1}
            />
            <Button type="submit" size="icon" disabled={!messageText.trim() || sending} className="h-11 w-11 shrink-0">
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <p className="mt-1 sm:mt-2 text-xs text-muted-foreground hidden sm:block">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>

      <Dialog open={expenseDetailOpen} onOpenChange={setExpenseDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[92vw] max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Expense Details</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold truncate">{selectedExpense.title}</h3>
                    {selectedExpense.category && (
                      <p className="text-xs sm:text-sm text-muted-foreground">{selectedExpense.category}</p>
                    )}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{formatMoney(selectedExpense.amountCents || 0)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {toDateSafe(selectedExpense.createdAt).toLocaleDateString()} at {formatTime(toDateSafe(selectedExpense.createdAt))}
                </p>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Paid by</h4>
                <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {getUserName(selectedExpense.payerUid || "")}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {userProfiles[selectedExpense.payerUid || ""]?.email}
                    </p>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-green-600 ml-2 shrink-0">
                    {formatMoney(selectedExpense.amountCents || 0)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4">
                <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                  Split between {selectedExpense.participantIds?.length || 0} people
                </h4>
                <div className="space-y-2">
                  {selectedExpense.participantIds?.map((uid) => {
                    const splitAmount = selectedExpense.splitCents?.[uid] || 0
                    const isPayer = uid === selectedExpense.payerUid
                    const hasPaid = paymentStatus[selectedExpense.id]?.[uid] || false

                    return (
                      <div
                        key={uid}
                        className={`flex items-center justify-between gap-2 rounded-lg border p-3 sm:p-4 ${
                          isPayer
                            ? "bg-muted"
                            : hasPaid
                              ? "bg-green-50 dark:bg-green-950/20"
                              : "bg-red-50 dark:bg-red-950/20"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{getUserName(uid)}</p>
                          <p className="text-xs text-muted-foreground">
                            {isPayer ? "Paid the full amount" : hasPaid ? "Paid their share" : "Owes the payer"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <p className="font-semibold text-sm sm:text-base">{formatMoney(splitAmount)}</p>
                            {isPayer && (
                              <p className="text-xs text-green-600">
                                +{formatMoney((selectedExpense.amountCents || 0) - splitAmount)}
                              </p>
                            )}
                          </div>
                          {!isPayer && (
                            <Button
                              size="sm"
                              variant={hasPaid ? "outline" : "default"}
                              className={`h-8 px-3 text-xs ${
                                hasPaid
                                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                              onClick={() => handleTogglePayment(selectedExpense.id, uid)}
                            >
                              {hasPaid ? "✓ Paid" : "Mark Paid"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-t pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent h-11 sm:h-10"
                  onClick={() => setExpenseDetailOpen(false)}
                >
                  Close
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent h-11 sm:h-10">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" className="flex-1 h-11 sm:h-10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={transferOwnerDialog} onOpenChange={setTransferOwnerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer ownership to{" "}
              {selectedMemberForAction && getUserName(selectedMemberForAction)}? You will no longer be the group owner
              and won't be able to manage members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMemberForAction && handleTransferOwnership(selectedMemberForAction)}
            >
              Transfer Ownership
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={leaveGroupDialog} onOpenChange={setLeaveGroupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave {group.name}? You will lose access to this group's activity and balances.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteGroupDialog} onOpenChange={setDeleteGroupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              You're the last member. Deleting {group.name} will permanently remove this group. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setDeleteGroupDialog(false)
                await handleLeaveGroup()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
