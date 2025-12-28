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
  getDoc,
  limit,
  deleteDoc, // Added deleteDoc
} from "firebase/firestore"
import { db ,auth } from "@/lib/firebase"

import { useEffect, useState, useRef, useMemo, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu" // Added DropdownMenuSeparator, DropdownMenuLabel
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
import { SimplifiedDebtCard } from "@/components/SimplifiedDebtCard" // Added SimplifiedDebtCard
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Wallet,
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
  type: "message" | "expense" | "settlement"
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
  paymentStatus?: Record<string, boolean>
  // Settlement fields
  from?: string
  fromName?: string
  to?: string
  toName?: string
}

type UserProfile = {
  displayName: string
  email: string
  photoURL?: string
}

const MOCK_USERS: Record<string, UserProfile> = {
  user1: { displayName: "Alice Johnson", email: "alice@example.com" },
  user2: { displayName: "Bob Smith", email: "bob@example.com" },
  user3: { displayName: "Charlie Davis", email: "charlie@example.com" },
}



export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { formatMoney, settings, t } = useSettings()

  const categoryOptions: { value: string; label: string; icon: any }[] = useMemo(() => [
    { value: "Electricity", label: t("electricity"), icon: Zap },
    { value: "Water", label: t("water"), icon: Droplets },
    { value: "Groceries", label: t("groceries"), icon: ShoppingCart },
    { value: "Internet", label: t("internet"), icon: Wifi },
    { value: "Rent", label: t("rent"), icon: Home },
    { value: "Transport", label: t("transport"), icon: Bus },
    { value: "Dining", label: t("dining"), icon: Utensils },
    { value: "Entertainment", label: t("entertainment"), icon: Film },
    { value: "Other", label: t("other"), icon: Tag },
    { value: "Custom", label: t("custom"), icon: Tag },
  ], [t])

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
  const groupId = params?.id as string
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState<GroupDoc | null>(null)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({})
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
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState<string | null>(null)

  const [expenseDetailOpen, setExpenseDetailOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<FeedItem | null>(null)

  // ✅ Edit expense dialog states
  const [editExpenseOpen, setEditExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(false)
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null)
  const [editExpenseTitle, setEditExpenseTitle] = useState("")
  const [editExpenseCategory, setEditExpenseCategory] = useState("")

  const [kickMemberDialog, setKickMemberDialog] = useState(false)
  const [transferOwnerDialog, setTransferOwnerDialog] = useState(false)
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<string | null>(null)
  const [leaveGroupDialog, setLeaveGroupDialog] = useState(false)
  const [deleteGroupDialog, setDeleteGroupDialog] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<Record<string, Record<string, boolean>>>({})

  const [paymentMember, setPaymentMember] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full")
  const [recordingPayment, setRecordingPayment] = useState(false)

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
            participantIds: data.participantIds || [],
            splitCents: data.splitCents || {},
            category: data.category,
            receiptUrl: data.receiptUrl,
            // Settlement fields
            from: data.from,
            fromName: data.fromName,
            to: data.to,
            toName: data.toName,
            // Payment status
            paymentStatus: data.paymentStatus || {},
          } as FeedItem
        })
        .filter((item) => item.type === "message" || item.type === "expense" || item.type === "settlement")

      setFeedItems(items)
      
      // Sync paymentStatus state with feed items
      const newPaymentStatus: Record<string, Record<string, boolean>> = {}
      items.forEach(item => {
        if (item.type === "expense" && item.paymentStatus) {
          newPaymentStatus[item.id] = item.paymentStatus
        }
      })
      setPaymentStatus(newPaymentStatus)

      if (autoScroll) {
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }, 100)
      }
    })

    return () => unsub()
  }, [groupId, autoScroll])

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [feedItems, autoScroll])

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    const text = messageText.trim()
    if (!text || sending || !currentUid) return

    setSending(true)
    try {
      const feedRef = doc(collection(db, "groups", groupId, "feed"))
      await setDoc(feedRef, {
        type: "message",
        text,
        createdAt: serverTimestamp(),
        createdBy: currentUid,
      })

      setMessageText("")
    } catch (err) {
      console.error("Failed to send message:", err)
      toast({
        title: t("error"),
        description: "Failed to send message",
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

    // ✅ Validation 1: Basic input validation
    if (!title || !amountTRY || amountTRY <= 0) {
      toast({
        title: t("invalidInput"),
        description: "Please enter a valid title and amount",
        variant: "destructive",
      })
      return
    }

    const participants = selectedParticipants.length > 0 ? selectedParticipants : [currentUid]
    const totalCents = Math.round(amountTRY * 100)
    const participantIds = [...participants].sort()
    const splitCents: Record<string, number> = {}

    // ✅ Validation 2: Custom split validation (BEFORE setAddingExpense)
    if (splitMode === "custom") {
      let customTotal = 0
      for (const uid of participantIds) {
        const customAmount = Number.parseFloat(customSplitAmounts[uid] || "0")
        if (customAmount <= 0) {
          toast({
            title: "Invalid split amount",
            description: `Please enter a valid amount for ${getUserName(uid)}`,
            variant: "destructive",
          })
          return // ✅ Early return WITHOUT setting loading state
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
        return // ✅ Early return WITHOUT setting loading state
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

    // ✅ ALL validations passed - NOW set loading state
    setAddingExpense(true)

    // stable request id for this submission (idempotency)
    if (!addExpenseRequestIdRef.current) {
      const uuid = (globalThis as any)?.crypto?.randomUUID?.()
      addExpenseRequestIdRef.current =
        uuid || `${currentUid}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    }
    const requestId = addExpenseRequestIdRef.current || `${currentUid}-${Date.now()}`

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
        title: t("expenseAdded"),
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
        title: t("error"),
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
        title: t("error"),
        description: "You must be signed in to generate an invite code.",
        variant: "destructive",
      })
      return
    }
  
    try {
      let code = ""
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      const inviteRef = doc(db, "groupInvites", code)
      await setDoc(inviteRef, {
        groupId,
        createdBy: currentUid,
        createdAt: serverTimestamp(),
      })
  
      setInviteCode(code)
      toast({
        title: t("inviteCodeGenerated"),
        description: "Share this code with others to join the group",
      })
    } catch (err) {
      console.error("Failed to generate invite code:", err)
      toast({
        title: t("error"),
        description: "Failed to generate invite code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      toast({
        title: t("copiedToClipboard"),
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
        title: t("memberRemoved"),
        description: `${getUserName(uid)} has been removed from the group`,
      })
    } catch (e: any) {
      console.error("Failed to remove member:", e)
      toast({
        title: t("error"),
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
        title: t("ownershipTransferred"),
        description: `${getUserName(uid)} is now the group owner`,
      })
    } catch (error) {
      console.error("Failed to transfer ownership:", error)
      toast({
        title: t("error"),
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
        title: t("leftGroup"),
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
        title: t("error"),
        description: "Something went wrong while leaving the group.",
        variant: "destructive",
      })
    }
  }

  // ✅ Fixed: Mark as paid with Firestore persistence AND balance update
  const handleTogglePayment = async (expenseId: string, userId: string) => {
    // Optimistic update for UI responsiveness
    const currentStatus = paymentStatus[expenseId]?.[userId] || false
    const newStatus = !currentStatus
    
    setPaymentStatus((prev) => ({
      ...prev,
      [expenseId]: {
        ...(prev[expenseId] || {}),
        [userId]: newStatus,
      },
    }))

    try {
      await runTransaction(db, async (tx) => {
        // 1. Get Expense Doc
        const feedRef = doc(db, "groups", groupId, "feed", expenseId)
        const feedSnap = await tx.get(feedRef)
        if (!feedSnap.exists()) throw new Error("Expense not found")
        const expenseData = feedSnap.data() as any

        // 2. Get Group Doc (for balances)
        const groupRef = doc(db, "groups", groupId)
        const groupSnap = await tx.get(groupRef)
        if (!groupSnap.exists()) throw new Error("Group not found")
        const groupData = groupSnap.data() as any
        
        // 3. Validation
        if (expenseData.type !== "expense") throw new Error("Not an expense")
        const payerUid = expenseData.payerUid
        const splitAmount = expenseData.splitCents?.[userId] || 0
        
        if (!payerUid || !splitAmount) return // Should not happen for valid expense

        // 4. Calculate Balance Updates
        // If marking as paid (newStatus === true):
        //   - Debtor (userId) pays Payer (payerUid)
        //   - Debtor balance increases (+), Payer balance decreases (-)
        // If unmarking (newStatus === false):
        //   - Reverse: Debtor balance decreases (-), Payer balance increases (+)
        
        const modifier = newStatus ? 1 : -1
        const currentBalances = groupData.balances || {}
        const nextBalances = { ...currentBalances }
        
        // Update Debtor Balance (userId)
        nextBalances[userId] = (nextBalances[userId] || 0) + (splitAmount * modifier)
        
        // Update Payer Balance (payerUid)
        nextBalances[payerUid] = (nextBalances[payerUid] || 0) - (splitAmount * modifier)

        // 5. Commit Updates
        tx.update(groupRef, { balances: nextBalances })
        tx.update(feedRef, { [`paymentStatus.${userId}`]: newStatus })
      })

      const isPaid = newStatus
      toast({
        title: isPaid ? "Marked as paid" : "Marked as unpaid",
        description: `Balance updated. ${getUserName(userId)} ${isPaid ? "has paid" : "hasn't paid"} their share.`,
      })
    } catch (error) {
      console.error("Failed to toggle payment:", error)
      // Revert optimistic update on error
      setPaymentStatus((prev) => ({
        ...prev,
        [expenseId]: {
          ...(prev[expenseId] || {}),
          [userId]: currentStatus,
        },
      }))

      toast({
        title: t("error"),
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  // ✅ NEW: Settlement document system with Firestore persistence
  const handleRecordPayment = async () => {
    if (!paymentMember || !paymentAmount || !group) return

    const amountTRY = Number.parseFloat(paymentAmount)
    if (amountTRY <= 0) {
      toast({
        title: t("invalidAmount"),
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setRecordingPayment(true)

    try {
      const amountCents = Math.round(amountTRY * 100)
      const groupRef = doc(db, "groups", groupId)

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(groupRef)
        if (!snap.exists()) throw new Error("Group not found")

        const data = snap.data()
        const balances = { ...data.balances }

        // Update balances: payer's debt decreases, current user's credit decreases
        balances[paymentMember] = (balances[paymentMember] || 0) + amountCents
        balances[currentUid] = (balances[currentUid] || 0) - amountCents

        // Create settlement record in feed for audit trail
        const feedRef = doc(collection(db, "groups", groupId, "feed"))
        tx.set(feedRef, {
          type: "settlement",
          createdAt: serverTimestamp(),
          createdBy: currentUid,
          from: paymentMember,
          fromName: getUserName(paymentMember),
          to: currentUid,
          toName: getUserName(currentUid),
          amountCents,
          title: "Payment received",
        })

        // Update group balances
        tx.update(groupRef, { balances })
      })

      toast({
        title: t("paymentRecorded"),
        description: `${getUserName(paymentMember)} paid you ${formatMoney(amountCents)}`,
      })

      setPaymentMember("")
      setPaymentAmount("")
    } catch (error) {
      console.error("Failed to record payment:", error)
      toast({
        title: t("error"),
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRecordingPayment(false)
    }
  }

  // ✅ NEW: Edit expense (title/category only)
  const handleEditExpense = async () => {
    if (!editExpenseId || !editExpenseTitle.trim()) return

    setEditingExpense(true)

    try {
      const feedRef = doc(db, "groups", groupId, "feed", editExpenseId)
      await updateDoc(feedRef, {
        title: editExpenseTitle.trim(),
        category: editExpenseCategory || null,
      })

      toast({
        title: t("expenseUpdated"),
        description: "Changes saved successfully",
      })

      setEditExpenseOpen(false)
      setEditExpenseId(null)
      setEditExpenseTitle("")
      setEditExpenseCategory("")
    } catch (error) {
      console.error("Failed to update expense:", error)
      toast({
        title: t("error"),
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEditingExpense(false)
    }
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

  // ✅ Calculate simplified debts for modern UI
  const calculateSimplifiedDebts = (
    balances: Record<string, number>,
    currentUid: string
  ) => {
    const youOwe: Array<{ uid: string; amount: number }> = []
    const owesYou: Array<{ uid: string; amount: number }> = []

    Object.entries(balances).forEach(([uid, balance]) => {
      if (uid === currentUid) return
      if (balance < 0) {
        // Negative balance means this person owes money to the group
        // From current user's perspective: they owe YOU
        owesYou.push({ uid, amount: Math.abs(balance) })
      } else if (balance > 0) {
        // Positive balance means this person is owed money by the group
        // From current user's perspective: YOU owe them
        youOwe.push({ uid, amount: balance })
      }
    })

    return { youOwe, owesYou }
  }

  const memberIds = group?.memberIds || []

  useEffect(() => {
    let cancelled = false
    const loadProfiles = async () => {
      if (!memberIds.length) {
        setUserProfiles({})
        return
      }
      const entries = await Promise.all(
        memberIds.map(async (uid) => {
          try {
            const snap = await getDoc(doc(db, "users", uid))
            if (snap.exists()) {
              const d = snap.data() as any
              return [
                uid,
                {
                  displayName: typeof d.displayName === "string" ? d.displayName : "",
                  email: typeof d.email === "string" ? d.email : "",
                  photoURL: typeof d.photoURL === "string" ? d.photoURL : "",
                },
              ] as const
            }
          } catch {}
          return [uid, { displayName: "", email: "", photoURL: "" }] as const
        }),
      )
      if (!cancelled) {
        setUserProfiles(Object.fromEntries(entries))
      }
    }
    loadProfiles()
    return () => {
      cancelled = true
    }
  }, [memberIds])

  const getUserName = (uid: string) => {
    return userProfiles[uid]?.displayName || userProfiles[uid]?.email || uid.slice(0, 8)
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
          <p className="text-destructive">{t("groupNotFound")}</p>
          <Button onClick={() => router.back()} className="mt-4">
            {t("goBack")}
          </Button>
        </Card>
      </div>
    )
  }

  const isOwner = currentUid === group.createdBy
  const balances = group.balances || {}
  const myBalance = balances[currentUid || ""] || 0

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-md">
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
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <BarChart3 className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                  {t("status")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-md sm:w-full">
                <DialogHeader className="pb-2">
                  <DialogTitle className="text-xl sm:text-2xl font-bold">{t("groupBalance")}</DialogTitle>
                </DialogHeader>
                
                {/* Your Balance Card - Clean & Minimal */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 sm:p-5 border border-slate-200 dark:border-slate-700/50 mb-5">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                      myBalance >= 0 
                        ? "bg-green-100 dark:bg-green-900/30" 
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <Wallet className={`h-6 w-6 sm:h-7 sm:w-7 ${
                        myBalance >= 0
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0 pl-1 sm:pl-2">
                      <p className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-1.5 ${myBalance >= 0 ? "text-green-600 dark:text-green-400 dark:[text-shadow:0_0_12px_rgba(34,197,94,0.3)]" : "text-red-600 dark:text-red-400 dark:[text-shadow:0_0_12px_rgba(239,68,68,0.3)]"}`}>
                        {formatMoney(myBalance)}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground font-medium">
                        {myBalance >= 0 ? t("youreOwed") : t("youOwe")}
                      </p>
                    </div>
                  </div>
                </div>

                {(() => {
                  const { youOwe, owesYou } = calculateSimplifiedDebts(balances, currentUid)
                  const allDebts = [
                    ...youOwe.map(d => ({ from: currentUid, to: d.uid, amount: d.amount })),
                    ...owesYou.map(d => ({ from: d.uid, to: currentUid, amount: d.amount }))
                  ]
                  const isSettled = allDebts.length === 0

                  if (isSettled) {
                    return (
                      <div className="py-10 text-center">
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 dark:ring-1 dark:ring-green-500/20 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{t("allSettled")}</p>
                        <p className="text-base text-muted-foreground mt-2">{t("noOutstandingDebts")}</p>
                      </div>
                    )
                  }

                  return (
                    <div className="space-y-3 mb-5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
                        {t("debts").toUpperCase()}
                      </p>
                      {allDebts.map((debt, index) => (
                        <div
                          key={`${debt.from}-${debt.to}-${index}`}
                          className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 sm:p-4 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600/60 transition-colors duration-150"
                        >
                          <div className="flex items-center justify-between gap-4">
                            {/* Left: Avatar + Info */}
                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                              <Avatar className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0">
                                {(() => {
                                  // Show the other person's avatar (not yours)
                                  const otherPersonId = debt.from === currentUid ? debt.to : debt.from
                                  return userProfiles[otherPersonId]?.photoURL ? (
                                    <AvatarImage 
                                      src={userProfiles[otherPersonId]?.photoURL} 
                                      alt={getUserName(otherPersonId)} 
                                    />
                                  ) : null
                                })()}
                                <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm">
                                  {(() => {
                                    const otherPersonId = debt.from === currentUid ? debt.to : debt.from
                                    return getUserName(otherPersonId).slice(0, 2).toUpperCase()
                                  })()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-base text-foreground truncate leading-tight mb-0.5">
                                  {debt.from === currentUid ? t("You") : getUserName(debt.from)}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {t("owes")} {debt.to === currentUid ? t("you") : getUserName(debt.to)}
                                </p>
                              </div>
                            </div>

                            {/* Right: Amount */}
                            <div className="flex-shrink-0">
                              <p className={`text-xl sm:text-2xl font-bold ${
                                debt.to === currentUid 
                                  ? "text-green-600 dark:text-green-400 dark:[text-shadow:0_0_8px_rgba(34,197,94,0.25)]" 
                                  : "text-red-600 dark:text-red-400 dark:[text-shadow:0_0_8px_rgba(239,68,68,0.25)]"
                              }`}>
                                {formatMoney(debt.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}

                {/* Record Payment - Compact & Clean */}
                <div className="border-t pt-4 mt-1">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-foreground">{t("recordPayment")}</h3>
                    <p className="text-xs text-muted-foreground">{t("trackPayments")}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Member Selection */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        {t("member")}
                      </Label>
                      <Select 
                        value={paymentMember} 
                        onValueChange={(value) => {
                          setPaymentMember(value)
                          setPaymentMode("full")
                          // Auto-fill full amount
                          const { owesYou } = calculateSimplifiedDebts(balances, currentUid)
                          const debt = owesYou.find(d => d.uid === value)
                          if (debt) {
                            setPaymentAmount((debt.amount / 100).toFixed(2))
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder={t("selectMember")} />
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
                    </div>

                    {/* Payment Options */}
                    {paymentMember && (() => {
                      const { owesYou } = calculateSimplifiedDebts(balances, currentUid)
                      const debt = owesYou.find(d => d.uid === paymentMember)
                      const debtAmount = debt?.amount || 0

                      return (
                        <div className="space-y-3">
                          {/* Payment Type Selection */}
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                              {t("amount")}
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={paymentMode === "full" ? "default" : "outline"}
                                className="h-auto p-2.5 flex-col items-start"
                                onClick={() => {
                                  setPaymentMode("full")
                                  setPaymentAmount((debtAmount / 100).toFixed(2))
                                }}
                              >
                                <div className="text-xs font-medium mb-0.5 opacity-90">
                                  {t("full")}
                                </div>
                                <div className="text-base font-bold">
                                  {formatMoney(debtAmount)}
                                </div>
                              </Button>

                              <Button
                                type="button"
                                variant={paymentMode === "partial" ? "default" : "outline"}
                                className="h-auto p-2.5 flex-col items-start"
                                onClick={() => {
                                  setPaymentMode("partial")
                                  setPaymentAmount("")
                                }}
                              >
                                <div className="text-xs font-medium mb-0.5 opacity-90">
                                  {t("custom")}
                                </div>
                                <div className="text-base font-bold">
                                  {t("partial")}
                                </div>
                              </Button>
                            </div>
                          </div>

                          {/* Custom Amount Input */}
                          {paymentMode === "partial" && (
                            <div>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder={t("enterAmount")}
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                disabled={recordingPayment}
                                className="h-10 text-base"
                                autoFocus
                              />
                            </div>
                          )}

                          {/* Submit Button */}
                          <Button
                            onClick={handleRecordPayment}
                            disabled={
                              !paymentMember || 
                              !paymentAmount ||
                              Number(paymentAmount) <= 0 ||
                              recordingPayment
                            }
                            className="w-full h-10 text-sm font-semibold"
                          >
                            {recordingPayment ? t("recording") : t("recordPayment")}
                          </Button>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Close button */}
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setStatusDialogOpen(false)}
                    className="w-full h-11 text-base font-semibold"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>


            <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-transparent">
                  <Users className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                  {t("members")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("groupMembers")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {memberIds.map((uid) => (
                      <div key={uid} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-9 w-9">
                            {userProfiles[uid]?.photoURL ? (
                              <AvatarImage src={userProfiles[uid]?.photoURL} alt={getUserName(uid)} />
                            ) : null}
                            <AvatarFallback>
                              {getUserName(uid).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{getUserName(uid)}</p>
                            <p className="text-sm text-muted-foreground truncate">{userProfiles[uid]?.email || ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {uid === group.createdBy && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded">
                              <Crown className="h-3 w-3" />
                              <span>{t("owner")}</span>
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
                                  {t("transferOwnership")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedMemberForAction(uid)
                                    setKickMemberDialog(true)
                                  }}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  {t("removeMember")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                    <div className="border-t pt-4">
                    <Label>{t("inviteCode")}</Label>
                    <p className="text-xs text-muted-foreground mb-2">{t("generateInviteCodeDesc")}</p>
                    {!inviteCode ? (
                      <Button onClick={handleGenerateInviteCode} variant="outline" className="w-full bg-transparent">
                        <Link className="mr-2 h-4 w-4" />
                        {t("generateInviteCode")}
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
                      <Label>{t("leaveGroup")}</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("leaveGroupOwnerDesc")}
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: t("transferOwnershipFirst"),
                            description: t("leaveGroupOwnerDesc"),
                            variant: "destructive",
                          })
                        }}
                      >
                        {t("leaveGroup")}
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("useMenuToTransfer")}
                      </p>
                    </div>
                  )}
                  {(!isOwner || memberIds.length === 1) && (
                    <div className="border-t pt-4">
                      <Label>{t("leaveGroup")}</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        {memberIds.length === 1
                          ? t("leaveGroupLastMemberDesc")
                          : t("leaveGroupDesc")}
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
                        {t("leaveGroup")}
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
              <p className="text-muted-foreground">{t("noActivityYet")}</p>
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
                const categoryOption = categoryOptions.find((opt) => opt.value === item.category)
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
                              {t("paidBy")} {getUserName(item.payerUid || "")}
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
                              {t("splitBetween")} {item.participantIds?.length || 0} {t("people")}
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditExpenseId(item.id)
                              setEditExpenseTitle(item.title || "")
                              setEditExpenseCategory(item.category || "")
                              setEditExpenseOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("edit")}
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
                  <DialogTitle>{t("addExpense")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expense-title">{t("description")}</Label>
                    <Input
                      id="expense-title"
                      placeholder={t("groceriesEtc")}
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-amount">{t("amount")} ({settings.currency})</Label>
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
                    <Label htmlFor="expense-category">{t("category")}</Label>
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
                                const option = categoryOptions.find((opt) => opt.value === expenseCategory)
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
                        {categoryOptions.map((option) => {
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
                        placeholder={t("enterCustomCategory")}
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <Label>{t("splitWith")}</Label>
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
                    {addingExpense ? t("adding") : t("addExpense")}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">{t("expenseDetails")}</DialogTitle>
          </DialogHeader>
          {selectedExpense && (() => {
            const categoryOption = categoryOptions.find((opt) => opt.value === selectedExpense.category)
            const CategoryIcon = categoryOption?.icon || DollarSign

            return (
              <div className="space-y-3 sm:space-y-4">
                {/* Amount Card */}
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                        {selectedExpense.title}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                        {selectedExpense.category && (
                          <>
                            <span className="truncate">{selectedExpense.category}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="truncate">{toDateSafe(selectedExpense.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
                      {formatMoney(selectedExpense.amountCents || 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total amount</p>
                  </div>
                </div>

                {/* Paid By */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Paid By
                  </p>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                        {userProfiles[selectedExpense.payerUid || ""]?.photoURL ? (
                          <AvatarImage 
                            src={userProfiles[selectedExpense.payerUid || ""]?.photoURL} 
                            alt={getUserName(selectedExpense.payerUid || "")} 
                          />
                        ) : null}
                        <AvatarFallback className="bg-slate-700 dark:bg-slate-600 text-white font-medium text-sm">
                          {getUserName(selectedExpense.payerUid || "").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base text-foreground truncate">
                          {getUserName(selectedExpense.payerUid || "")}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {userProfiles[selectedExpense.payerUid || ""]?.email}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-500">
                          {formatMoney(selectedExpense.amountCents || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Split Between */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    Split Between {selectedExpense.participantIds?.length || 0} People
                  </p>
                  <div className="space-y-2">
                    {selectedExpense.participantIds?.map((uid) => {
                      const splitAmount = selectedExpense.splitCents?.[uid] || 0
                      const isPayer = uid === selectedExpense.payerUid

                      return (
                        <div
                          key={uid}
                          className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-3.5 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                              {userProfiles[uid]?.photoURL ? (
                                <AvatarImage src={userProfiles[uid]?.photoURL} alt={getUserName(uid)} />
                              ) : null}
                              <AvatarFallback className={`text-xs sm:text-sm font-medium ${
                                isPayer ? "bg-slate-700 dark:bg-slate-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              }`}>
                                {getUserName(uid).slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                                  {getUserName(uid)}
                                </p>
                                {isPayer && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex-shrink-0">
                                    Payer
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className={`font-medium text-sm sm:text-base ${
                                isPayer ? "text-foreground" : "text-red-600 dark:text-red-500"
                              }`}>
                                {formatMoney(splitAmount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setExpenseDetailOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedExpense) {
                        setEditExpenseId(selectedExpense.id)
                        setEditExpenseTitle(selectedExpense.title || "")
                        setEditExpenseCategory(selectedExpense.category || "")
                        setExpenseDetailOpen(false)
                        setEditExpenseOpen(true)
                      }
                    }}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            )
          })()}
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

      {/* ✅ Edit Expense Dialog */}
      <Dialog open={editExpenseOpen} onOpenChange={setEditExpenseOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Expense title"
                value={editExpenseTitle}
                onChange={(e) => setEditExpenseTitle(e.target.value)}
                disabled={editingExpense}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editExpenseCategory || ""}
                onValueChange={setEditExpenseCategory}
                disabled={editingExpense}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.filter(opt => opt.value !== "Custom").map((option) => {
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
            </div>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                ℹ️ Amount and split cannot be edited
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditExpenseOpen(false)
                  setEditExpenseId(null)
                  setEditExpenseTitle("")
                  setEditExpenseCategory("")
                }}
                disabled={editingExpense}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditExpense}
                disabled={!editExpenseTitle.trim() || editingExpense}
                className="flex-1"
              >
                {editingExpense ? t("saving") : t("saveChanges")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
