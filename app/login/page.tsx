"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Wallet } from "lucide-react"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { useSettings } from "@/lib/settings-context"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useSettings()
  // Add auth listener to handle redirect result or existing session
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/")
      }
    })
    return () => unsub()
  }, [router])

  // Handle redirect result (for mobile)
  useEffect(() => {
    // Check for redirect result on mount
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in via redirect
          router.push("/")
        }
      })
      .catch((error) => {
        console.error("Redirect sign-in error:", error)
        setGoogleLoading(false)
        if (error?.code !== "auth/popup-closed-by-user") {
          // Show explicit error message if possible
          const msg = error?.message || t("googleSignInFailed")
          setFormError(`${t("googleSignInFailed")} (${msg})`)
        }
      })
  }, [t, router])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})


  const [formError, setFormError] = useState<string | null>(null)




  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    setFormError(null)

    if (!email.trim()) {
      newErrors.email = t("emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("invalidEmail")
    }

    if (!password) {
      newErrors.password = t("passwordRequired")
    } else if (password.length < 6) {
      newErrors.password = t("passwordTooWeak")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      router.push("/")
    } catch (err: any) {
      setLoading(false)
      // Basic error mapping
      const code = err?.code as string | undefined
      if (code === "auth/invalid-email") {
        setErrors(prev => ({ ...prev, email: t("invalidEmail") }))
      } else if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setErrors(prev => ({ ...prev, password: t("signInFailed") }))
      } else if (code === "auth/too-many-requests") {
        setFormError(t("pleaseTryAgain"))
      } else {
        setFormError(t("signInFailed"))
      }
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setFormError(null)
    
    try {
      // Desktop & Mobile: Try popup first
      await signInWithPopup(auth, googleProvider)
      // Auth state listener will handle redirection
    } catch (err: any) {
      console.error("Google sign in error:", err)
      
      const errorCode = err?.code
      if (errorCode === "auth/popup-closed-by-user") {
        setGoogleLoading(false)
        return // Ignore if user closed it
      }
      
      // If popup specifically fails due to blocking/support, try redirect
      if (errorCode === "auth/popup-blocked" || errorCode === "auth/cancelled-popup-request" || errorCode === "auth/operation-not-supported-in-this-environment") {
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (redirectErr: any) {
          console.error("Redirect fallback failed", redirectErr)
           setGoogleLoading(false)
        }
      } else {
         setGoogleLoading(false)
      }

      setFormError(t("googleSignInFailed"))
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
            <h1 className="text-2xl sm:text-3xl font-bold">{t("welcomeToKasa")}</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">{t("signInDesc")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                disabled={loading || googleLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                {t("password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`h-11 sm:h-10 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={loading || googleLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 sm:h-10 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || googleLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 sm:h-10" disabled={loading || googleLoading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("signingIn")}
                </>
              ) : (
                t("signIn")
              )}
            </Button>
            {formError && (
              <p className="text-xs sm:text-sm text-destructive mt-2" role="alert">
                {formError}
              </p>
            )}
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 sm:h-10 bg-transparent"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("connecting")}
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("loginWithGoogle")}
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-medium text-primary hover:underline focus:outline-none focus:underline"
                disabled={loading || googleLoading}
              >
                {t("signUp")}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
