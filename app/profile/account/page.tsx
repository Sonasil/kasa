"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ArrowLeft, AlertCircle, Save, Trash2 } from "lucide-react"

const MOCK_USER = {
  displayName: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinedDate: "January 15, 2024",
}

export default function AccountSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Form state
  const [displayName, setDisplayName] = useState(MOCK_USER.displayName)
  const [email, setEmail] = useState(MOCK_USER.email)
  const [phone, setPhone] = useState(MOCK_USER.phone)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveProfile = () => {
    setError(null)
    setSuccess(null)

    if (!displayName.trim() || !email.trim()) {
      setError("Name and email are required")
      return
    }

    // Simulate save
    setTimeout(() => {
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(null), 3000)
    }, 500)
  }

  const handleChangePassword = () => {
    setError(null)
    setSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Simulate password change
    setTimeout(() => {
      setSuccess("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setSuccess(null), 3000)
    }, 500)
  }

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false)
    // Simulate account deletion
    setTimeout(() => {
      router.push("/login")
    }, 500)
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
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 sm:h-9 sm:w-9">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Account Settings</h1>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-3 sm:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-3 sm:mb-4 border-green-600 bg-green-50 dark:bg-green-950/20">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Personal Information</h2>
          <div className="space-y-4">
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
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>

            <div className="pt-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Member since {MOCK_USER.joinedDate}</p>
            </div>

            <Button onClick={handleSaveProfile} className="w-full h-11 sm:h-10">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-4 sm:p-6 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Security</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-sm sm:text-base">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>

            <div>
              <Label htmlFor="new-password" className="text-sm sm:text-base">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password" className="text-sm sm:text-base">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1.5 h-10 sm:h-11"
              />
            </div>

            <Button onClick={handleChangePassword} className="w-full h-11 sm:h-10">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-4 sm:p-6 border-destructive">
          <h2 className="text-base sm:text-lg font-semibold mb-2 text-destructive">Danger Zone</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" className="w-full h-11 sm:h-10" onClick={() => setDeleteDialogOpen(true)}>
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
