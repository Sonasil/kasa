"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PhoneAuthProvider, linkWithCredential } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Check } from "lucide-react"

export default function PhoneOtpPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [smsVerifying, setSmsVerifying] = useState(false)
  const [phoneE164, setPhoneE164] = useState<string | null>(null)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login")
      }
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedPhone = sessionStorage.getItem("phone_e164")
    const storedVerificationId = sessionStorage.getItem("phone_verificationId")
    if (!storedPhone || !storedVerificationId) {
      router.replace("/profile/settings/phone")
      return
    }
    setPhoneE164(storedPhone)
    setVerificationId(storedVerificationId)
  }, [router])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const id = setInterval(() => setResendCooldown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [resendCooldown])

  const isOtpComplete = useMemo(() => otp.join("").length === 6, [otp])

  const handleOtpInput = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length === 6 && index === 0) {
      setOtp(digits.split("").slice(0, 6))
      otpRefs.current[5]?.focus()
      return
    }

    const digit = digits.slice(0, 1)
    setOtp((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && otpRefs.current[index + 1]) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const verifyOtp = async () => {
    const user = auth.currentUser
    if (!user || !verificationId || !phoneE164) {
      router.replace("/profile/settings/phone")
      return
    }
    const code = otp.join("")
    if (code.length !== 6) return

    setSmsVerifying(true)
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      await linkWithCredential(user, credential)
      await user.reload()
      await setDoc(
        doc(db, "users", user.uid),
        { phone: phoneE164, phoneVerified: true, updatedAt: serverTimestamp() },
        { merge: true }
      )
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("phone_e164")
        sessionStorage.removeItem("phone_verificationId")
      }
      toast({ title: "Telefon doğrulandı", description: "Numaran başarıyla doğrulandı." })
      router.replace("/profile/settings")
    } catch (e: any) {
      const codeErr = e?.code as string | undefined
      let message = e?.message || "Kod doğrulanamadı."
      if (codeErr === "auth/invalid-verification-code") message = "Kod geçersiz."
      else if (codeErr === "auth/code-expired") message = "Kodun süresi doldu, yeniden deneyin."
      toast({
        variant: "destructive",
        title: "Doğrulanamadı",
        description: `${message}${codeErr ? ` (${codeErr})` : ""}`,
      })
    } finally {
      setSmsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.replace("/profile/settings/phone")} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2].map((i) => {
              const isActive = i === 1
              return (
                <div
                  key={i}
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    isActive ? "bg-black text-white border-black" : "border-muted text-muted-foreground"
                  }`}
                >
                  {isActive ? <Check className="h-4 w-4" /> : i + 1}
                </div>
              )
            })}
          </div>
          <div className="w-9" />
        </div>

        <Card className="p-6 sm:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">OTP doğrulama kodunu gir</h1>
              <p className="text-sm text-muted-foreground">
                Kod şuraya gönderildi: <span className="font-medium text-foreground">{phoneE164 || "—"}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              {otp.map((value, idx) => (
                <Input
                  key={idx}
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpInput(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  ref={(el) => {
                    otpRefs.current[idx] = el
                  }}
                  className="h-12 w-12 text-center text-lg rounded-lg border-2"
                  disabled={smsVerifying}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <button
                type="button"
                className="underline disabled:opacity-50"
                onClick={() => router.replace("/profile/settings/phone")}
                disabled={smsVerifying || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Tekrar gönder (${resendCooldown}s)` : "Kodu yeniden gönder"}
              </button>
              <button
                type="button"
                className="underline"
                onClick={() => router.replace("/profile/settings/phone")}
                disabled={smsVerifying}
              >
                Geri
              </button>
            </div>

            <Button
              className="w-full h-12 bg-black text-white hover:bg-black/90"
              onClick={verifyOtp}
              disabled={smsVerifying || !isOtpComplete}
            >
              {smsVerifying ? "Doğrulanıyor..." : "Doğrula"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
