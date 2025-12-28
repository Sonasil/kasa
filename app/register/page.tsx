"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Wallet, Check, X } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useSettings } from "@/lib/settings-context"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useSettings()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++

    if (strength <= 1) return { strength, label: t("weak"), color: "text-red-600" }
    if (strength === 2) return { strength, label: t("fair"), color: "text-orange-600" }
    if (strength === 3) return { strength, label: t("good"), color: "text-yellow-600" }
    return { strength, label: t("strong"), color: "text-green-600" }
  }

  const passwordStrength = getPasswordStrength(password)

  const validateForm = () => {
    const newErrors: {
      fullName?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!fullName.trim()) {
      newErrors.fullName = t("nameRequired")
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = t("invalidInput")
    }

    if (!email.trim()) {
      newErrors.email = t("emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("invalidEmail")
    }

    if (!password) {
      newErrors.password = t("passwordRequired")
    } else if (password.length < 8) {
      newErrors.password = t("atLeast8Chars")
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("enterPasswordConfirm")
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("passwordsDoNotMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // 1) Create user with email/password
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      // 2) Set display name if provided
      const name = fullName.trim()
      if (name) {
        try { await updateProfile(cred.user, { displayName: name }) } catch {}
      }

      // 3) Upsert user profile in Firestore
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          uid: cred.user.uid,
          email: cred.user.email ?? null,
          displayName: name || cred.user.displayName || null,
          photoURL: cred.user.photoURL ?? null,
          provider: "password",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      // 4) Redirect on success
      router.push("/")
    } catch (err: any) {
      // Basic error mapping to existing inline errors
      const code = err?.code as string | undefined
      if (code === "auth/email-already-in-use") {
        setErrors(prev => ({ ...prev, email: t("createFailed") }))
      } else if (code === "auth/invalid-email") {
        setErrors(prev => ({ ...prev, email: t("invalidEmail") }))
      } else if (code === "auth/weak-password") {
        setErrors(prev => ({ ...prev, password: t("passwordTooWeak") }))
      } else {
        // Fallback: keep UI unchanged, surface minimal feedback
        setErrors(prev => ({ ...prev, email: prev.email || t("createFailed") }))
      }
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-2xl bg-primary p-3 sm:p-4">
                <Wallet className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t("createAccount")}</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {t("joinKasaDesc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm sm:text-base">
                {t("fullName")}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                }}
                className={`h-11 sm:h-10 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={loading}
                autoComplete="name"
              />
              {errors.fullName && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                className={`h-11 sm:h-10 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                {t("password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("createStrongPassword")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`h-11 sm:h-10 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 sm:h-10 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength
                            ? passwordStrength.strength <= 1
                              ? "bg-red-600"
                              : passwordStrength.strength === 2
                                ? "bg-orange-600"
                                : passwordStrength.strength === 3
                                  ? "bg-yellow-600"
                                  : "bg-green-600"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength.color}`}>{t("passwordStrength")} {passwordStrength.label}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {password.length >= 8 ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span>{t("atLeast8Chars")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span>{t("upperAndLowerCase")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/\d/.test(password) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span>{t("atLeastOneNumber")}</span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
                {t("confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("enterPasswordConfirm")}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  className={`h-11 sm:h-10 pr-10 ${
                    errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 sm:h-10 w-10 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 sm:h-10" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("creatingAccount")}
                </>
              ) : (
                t("signUp")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-medium text-primary hover:underline focus:outline-none focus:underline"
                disabled={loading}
              >
                {t("signIn")}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
