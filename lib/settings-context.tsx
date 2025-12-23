"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export type AppSettings = {
  theme: "system" | "light" | "dark"
  currency: "TRY" | "USD" | "EUR" | "GBP"
  language: "en" | "tr"
  notificationsEnabled: boolean
}

const defaultSettings: AppSettings = {
  theme: "light",
  currency: "TRY",
  language: "en",
  notificationsEnabled: true,
}

type SettingsContextValue = {
  settings: AppSettings
  loading: boolean
  setTheme: (theme: AppSettings["theme"]) => void
  setCurrency: (currency: AppSettings["currency"]) => void
  setLanguage: (language: AppSettings["language"]) => void
  setNotificationsEnabled: (value: boolean) => void
  formatMoney: (amountCents: number) => string
  t: (key: string) => string
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

const translations: Record<string, Record<string, string>> = {
  en: {
    settings: "Settings",
    general: "General",
    profile: "Profile",
    currency: "Currency",
    language: "Language",
    notifications: "Notifications",
    theme: "Theme",
    system: "System",
    light: "Light",
    dark: "Dark",
    permissions: "Permissions",
    help: "Help",
    legal: "Legal",
    inviteRate: "Invite & Rate Us",
    selectCurrency: "Select Currency",
    selectLanguage: "Select Language",
    selectTheme: "Select Theme",
  },
  tr: {
    settings: "Ayarlar",
    general: "Genel",
    profile: "Profil",
    currency: "Para birimi",
    language: "Dil",
    notifications: "Bildirimler",
    theme: "Tema",
    system: "Sistem",
    light: "Açık",
    dark: "Koyu",
    permissions: "İzinler",
    help: "Yardım",
    legal: "Hukuki",
    inviteRate: "Davet Et & Puanla",
    selectCurrency: "Para Birimi Seç",
    selectLanguage: "Dil Seç",
    selectTheme: "Tema Seç",
  },
}

export const getLocale = (settings?: AppSettings) => (settings?.language === "tr" ? "tr-TR" : "en-US")

export const formatMoneyHelper = (amountCents: number, settings?: AppSettings) => {
  const locale = getLocale(settings)
  const currency = settings?.currency ?? defaultSettings.currency
  const safeCents = Number.isFinite(amountCents) ? amountCents : 0

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(safeCents / 100)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unsubUserRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const applyThemeClass = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const shouldUseDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark)

      if (shouldUseDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    applyThemeClass()

    if (settings.theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = () => applyThemeClass()
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }

    return
  }, [settings.theme])

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubUserRef.current) {
          try {
            unsubUserRef.current()
          } catch {}
          unsubUserRef.current = null
        }

        if (!user) {
          setUid(null)
          setSettings(defaultSettings)
          setLoading(false)
          return
        }

        setUid(user.uid)
        const userDocRef = doc(db, "users", user.uid)

        unsubUserRef.current = onSnapshot(
          userDocRef,
          (snap) => {
            const data = snap.data() as any
            const nextSettings = {
              ...defaultSettings,
              ...(typeof data?.settings === "object" ? data.settings : {}),
            } as AppSettings
            setSettings(nextSettings)
            setLoading(false)
          },
          (err) => {
            console.error("Failed to load settings:", err)
            setSettings(defaultSettings)
            setLoading(false)
          },
        )
      },
      (err) => {
        console.error("Auth state error:", err)
        setLoading(false)
      },
    )

    return () => {
      unsubAuth()
      if (unsubUserRef.current) {
        try {
          unsubUserRef.current()
        } catch {}
      }
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  const persistSettings = (next: AppSettings) => {
    if (!uid) return
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, "users", uid),
          {
            settings: next,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )
      } catch (err) {
        console.error("Failed to persist settings:", err)
        toast({
          variant: "destructive",
          title: "Could not save settings",
          description: "Please try again.",
        })
      }
    }, 250)
  }

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...partial }
      persistSettings(merged)
      return merged
    })
  }

  const formatMoney = useMemo(() => {
    return (amountCents: number) => formatMoneyHelper(amountCents, settings)
  }, [settings])

  const t = useMemo(() => {
    const lang = settings.language || "en"
    return (key: string) => translations[lang]?.[key] || translations.en?.[key] || key
  }, [settings.language])

  const value: SettingsContextValue = {
    settings,
    loading,
    setTheme: (theme) => updateSettings({ theme }),
    setCurrency: (currency) => updateSettings({ currency }),
    setLanguage: (language) => updateSettings({ language }),
    setNotificationsEnabled: (value) => updateSettings({ notificationsEnabled: value }),
    formatMoney,
    t,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return ctx
}
