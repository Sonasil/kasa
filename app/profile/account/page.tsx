"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, updateProfile, deleteUser } from "firebase/auth"
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { auth, db } from "@/lib/firebase"
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
import { ArrowLeft, AlertCircle, Save, Trash2 } from "lucide-react"

export default function AccountSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [memberSince, setMemberSince] = useState("")

  const initials = useMemo(() => {
    const source = displayName.trim() || email.trim()
    if (!source) return ""
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  }, [displayName, email])

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | undefined

    const formatMemberSince = (value?: string | Date | null) => {
      if (!value) return ""
      const dateValue = typeof value === "string" ? new Date(value) : value
      if (Number.isNaN(dateValue.getTime())) return ""
      return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(dateValue)
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc()
          unsubscribeUserDoc = undefined
        }
        if (!user) {
          setUid(null)
          setDisplayName("")
          setEmail("")
          setPhone("")
          setMemberSince("")
          setLoading(false)
          router.replace("/login")
          return
        }

        setUid(user.uid)
        setEmail(user.email ?? "")
        if (user.displayName) {
          setDisplayName(user.displayName)
        }

        const authMemberSince = formatMemberSince(user.metadata?.creationTime ?? null)
        if (authMemberSince) {
          setMemberSince(authMemberSince)
        }

        setLoading(true)

        const userDocRef = doc(db, "users", user.uid)
        unsubscribeUserDoc = onSnapshot(
          userDocRef,
          (snapshot) => {
            const data = snapshot.data()

            if (data) {
              if (typeof data.displayName === "string" && data.displayName.trim()) {
                setDisplayName(data.displayName)
              }
              if (typeof data.phone === "string") {
                setPhone(data.phone)
              }
              if (data.createdAt?.toDate) {
                const createdAtDate = data.createdAt.toDate()
                const formatted = formatMemberSince(createdAtDate)
                if (formatted) {
                  setMemberSince(formatted)
                }
              }
            }

            setLoading(false)
          },
          (snapshotError) => {
            setError(snapshotError.message ?? "Failed to load profile.")
            setLoading(false)
          },
        )
      },
      (authError) => {
        setError(authError.message ?? "Authentication error.")
        setLoading(false)
      },
    )

    return () => {
      unsubscribeAuth()
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
      }
    }
  }, [router])

  const handleSaveProfile = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    setError(null)

    if (!displayName.trim() || !email.trim()) {
      setError("Display name and email are required.")
      return
    }

    const user = auth.currentUser
    if (!user || !uid) {
      setError("You need to sign in again.")
      router.replace("/login")
      return
    }

    setSaving(true)

    try {
      await updateProfile(user, { displayName: displayName.trim() })
      await setDoc(
        doc(db, "users", uid),
        {
          displayName: displayName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      toast({
        title: "Profile updated",
        description: "Your account details were saved.",
      })
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Failed to save profile."
      setError(message)
      toast({
        variant: "destructive",
        title: "Could not save",
        description: message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    setError(null)
    try {
      await signOut(auth)
      router.push("/login")
    } catch (signOutError) {
      const message = signOutError instanceof Error ? signOutError.message : "Failed to sign out."
      setError(message)
      toast({
        variant: "destructive",
        title: "Could not sign out",
        description: message,
      })
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(false)
    setError(null)

    const user = auth.currentUser
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "Please sign in again to delete your account.",
      })
      router.replace("/login")
      return
    }

    try {
      setSaving(true)
      await deleteUser(user)
      toast({
        title: "Account deleted",
        description: "Your account has been removed.",
      })
      router.push("/login")
    } catch (deleteError: any) {
      const message = deleteError?.message ?? "Failed to delete account."

      if (deleteError?.code === "auth/requires-recent-login") {
        toast({
          variant: "destructive",
          title: "Re-authentication required",
          description: "Please sign in again before deleting your account.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Could not delete account",
          description: message,
        })
      }

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-4xl p-3 sm:p-6">
          <Skeleton className="h-8 w-32 mb-4 sm:mb-6" />
          <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/profile")}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Account Settings</h1>
              <p className="text-xs text-muted-foreground sm:text-sm">Member since {memberSince || "—"}</p>
            </div>
          </div>

          {initials && (
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Personal Information</h2>
          <form className="space-y-4" onSubmit={handleSaveProfile}>
            <div>
              <Label htmlFor="display-name" className="text-sm sm:text-base">
                Display Name
              </Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="mt-1.5 h-10 sm:h-11"
                disabled={saving}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
                placeholder="your.email@example.com"
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm sm:text-base">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1.5 h-10 sm:h-11"
                disabled={saving}
              />
            </div>

            <div className="pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Member since {memberSince || "—"}</p>
            </div>

            <Button type="submit" disabled={saving} className="w-full h-11 sm:h-10">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Account</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-muted-foreground sm:text-sm">You can sign back in at any time.</p>
            </div>
            <Button variant="secondary" onClick={handleSignOut} disabled={saving}>
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-4 sm:p-6 border-destructive">
          <h2 className="text-base sm:text-lg font-semibold mb-2 text-destructive">Danger Zone</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="destructive"
            className="w-full h-11 sm:h-10"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={saving}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone. All your groups, expenses, and
              data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
