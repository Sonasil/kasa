"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth"
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { getApp } from "firebase/app"
import { getDownloadURL, getStorage, ref as storageRef, uploadBytesResumable } from "firebase/storage"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  AlertCircle,
  BadgeCheck,
  Camera,
  MailCheck,
  Save,
  Smartphone,
  User,
  X,
} from "lucide-react"

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [uid, setUid] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [photoURL, setPhotoURL] = useState("")

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [memberSince, setMemberSince] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  // Track last-loaded values (for dirty state + discard)
  const initialRef = useRef({
    displayName: "",
    email: "",
    phone: "",
    photoURL: "",
  })

  const initials = useMemo(() => {
    const source = displayName.trim() || email.trim()
    if (!source) return ""
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
  }, [displayName, email])

  const isDirty = useMemo(() => {
    const base = initialRef.current
    return (
      displayName !== base.displayName ||
      phone !== base.phone ||
      photoURL !== base.photoURL ||
      !!photoFile
    )
  }, [displayName, phone, photoURL, photoFile])

  const canSave = useMemo(() => {
    if (loading) return false
    if (saving || uploadingPhoto) return false
    if (!uid) return false
    return isDirty
  }, [loading, saving, uploadingPhoto, uid, isDirty])

  const isPasswordUser = useMemo(() => {
    const user = auth.currentUser
    if (!user) return false
    // If any provider is password, allow changing password
    return (user.providerData || []).some((p) => p?.providerId === "password")
  }, [uid])

  const formatMemberSince = (value?: string | Date | null) => {
    if (!value) return ""
    const dateValue = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(dateValue?.getTime?.())) return ""
    return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(dateValue)
  }

  const pickFile = () => fileInputRef.current?.click()

  const validateAndSetPhoto = (f: File | null) => {
    if (!f) {
      setPhotoFile(null)
      return
    }

    if (!f.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Geçersiz dosya",
        description: "Lütfen bir görsel dosyası seç (PNG/JPG/WebP).",
      })
      return
    }

    if (f.size > MAX_AVATAR_BYTES) {
      toast({
        variant: "destructive",
        title: "Dosya çok büyük",
        description: "Profil fotoğrafı en fazla 5MB olabilir.",
      })
      return
    }

    setPhotoFile(f)
  }

  const discardChanges = () => {
    const base = initialRef.current
    setDisplayName(base.displayName)
    setEmail(base.email)
    setPhone(base.phone)
    setPhotoURL(base.photoURL)
    setPhotoFile(null)
    setUploadProgress(0)
    setError(null)
  }

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("")
      return
    }
    const url = URL.createObjectURL(photoFile)
    setPhotoPreview(url)
    return () => {
      try {
        URL.revokeObjectURL(url)
      } catch {}
    }
  }, [photoFile])

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubscribeUserDoc) {
          try {
            unsubscribeUserDoc()
          } catch {}
          unsubscribeUserDoc = null
        }

        if (!user) {
          setUid(null)
          setLoading(false)
          router.replace("/login")
          return
        }

        setUid(user.uid)
        setEmail(user.email ?? "")
        setDisplayName(user.displayName ?? "")
        setPhotoURL(user.photoURL ?? "")
        setEmailVerified(user.emailVerified)

        const formatted = formatMemberSince(user.metadata?.creationTime ?? null)
        if (formatted) setMemberSince(formatted)

        const userDoc = doc(db, "users", user.uid)
        unsubscribeUserDoc = onSnapshot(
          userDoc,
          (snap) => {
            const data: any = snap.data()

            const nextDisplayName =
              typeof data?.displayName === "string" && data.displayName.trim()
                ? data.displayName
                : user.displayName ?? ""
            const nextEmail = typeof data?.email === "string" && data.email ? data.email : user.email ?? ""
            const nextPhone = typeof data?.phone === "string" ? data.phone : ""
            const nextPhotoURL = typeof data?.photoURL === "string" ? data.photoURL : user.photoURL ?? ""

            setDisplayName(nextDisplayName)
            setEmail(nextEmail)
            setPhone(nextPhone)
            setPhotoURL(nextPhotoURL)

            if (data?.createdAt?.toDate) {
              const d = data.createdAt.toDate()
              const formattedDate = formatMemberSince(d)
              if (formattedDate) setMemberSince(formattedDate)
            }

            // update dirty baseline only when we load from Firestore
            initialRef.current = {
              displayName: nextDisplayName,
              email: nextEmail,
              phone: nextPhone,
              photoURL: nextPhotoURL,
            }

            setLoading(false)
          },
          (err) => {
            console.error("Profile load error:", err)
            setError("Profil bilgileri yüklenemedi.")
            setLoading(false)
          }
        )
      },
      (err) => {
        console.error("Auth error:", err)
        setError("Oturum doğrulanamadı.")
        setLoading(false)
      }
    )

    return () => {
      try {
        unsubscribeAuth()
      } catch {}
      if (unsubscribeUserDoc) {
        try {
          unsubscribeUserDoc()
        } catch {}
      }
    }
  }, [router])

  const uploadProfilePhotoIfNeeded = async () => {
    if (!photoFile || !uid) return null

    const storage = getStorage(getApp())
    const safeName = photoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `users/${uid}/avatar_${Date.now()}_${safeName}`
    const r = storageRef(storage, path)

    setUploadingPhoto(true)
    setUploadProgress(0)

    return await new Promise<string>((resolve, reject) => {
      const task = uploadBytesResumable(r, photoFile, { contentType: photoFile.type || "image/jpeg" })
      task.on(
        "state_changed",
        (snap) => {
          const pct = snap.totalBytes ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100) : 0
          setUploadProgress(pct)
        },
        (err) => {
          setUploadingPhoto(false)
          reject(err)
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref)
            setUploadingPhoto(false)
            resolve(url)
          } catch (e) {
            setUploadingPhoto(false)
            reject(e)
          }
        }
      )
    })
  }

  const handleSave = async () => {
    setError(null)
    const user = auth.currentUser
    if (!user || !uid) {
      router.replace("/login")
      return
    }

    const trimmedName = displayName.trim()

    setSaving(true)
    try {
      const uploadedUrl = await uploadProfilePhotoIfNeeded()
      const finalPhotoUrl = (uploadedUrl ?? photoURL).trim()

      await updateProfile(user, {
        displayName: trimmedName || undefined,
        photoURL: finalPhotoUrl || undefined,
      })

      await setDoc(
        doc(db, "users", uid),
        {
          displayName: trimmedName,
          email,
          phone: phone.trim(),
          photoURL: finalPhotoUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      // Update baseline after save
      initialRef.current = {
        displayName: trimmedName,
        email,
        phone: phone.trim(),
        photoURL: finalPhotoUrl,
      }

      setPhotoFile(null)
      setUploadProgress(0)

      toast({
        title: "Profil güncellendi",
        description: "Bilgilerin kaydedildi.",
      })
    } catch (e: any) {
      const message = e?.message || "Profil güncellenemedi."
      setError(message)
      toast({
        variant: "destructive",
        title: "Kaydedilemedi",
        description: message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSendVerification = async () => {
    if (sendingVerification) return

    const user = auth.currentUser
    if (!user) {
      router.replace("/login")
      return
    }

    if (user.emailVerified) {
      toast({
        title: "Zaten doğrulanmış",
        description: "E-posta adresin zaten doğrulanmış görünüyor.",
      })
      setEmailVerified(true)
      return
    }

    setSendingVerification(true)
    try {
      await sendEmailVerification(user)

      // Refresh local auth state so UI updates when the user verifies later
      try {
        await user.reload()
      } catch {}
      setEmailVerified(auth.currentUser?.emailVerified ?? user.emailVerified)

      toast({
        title: "Doğrulama e-postası gönderildi",
        description: "Gelen kutunu (spam dahil) kontrol et.",
      })
    } catch (e: any) {
      const code = e?.code as string | undefined
      const msg =
        code === "auth/too-many-requests"
          ? "Çok fazla istek yapıldı. Lütfen biraz bekleyip tekrar dene."
          : e?.message || "E-posta gönderilemedi."

      toast({
        variant: "destructive",
        title: "Gönderilemedi",
        description: msg,
      })
    } finally {
      setSendingVerification(false)
    }
  }

  const handleChangePassword = async () => {
    const user = auth.currentUser
    if (!user) {
      router.replace("/login")
      return
    }

    // Password change requires email/password sign-in
    if (!user.email || !isPasswordUser) {
      toast({
        variant: "destructive",
        title: "Bu hesap için desteklenmiyor",
        description: "Google ile giriş yaptığın için bu ekrandan şifre değiştiremezsin.",
      })
      return
    }

    const cur = currentPassword
    const next = newPassword
    const confirm = confirmNewPassword

    if (!cur || !next || !confirm) {
      toast({
        variant: "destructive",
        title: "Eksik bilgi",
        description: "Lütfen mevcut şifreyi ve yeni şifreyi (tekrar) doldur.",
      })
      return
    }

    if (next.length < 6) {
      toast({
        variant: "destructive",
        title: "Şifre çok kısa",
        description: "Yeni şifre en az 6 karakter olmalı.",
      })
      return
    }

    if (next !== confirm) {
      toast({
        variant: "destructive",
        title: "Şifreler eşleşmiyor",
        description: "Yeni şifre ve tekrarı aynı olmalı.",
      })
      return
    }

    if (cur === next) {
      toast({
        variant: "destructive",
        title: "Geçersiz şifre",
        description: "Yeni şifre mevcut şifre ile aynı olamaz.",
      })
      return
    }

    setChangingPassword(true)
    try {
      const cred = EmailAuthProvider.credential(user.email, cur)
      await reauthenticateWithCredential(user, cred)
      await updatePassword(user, next)

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")

      toast({
        title: "Şifre güncellendi",
        description: "Şifren başarıyla değiştirildi.",
      })
    } catch (e: any) {
      const code = e?.code as string | undefined
      const msg =
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Mevcut şifre yanlış."
          : code === "auth/too-many-requests"
            ? "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar dene."
            : code === "auth/requires-recent-login"
              ? "Güvenlik için tekrar giriş yapman gerekiyor. Çıkış yapıp yeniden giriş yap ve tekrar dene."
              : e?.message || "Şifre değiştirilemedi."

      toast({
        variant: "destructive",
        title: "Şifre değiştirilemedi",
        description: msg,
      })
    } finally {
      setChangingPassword(false)
    }
  };

  const handleForgotPassword = async () => {
    const user = auth.currentUser
    const targetEmail = email || user?.email || ""

    if (!targetEmail) {
      toast({
        variant: "destructive",
        title: "E-posta bulunamadı",
        description: "Şifre sıfırlamak için e-posta adresi gerekiyor.",
      })
      return
    }

    // Only meaningful for password users
    if (!isPasswordUser) {
      toast({
        variant: "destructive",
        title: "Bu hesap için desteklenmiyor",
        description: "Google ile giriş yaptığın için şifre sıfırlama e-postası gönderilmez.",
      })
      return
    }

    try {
      await sendPasswordResetEmail(auth, targetEmail)
      toast({
        title: "Şifre sıfırlama e-postası gönderildi",
        description: "Gelen kutunu kontrol et. (SMS değil, e-posta ile gönderilir.)",
      })
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Gönderilemedi",
        description: e?.message || "Şifre sıfırlama e-postası gönderilemedi.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  const activeAvatarSrc = photoPreview || photoURL

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky unsaved changes bar */}
      {isDirty && (
        <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-4xl px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Save className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Kaydedilmemiş değişiklikler var</span>
              {uploadingPhoto ? (
                <span className="text-xs text-muted-foreground">• Fotoğraf yükleniyor (%{uploadProgress})</span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={discardChanges} disabled={saving || uploadingPhoto}>
                <X className="mr-2 h-4 w-4" />
                Vazgeç
              </Button>
              <Button type="button" onClick={handleSave} disabled={!canSave}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl p-3 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Profil Ayarları</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Üyelik: {memberSince || "—"}</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* PROFILE */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Profil</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Fotoğrafını ve temel bilgilerini güncelle.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="relative group w-fit"
              onClick={pickFile}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const f = e.dataTransfer.files?.[0] || null
                validateAndSetPhoto(f)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") pickFile()
              }}
              aria-label="Profil fotoğrafı seç"
            >
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-1 ring-border group-hover:ring-2 group-hover:ring-primary transition">
                {activeAvatarSrc ? <AvatarImage src={activeAvatarSrc} alt={displayName || "Avatar"} /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border shadow-sm flex items-center justify-center">
                <Camera className="h-4 w-4" />
              </div>

              {uploadingPhoto ? (
                <div className="absolute inset-0 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xs font-medium">%{uploadProgress}</span>
                </div>
              ) : null}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{displayName || "(İsim yok)"}</p>
              <p className="text-xs text-muted-foreground">{email || ""}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Fotoğrafı değiştirmek için avatar'a tıkla veya sürükle-bırak yap.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => validateAndSetPhoto(e.target.files?.[0] || null)}
                disabled={saving || uploadingPhoto}
              />

              {photoFile ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => validateAndSetPhoto(null)} disabled={saving || uploadingPhoto}>
                    Seçimi kaldır
                  </Button>
                </div>
              ) : null}

              {uploadingPhoto ? (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Fotoğraf yükleniyor… %{uploadProgress}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display-name">Görünen ad</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ad Soyad"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90..."
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ACCOUNT */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Hesap</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">E-posta doğrulama ve hesap durumunu yönet.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="flex items-center gap-2">
                <MailCheck className="h-4 w-4 text-muted-foreground" />
                <Input id="email" value={email} disabled readOnly />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                    emailVerified
                      ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {emailVerified ? "Doğrulandı" : "Doğrulanmadı"}
                </div>

                {!emailVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={saving || sendingVerification}
                  >
                    {sendingVerification ? "Gönderiliyor..." : "Doğrulama gönder"}
                  </Button>
                )}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Doğrulanmış e-posta, bazı güvenlik işlemleri için gerekli olabilir.
              </p>
            </div>
          </div>
        </Card>

        {/* SECURITY */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold">Güvenlik</h2>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Şifre</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Mevcut şifreni doğrulayarak yeni şifre belirleyebilirsin.
                </p>
              </div>

              {!isPasswordUser ? (
                <div className="sm:col-span-2 rounded-md border bg-muted/40 p-3 text-xs sm:text-sm text-muted-foreground">
                  Google ile giriş yaptığın için bu ekrandan şifre değiştirme kapalıdır.
                </div>
              ) : null}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="current-password">Mevcut şifre</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={!isPasswordUser || changingPassword || saving || uploadingPhoto}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni şifre</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  disabled={!isPasswordUser || changingPassword || saving || uploadingPhoto}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Yeni şifre (tekrar)</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  disabled={!isPasswordUser || changingPassword || saving || uploadingPhoto}
                  autoComplete="new-password"
                />
              </div>

              <div className="sm:col-span-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChangePassword}
                  disabled={!isPasswordUser || changingPassword || saving || uploadingPhoto}
                  className="w-full sm:w-auto"
                >
                  {changingPassword ? "Güncelleniyor..." : "Şifreyi güncelle"}
                </Button>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleForgotPassword}
                  disabled={!isPasswordUser || changingPassword || saving || uploadingPhoto}
                  className="px-0"
                >
                  Şifremi unuttum
                </Button>
                <p className="text-xs text-muted-foreground">
                  Şifre sıfırlama bağlantısı kayıtlı e-posta adresine gönderilir.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Fallback save button (when no sticky bar is visible) */}
        {!isDirty && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!canSave} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
