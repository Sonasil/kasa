"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { RecaptchaVerifier, linkWithPhoneNumber } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { COUNTRIES } from "./countries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Check, Smartphone } from "lucide-react"

type Step = "phone" | "otp" | "success"


export default function PhoneVerificationPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [country, setCountry] = useState("TR")
  const [phone, setPhone] = useState("") // national number part
  const [step, setStep] = useState<Step>("phone")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [smsSending, setSmsSending] = useState(false)
  const [smsVerifying, setSmsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const confirmationRef = useRef<any>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login")
      }
    })
    return () => {
      unsub()
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear()
        } catch {}
      }
    }
  }, [router])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const id = setInterval(() => {
      setResendCooldown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [resendCooldown])

  const normalizePhoneE164 = (raw: string) => {
    const v = raw.trim().replace(/\s+/g, "")
    const cleaned = v.replace(/[^\d+]/g, "")
    if (!cleaned) return ""

    // Already E.164
    if (cleaned.startsWith("+")) return cleaned

    // TR convenience
    if (cleaned.startsWith("0") && cleaned.length === 11) return `+90${cleaned.slice(1)}`
    if (cleaned.startsWith("90") && cleaned.length >= 12) return `+${cleaned}`

    // Fallback: treat as TR local digits
    return `+90${cleaned}`
  }

  const ensureRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" })
    recaptchaRef.current = verifier
    return verifier
  }

  const resetOtp = () => {
    setOtp(Array(6).fill(""))
    otpRefs.current = []
  }

  const fullPhone = useMemo(() => {
    const selected = COUNTRIES.find((c) => c.id === country) || COUNTRIES[0]
    const cc = selected.dial
    const p = phone.trim().replace(/\s+/g, "")
    if (!p) return cc
    // If user pasted a full +E164 number into the national field, respect it
    if (p.startsWith("+")) return p
    return `${cc}${p}`
  }, [country, phone])

  const sendSms = async () => {
    const user = auth.currentUser
    if (!user) {
      router.replace("/login")
      return
    }

    const e164 = normalizePhoneE164(fullPhone)
    if (!e164 || e164.length < 10) {
      toast({
        variant: "destructive",
        title: "Geçersiz numara",
        description: "Lütfen geçerli bir telefon numarası gir.",
      })
      return
    }

    setSmsSending(true)
    try {
      const verifier = ensureRecaptcha()
      const confirmation = await linkWithPhoneNumber(user, e164, verifier)
      confirmationRef.current = confirmation
      setStep("otp")
      setResendCooldown(60)
      toast({
        title: "SMS gönderildi",
        description: `${e164} numarasına doğrulama kodu yollandı.`,
      })
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Gönderilemedi",
        description: e?.message || "SMS gönderilemedi.",
      })
    } finally {
      setSmsSending(false)
    }
  }

  const verifyOtp = async () => {
    const code = otp.join("")
    if (code.length !== 6) return
    const user = auth.currentUser
    if (!user) {
      router.replace("/login")
      return
    }
    const confirmation = confirmationRef.current
    if (!confirmation) {
      toast({
        variant: "destructive",
        title: "Kod bulunamadı",
        description: "Lütfen önce SMS gönder.",
      })
      return
    }

    setSmsVerifying(true)
    try {
      await confirmation.confirm(code)
      await user.reload()
      await setDoc(
        doc(db, "users", user.uid),
        { phone: normalizePhoneE164(fullPhone), phoneVerified: true, updatedAt: serverTimestamp() },
        { merge: true }
      )
      setStep("success")
      toast({ title: "Telefon doğrulandı", description: "Numaran başarıyla doğrulandı." })
      setTimeout(() => router.back(), 700)
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Doğrulanamadı",
        description: e?.message || "Kod doğrulanamadı.",
      })
    } finally {
      setSmsVerifying(false)
    }
  }

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

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const isOtpComplete = useMemo(() => otp.join("").length === 6, [otp])

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.id === country) || COUNTRIES[0]
  }, [country])

  const Stepper = () => (
    <div className="flex items-center justify-center gap-3">
      {[0, 1, 2].map((i) => {
        const isDone = (step === "otp" && i === 0) || step === "success" || (step === "otp" && i === 1 && isOtpComplete)
        const isActive = (step === "phone" && i === 0) || (step === "otp" && i === 1) || (step === "success" && i === 2)
        return (
          <div
            key={i}
            className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
              isDone
                ? "bg-black text-white border-black"
                : isActive
                  ? "border-black text-black"
                  : "border-muted text-muted-foreground"
            }`}
          >
            {isDone ? <Check className="h-4 w-4" /> : i + 1}
          </div>
        )
      })}
    </div>
  )

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Telefon numaranı gir</h1>
        <p className="text-sm text-muted-foreground">Numaranı doğrulamak için SMS göndereceğiz.</p>
      </div>
      <div className="space-y-2">
        <Label>Telefon</Label>
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />

          <div className="flex w-full">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="h-12 w-[150px] rounded-l-lg rounded-r-none border-2 border-r-0 bg-background px-3">
                <div className="flex items-center gap-2">
                  <span>{selectedCountry.flag}</span>
                  <span className="font-medium">{selectedCountry.dial}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="mr-2">{c.flag}</span>
                    <span className="mr-2">{c.name}</span>
                    <span className="text-muted-foreground">({c.dial})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5xx xxx xx xx"
              disabled={smsSending}
              className="h-12 text-base rounded-l-none rounded-r-lg border-2 border-l-0"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
        </div>
      </div>
      <Button
        className="w-full h-12 bg-black text-white hover:bg-black/90"
        onClick={sendSms}
        disabled={smsSending || !phone.trim()}
      >
        {smsSending ? "Gönderiliyor..." : "İleri"}
      </Button>
      <Button variant="ghost" className="w-full h-11" onClick={() => router.back()}>
        Geri dön
      </Button>
    </div>
  )

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">OTP Doğrulama kodunu gir.</h1>
        <p className="text-sm text-muted-foreground">
          Doğrulama kodu şuraya gönderildi: <span className="font-medium text-foreground">{normalizePhoneE164(fullPhone)}</span>
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
              otpRefs.current[idx] = el;
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
          onClick={() => {
            resetOtp()
            sendSms()
          }}
          disabled={smsSending || resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Tekrar gönder (${resendCooldown}s)` : "Kodu yeniden gönder"}
        </button>
        <button
          type="button"
          className="underline"
          onClick={() => {
            setStep("phone")
            resetOtp()
          }}
          disabled={smsVerifying}
        >
          Geri dön
        </button>
      </div>
      <Button
        className="w-full h-12 bg-black text-white hover:bg-black/90"
        onClick={verifyOtp}
        disabled={smsVerifying || !isOtpComplete}
      >
        {smsVerifying ? "Doğrulanıyor..." : "İleri"}
      </Button>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
        <Check className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Doğrulama başarılı</h1>
        <p className="text-sm text-muted-foreground mt-2">Telefon numaran doğrulandı.</p>
      </div>
      <Button className="w-full h-12" onClick={() => router.back()}>
        Tamam
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Stepper />
          <div className="w-9" />
        </div>

        <Card className="p-6 sm:p-8 shadow-lg">
          {step === "phone" && renderPhoneStep()}
          {step === "otp" && renderOtpStep()}
          {step === "success" && renderSuccess()}
        </Card>
      </div>
      <div id="recaptcha-container" className="hidden" />
    </div>
  )
}
