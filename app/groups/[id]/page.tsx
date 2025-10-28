"use client"

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

const MOCK_GROUP: GroupDoc = {
  name: "Weekend Trip",
  memberIds: ["user1", "user2", "user3"],
  totalAmount: 45000,
  createdBy: "user1",
  balances: {
    user1: 5000,
    user2: -2500,
    user3: -2500,
  },
}

const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: "1",
    type: "message",
    createdAt: new Date(Date.now() - 3600000),
    createdBy: "user1",
    text: "Hey everyone! Ready for the trip?",
  },
  {
    id: "2",
    type: "expense",
    createdAt: new Date(Date.now() - 3000000),
    createdBy: "user1",
    title: "Hotel Booking",
    amountCents: 30000,
    payerUid: "user1",
    participantIds: ["user1", "user2", "user3"],
    splitCents: { user1: 10000, user2: 10000, user3: 10000 },
    category: "Accommodation",
  },
  {
    id: "3",
    type: "message",
    createdAt: new Date(Date.now() - 2400000),
    createdBy: "user2",
    text: "Looks great! I'll bring snacks.",
  },
  {
    id: "4",
    type: "expense",
    createdAt: new Date(Date.now() - 1800000),
    createdBy: "user2",
    title: "Gas for the car",
    amountCents: 15000,
    payerUid: "user2",
    participantIds: ["user1", "user2", "user3"],
    splitCents: { user1: 5000, user2: 5000, user3: 5000 },
    category: "Transport",
  },
  {
    id: "5",
    type: "message",
    createdAt: new Date(Date.now() - 1200000),
    createdBy: "user3",
    text: "Perfect! What time should we leave?",
  },
]

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
  const [expenseTitle, setExpenseTitle] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [categoryMode, setCategoryMode] = useState<"select" | "custom">("select")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal")
  const [customSplitAmounts, setCustomSplitAmounts] = useState<Record<string, string>>({})

  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  const [expenseDetailOpen, setExpenseDetailOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<FeedItem | null>(null)

  const [kickMemberDialog, setKickMemberDialog] = useState(false)
  const [transferOwnerDialog, setTransferOwnerDialog] = useState(false)
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<string | null>(null)
  const [leaveGroupDialog, setLeaveGroupDialog] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<Record<string, Record<string, boolean>>>({})

  const [paymentMember, setPaymentMember] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")

  const currentUid = "user1"

  useEffect(() => {
    setTimeout(() => {
      setGroup(MOCK_GROUP)
      setFeedItems(MOCK_FEED_ITEMS)
      setLoading(false)
    }, 500)
  }, [])

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

    setTimeout(() => {
      const newMessage: FeedItem = {
        id: `msg-${Date.now()}`,
        type: "message",
        createdAt: new Date(),
        createdBy: currentUid,
        text,
      }
      setFeedItems((prev) => [...prev, newMessage])
      setSending(false)
      toast({
        title: "Message sent",
      })
    }, 300)
  }

  const handleAddExpense = async () => {
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
          description: `Split amounts (₺${(customTotal / 100).toFixed(2)}) must equal total (₺${amountTRY.toFixed(2)})`,
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

    const newExpense: FeedItem = {
      id: `exp-${Date.now()}`,
      type: "expense",
      createdAt: new Date(),
      createdBy: currentUid,
      title,
      amountCents: totalCents,
      payerUid: currentUid,
      participantIds,
      splitCents,
      category: expenseCategory || undefined,
    }

    setFeedItems((prev) => [...prev, newExpense])

    // Update balances
    if (group) {
      const balances = { ...group.balances }
      const payerShare = splitCents[currentUid] || 0
      balances[currentUid] = (balances[currentUid] || 0) + (totalCents - payerShare)

      for (const uid of participantIds) {
        if (uid === currentUid) continue
        balances[uid] = (balances[uid] || 0) - (splitCents[uid] || 0)
      }

      setGroup({ ...group, balances })
    }

    toast({
      title: "Expense added",
      description: `${title} - ₺${amountTRY.toFixed(2)}`,
    })

    setExpenseTitle("")
    setExpenseAmount("")
    setExpenseCategory("")
    setCategoryMode("select")
    setSelectedParticipants([])
    setSplitMode("equal")
    setCustomSplitAmounts({})
    setExpenseDialogOpen(false)
  }

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return

    toast({
      title: "Member added",
      description: `Invitation sent to ${memberEmail}`,
    })
    setMemberDialogOpen(false)
    setMemberEmail("")
  }

  const handleGenerateInviteCode = () => {
    const code = `${groupId}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    setInviteCode(code)
    toast({
      title: "Invite code generated",
      description: "Share this code with others to join the group",
    })
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

  const handleKickMember = (uid: string) => {
    if (!group) return

    const updatedMemberIds = group.memberIds.filter((id) => id !== uid)
    setGroup({ ...group, memberIds: updatedMemberIds })

    toast({
      title: "Member removed",
      description: `${getUserName(uid)} has been removed from the group`,
    })

    setKickMemberDialog(false)
    setSelectedMemberForAction(null)
  }

  const handleTransferOwnership = (uid: string) => {
    if (!group) return

    setGroup({ ...group, createdBy: uid })

    toast({
      title: "Ownership transferred",
      description: `${getUserName(uid)} is now the group owner`,
    })

    setTransferOwnerDialog(false)
    setSelectedMemberForAction(null)
  }

  const handleLeaveGroup = () => {
    if (!group) return

    const updatedMemberIds = group.memberIds.filter((id) => id !== currentUid)
    setGroup({ ...group, memberIds: updatedMemberIds })

    toast({
      title: "Left group",
      description: `You have left ${group.name}`,
    })

    setLeaveGroupDialog(false)
    router.push("/groups")
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
      description: `${getUserName(paymentMember)} paid you ${formatCurrency(amountCents)}`,
    })

    setPaymentMember("")
    setPaymentAmount("")
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(cents / 100)
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
            {!isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeaveGroupDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Leave Group
              </Button>
            )}
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
                    {formatCurrency(myBalance)}
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
                        {formatCurrency(balances[uid] || 0)}
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
                      placeholder="Amount (₺)"
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

                  <div className="border-t pt-4">
                    <Label htmlFor="member-email">Add Member by Email</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="member-email"
                        type="email"
                        placeholder="email@example.com"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                      />
                      <Button onClick={handleAddMember}>Add</Button>
                    </div>
                  </div>
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
                          {formatTime(item.createdAt)}
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
                            <p className="text-xl sm:text-2xl font-bold">{formatCurrency(item.amountCents || 0)}</p>
                            {item.category && (
                              <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
                            )}
                          </div>
                          <div className="sm:text-right">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Split between {item.participantIds?.length || 0} people
                            </p>
                            <p className="text-xs text-muted-foreground">{formatTime(item.createdAt)}</p>
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
                    <Label htmlFor="expense-amount">Amount (₺)</Label>
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
                                <span className="text-sm text-muted-foreground">₺</span>
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
                                ₺
                                {Object.values(customSplitAmounts)
                                  .reduce((sum, val) => sum + (Number.parseFloat(val) || 0), 0)
                                  .toFixed(2)}{" "}
                                / ₺{Number.parseFloat(expenseAmount || "0").toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Button onClick={handleAddExpense} className="w-full">
                    Add Expense
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
                <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(selectedExpense.amountCents || 0)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedExpense.createdAt.toLocaleDateString()} at {formatTime(selectedExpense.createdAt)}
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
                    {formatCurrency(selectedExpense.amountCents || 0)}
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
                            <p className="font-semibold text-sm sm:text-base">{formatCurrency(splitAmount)}</p>
                            {isPayer && (
                              <p className="text-xs text-green-600">
                                +{formatCurrency((selectedExpense.amountCents || 0) - splitAmount)}
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
              Are you sure you want to leave {group.name}? You will need an invite code to rejoin this group.
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
    </div>
  )
}
