"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth"
import { collection, doc, onSnapshot, orderBy, query, where, limit, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
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
import {
  Home,
  Wallet,
  User,
  LogOut,
  AlertCircle,
  ChevronRight,
  Sliders,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useSettings } from "@/lib/settings-context"

export default function ProfilePage() {
  const router = useRouter()
  const { formatMoney } = useSettings()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [photoURL, setPhotoURL] = useState<string>("")
  const [memberSince, setMemberSince] = useState<string>("")
  const [savingProfile, setSavingProfile] = useState(false)

  const [totalGroups, setTotalGroups] = useState(0)
  const [activeExpenses, setActiveExpenses] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0) // cents
  const [balance, setBalance] = useState(0) // cents

  const initials = useMemo(() => {
    const v = (displayName || email || "?").trim()
    const parts = v.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }, [displayName, email])

  const handleSignOut = async () => {
    setSignOutDialogOpen(false)
    try {
      await signOut(auth)
    } catch (e) {
      console.warn("Sign out failed:", e)
    } finally {
      router.push("/login")
    }
  }

  const handleSaveProfile = async () => {
    setError(null)
    const user = auth.currentUser

    if (!user || !uid) {
      router.push("/login")
      return
    }

    setSavingProfile(true)
    const trimmedName = displayName.trim()
    const trimmedPhoto = photoURL.trim()

    try {
      await updateProfile(user, {
        displayName: trimmedName || undefined,
        photoURL: trimmedPhoto || undefined,
      })

      await setDoc(
        doc(db, "users", uid),
        {
          displayName: trimmedName,
          email,
          photoURL: trimmedPhoto,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      toast({
        title: "Profile updated",
        description: "Your profile has been saved.",
      })
    } catch (e: any) {
      const message = e?.message || "Failed to save profile."
      setError(message)
      toast({
        variant: "destructive",
        title: "Could not save profile",
        description: message,
      })
    } finally {
      setSavingProfile(false)
    }
  }

  useEffect(() => {
    let unsubGroups: (() => void) | null = null
    let unsubUser: (() => void) | null = null
    let feedUnsubs: Array<() => void> = []

    const cleanupFeeds = () => {
      feedUnsubs.forEach((u) => {
        try { u() } catch {}
      })
      feedUnsubs = []
    }

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setError(null)

      // cleanup previous listeners
      if (unsubGroups) {
        try { unsubGroups() } catch {}
        unsubGroups = null
      }
      cleanupFeeds()

      if (!user) {
        setUid(null)
        setLoading(false)
        router.push("/login")
        return
      }

      setUid(user.uid)
      setEmail(user.email || "")
      setDisplayName(user.displayName || "")
      setPhotoURL(user.photoURL || "")

      // Member since: prefer Auth creationTime
      const created = user.metadata?.creationTime ? new Date(user.metadata.creationTime) : null
      if (created) {
        setMemberSince(
          new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(created)
        )
      } else {
        setMemberSince("")
      }

      if (unsubUser) {
        try { unsubUser() } catch {}
      }
      const uref = doc(db, "users", user.uid)
      unsubUser = onSnapshot(
        uref,
        (usnap) => {
          const data: any = usnap.data()
          if (typeof data?.displayName === "string") setDisplayName(data.displayName)
          if (typeof data?.email === "string") setEmail(data.email)
          if (typeof data?.photoURL === "string") setPhotoURL(data.photoURL)
          if (data?.createdAt?.toDate) {
            const d = data.createdAt.toDate()
            setMemberSince(new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d))
          }
        },
        (err) => {
          console.warn("Failed to read user profile doc:", err)
        },
      )

      // Groups the user is a member of
      const groupsQ = query(collection(db, "groups"), where("memberIds", "array-contains", user.uid))

      const perGroupExpenseCounts: Record<string, number> = {}

      const recomputeActiveExpenses = () => {
        const total = Object.values(perGroupExpenseCounts).reduce((a, b) => a + b, 0)
        setActiveExpenses(total)
      }

      unsubGroups = onSnapshot(
        groupsQ,
        (snap) => {
          cleanupFeeds()

          const groups = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
          setTotalGroups(groups.length)

          // totals
          let spent = 0
          let bal = 0
          for (const g of groups) {
            const ta = g?.totalAmount
            if (typeof ta === "number") spent += ta
            const b = g?.balances
            const v = b && typeof b === "object" ? b[user.uid] : undefined
            if (typeof v === "number") bal += v
          }
          setTotalSpent(spent)
          setBalance(bal)

          // active expenses: count recent feed items of type expense (lightweight)
          for (const g of groups) {
            const fq = query(
              collection(db, "groups", g.id, "feed"),
              orderBy("createdAt", "desc"),
              limit(50)
            )
            const unsubFeed = onSnapshot(
              fq,
              (fs) => {
                let c = 0
                fs.forEach((docSnap) => {
                  const data: any = docSnap.data()
                  if (data?.type === "expense") c += 1
                })
                perGroupExpenseCounts[g.id] = c
                recomputeActiveExpenses()
              },
              () => {
                perGroupExpenseCounts[g.id] = 0
                recomputeActiveExpenses()
              }
            )
            feedUnsubs.push(unsubFeed)
          }

          recomputeActiveExpenses()
          setLoading(false)
        },
        (err) => {
          console.error("Failed to load groups:", err)
          setError("Failed to load profile stats. Please try again.")
          setTotalGroups(0)
          setActiveExpenses(0)
          setTotalSpent(0)
          setBalance(0)
          setLoading(false)
        }
      )
    })

    return () => {
      try { unsubAuth() } catch {}
      if (unsubGroups) {
        try { unsubGroups() } catch {}
      }
      if (unsubUser) {
        try { unsubUser() } catch {}
      }
      cleanupFeeds()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-4xl p-3 sm:p-6">
          <Skeleton className="h-8 w-32 mb-4 sm:mb-6" />
          <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 sm:w-40" />
                <Skeleton className="h-4 w-40 sm:w-48" />
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <Skeleton className="h-12 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl">
        {error && (
          <Alert variant="destructive" className="m-3 sm:m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
          <div className="p-4 sm:p-6 pb-16 sm:pb-20">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-3 text-xl sm:text-2xl font-bold">{displayName || "(No name)"}</h1>
              <p className="text-sm text-muted-foreground">{email || ""}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Member since {memberSince || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 -mt-12 sm:-mt-14">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-1.5">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{totalGroups}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-1.5">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{activeExpenses}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-1.5">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
              <p className="text-base sm:text-lg font-bold">{formatMoney(totalSpent)}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className={`flex items-center gap-2 mb-1`}>
                <div
                  className={`rounded-full p-1.5 ${balance >= 0 ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"}`}
                >
                  <DollarSign
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Balance</p>
              </div>
              <p
                className={`text-base sm:text-lg font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatMoney(balance)}
              </p>
            </Card>
          </div>


          <Card className="p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-1">SETTINGS</h3>
            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-accent hover:border-accent-foreground/10 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="rounded-full bg-primary/10 p-2 sm:p-2.5 shrink-0">
                  <Sliders className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold">App Settings</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Preferences and permissions</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
            </button>
          </Card>

          <Button variant="destructive" className="w-full h-11 sm:h-10 mb-4" onClick={() => setSignOutDialogOpen(true)}>
            <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Sign Out
          </Button>

          <div className="text-center pb-2">
            <p className="text-xs text-muted-foreground">Kasa Expense Sharing App</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
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
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label="Home"
            >
              <Home className="h-6 w-6 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              aria-label="Profile"
            >
              <User className="h-6 w-6 text-green-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your groups and expenses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
