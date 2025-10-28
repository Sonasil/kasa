"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

const MOCK_USER = {
  displayName: "Alex Johnson",
  email: "alex.johnson@example.com",
  initials: "AJ",
  memberSince: "January 2024",
}

const MOCK_STATS = {
  totalGroups: 5,
  activeExpenses: 12,
  totalSpent: 245000, // in cents
  balance: 5000, // in cents
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)

  const handleSignOut = () => {
    setSignOutDialogOpen(false)
    // Simulate sign out
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(cents / 100)
  }

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
                  {MOCK_USER.initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-3 text-xl sm:text-2xl font-bold">{MOCK_USER.displayName}</h1>
              <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Member since {MOCK_USER.memberSince}</span>
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
              <p className="text-xl sm:text-2xl font-bold">{MOCK_STATS.totalGroups}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-1.5">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{MOCK_STATS.activeExpenses}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-1.5">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
              <p className="text-base sm:text-lg font-bold">{formatCurrency(MOCK_STATS.totalSpent)}</p>
            </Card>

            <Card className="p-3 sm:p-4 bg-card/95 backdrop-blur">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`rounded-full p-1.5 ${MOCK_STATS.balance >= 0 ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"}`}
                >
                  <DollarSign
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${MOCK_STATS.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Balance</p>
              </div>
              <p
                className={`text-base sm:text-lg font-bold ${MOCK_STATS.balance >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(MOCK_STATS.balance)}
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
