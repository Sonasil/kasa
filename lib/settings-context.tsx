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
    // Settings
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
    
    // Groups List
    groupsTitle: "Groups",
    createNewGroup: "Create New Group",
    joinGroup: "Join Group",
    joinViaCode: "Join via Code",
    groupName: "Group Name",
    enterGroupName: "Weekend Trip, Apartment, etc.",
    inviteCode: "Invite Code",
    enterInviteCode: "Enter invite code",
    noGroupsYet: "No groups yet",
    noGroupsDesc: "Create a new group or join an existing one to start tracking expenses with friends and family.",
    membersCount: "members",
    totalExpenses: "Total expenses",
    groupCreated: "Group created",
    groupCreatedDesc: "has been created successfully",
    joinedGroup: "Joined group",
    joinedGroupDesc: "You've successfully joined the group",
    invalidInput: "Invalid input",
    enterGroupNameError: "Please enter a group name",
    enterInviteCodeError: "Please enter an invite code",
    
    // Status Dialog
    groupBalance: "Group Balance",
    netBalance: "Net Balance",
    youOwe: "You owe",
    youreOwed: "You're owed",
    allSettled: "All Settled!",
    noOutstandingDebts: "No outstanding debts",
    debts: "Debts",
    owes: "owes",
    you: "you",
    You: "You",
    
    // Record Payment
    recordPayment: "Record Payment",
    trackPayments: "Track received payments",
    member: "Member",
    selectMember: "Select member",
    amount: "Amount",
    paymentType: "Payment Type",
    full: "Full",
    custom: "Custom",
    partial: "Partial",
    enterAmount: "Enter amount",
    recording: "Recording...",
    
    // Expense Management
    addExpense: "Add Expense",
    description: "Description",
    groceriesEtc: "Groceries, dinner, etc.",
    category: "Category (optional)",
    selectCategory: "Select a category",
    enterCustomCategory: "Enter custom category",
    splitWith: "Split with",
    adding: "Adding...",
    saving: "Saving...",
    saveChanges: "Save Changes",
    expenseDetails: "Expense Details",
    
    // Categories
    electricity: "Electricity",
    water: "Water",
    groceries: "Groceries/Market",
    internet: "Internet",
    rent: "Rent",
    transport: "Transport",
    dining: "Dining",
    entertainment: "Entertainment",
    other: "Other",
    
    // Group Page
    status: "Status",
    members: "Members",
    feed: "Feed",
    group: "Group",
    sendMessage: "Send a message",
    typeMessage: "Type a message...",
    markAsPaid: "Mark as Paid",
    edit: "Edit",
    deleteExpense: "Delete Expense",
    paidBy: "Paid by",
    splitBetween: "Split between",
    
    // Error/Success Messages
    error: "Error",
    success: "Success",
    invalidAmount: "Invalid amount",
    pleaseTryAgain: "Please try again.",
    failedToLoad: "Failed to load",
    paymentRecorded: "Payment recorded",
    expenseAdded: "Expense added successfully",
    expenseUpdated: "Expense updated successfully",
    paymentMarked: "Payment marked",
    couldNotSave: "Could not save settings",
    goBack: "Go Back",
    noActivityYet: "No activity yet",
    settlementRecorded: "Settlement recorded",
    memberJoined: "Member joined",
    someone: "Someone",
    groupMembers: "Group Members",
    owner: "Owner",
    transferOwnership: "Transfer Ownership",
    removeMember: "Remove Member",
    generateInviteCode: "Generate Invite Code",
    generateInviteCodeDesc: "Generate a code to share with others",
    leaveGroup: "Leave Group",
    leaveGroupDesc: "You can leave this group anytime.",
    leaveGroupOwnerDesc: "You're the group owner. Transfer ownership to someone else before leaving.",
    leaveGroupLastMemberDesc: "You're the last member. Leaving will permanently delete this group.",
    useMenuToTransfer: "Use the ⋮ menu next to a member to transfer ownership.",

    
    // Time
    justNow: "Just now",
    minutesAgo: "m ago",
    hoursAgo: "h ago",
    daysAgo: "d ago",
    
    // Common
    cancel: "Cancel",
    close: "Close",
    delete: "Delete",
    update: "Update",
    save: "Save",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    
    // Auth
    welcomeToKasa: "Welcome to Kasa",
    signInDesc: "Sign in to manage your shared expenses",
    createAccount: "Create your account",
    joinKasaDesc: "Join Kasa to start sharing expenses with friends",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    loginWithGoogle: "Login with Google",
    signingIn: "Signing in...",
    connecting: "Connecting...",
    creatingAccount: "Creating account...",
    fullName: "Full Name",
    confirmPassword: "Confirm Password",
    enterPassword: "Enter your password",
    enterPasswordConfirm: "Re-enter your password",
    createStrongPassword: "Create a strong password",
    googleSignInFailed: "Google sign-in failed. Please try again.",
    signInFailed: "Sign in failed. Please check your credentials.",
    
    // Password Strength
    passwordStrength: "Password strength:",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
    atLeast8Chars: "At least 8 characters",
    upperAndLowerCase: "Upper and lowercase letters",
    atLeastOneNumber: "At least one number",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooWeak: "Password is too weak",
    invalidEmail: "Invalid email address",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    nameRequired: "Full name is required",
    
    // Profile
    profileUpdated: "Profile updated",
    profileSaved: "Your profile has been saved.",
    couldNotSaveProfile: "Could not save profile",
    totalSpent: "Total Spent",
    balance: "Balance",
    appSettings: "App Settings",
    preferencesPermissions: "Preferences and permissions",
    ksExpenseApp: "Kasa Expense Sharing App",
    signOutConfirmTitle: "Sign Out",
    signOutConfirmDesc: "Are you sure you want to sign out? You'll need to sign in again to access your groups and expenses.",
    memberSince: "Member since",
    noName: "(No name)",
    paid: "paid",
    people: "people",
    hello: "Hello",

    expenseOverview: "Here's your expense overview",
    
    // Toasts
    invalidSplitAmount: "Invalid split amount",
    splitMismatch: "Split amounts don't match",
    inviteCodeGenerated: "Invite code generated",
    copiedToClipboard: "Copied to clipboard",
    memberRemoved: "Member removed",
    ownershipTransferred: "Ownership transferred",
    leftGroup: "Left group",
    transferOwnershipFirst: "Transfer ownership first",
    paymentReceived: "Payment received",
    createFailed: "Create failed",
    joinFailed: "Join failed",
    invalidCode: "Invalid code",
    inviteMissingGroup: "Invite is missing group information",
    groupNotFound: "Group not found",
  },
  tr: {
    // Settings
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
    
    // Groups List
    groupsTitle: "Gruplar",
    createNewGroup: "Yeni Grup Oluştur",
    joinGroup: "Gruba Katıl",
    joinViaCode: "Kod ile Katıl",
    groupName: "Grup Adı",
    enterGroupName: "Hafta sonu gezisi, Ev, vb.",
    inviteCode: "Davet Kodu",
    enterInviteCode: "Davet kodu gir",
    noGroupsYet: "Henüz grup yok",
    noGroupsDesc: "Arkadaşlarınızla ve ailenizle harcamaları takip etmek için yeni bir grup oluşturun veya mevcut bir gruba katılın.",
    membersCount: "üye",
    totalExpenses: "Toplam harcama",
    groupCreated: "Grup oluşturuldu",
    groupCreatedDesc: "başarıyla oluşturuldu",
    joinedGroup: "Gruba katıldınız",
    joinedGroupDesc: "Gruba başarıyla katıldınız",
    invalidInput: "Geçersiz giriş",
    enterGroupNameError: "Lütfen bir grup adı girin",
    enterInviteCodeError: "Lütfen bir davet kodu girin",
    
    // Status Dialog
    groupBalance: "Grup Bakiyesi",
    netBalance: "Net Bakiye",
    youOwe: "Borçlusun",
    youreOwed: "Alacaklısın",
    allSettled: "Herkes Ödedi!",
    noOutstandingDebts: "Bekleyen borç yok",
    debts: "Borçlar",
    owes: "borçlu",
    you: "sana",
    You: "Sen",
    
    // Record Payment
    recordPayment: "Ödeme Kaydet",
    trackPayments: "Alınan ödemeleri kaydet",
    member: "Üye",
    selectMember: "Üye seç",
    amount: "Tutar",
    paymentType: "Ödeme Tipi",
    full: "Tam",
    custom: "Özel",
    partial: "Kısmi",
    enterAmount: "Tutar gir",
    recording: "Kaydediliyor...",
    
    // Expense Management
    addExpense: "Harcama Ekle",
    description: "Açıklama",
    groceriesEtc: "Market, yemek, vs.",
    category: "Kategori (opsiyonel)",
    selectCategory: "Kategori seç",
    enterCustomCategory: "Özel kategori gir",
    splitWith: "Paylaşım",
    adding: "Ekleniyor...",
    saving: "Kaydediliyor...",
    saveChanges: "Değişiklikleri Kaydet",
    expenseDetails: "Harcama Detayları",
    
    // Categories  
    electricity: "Elektrik",
    water: "Su",
    groceries: "Market",
    internet: "İnternet",
    rent: "Kira",
    transport: "Ulaşım",
    dining: "Yemek",
    entertainment: "Eğlence",
    other: "Diğer",
    
    // Group Page
    status: "Durum",
    members: "Üyeler",
    feed: "Akış",
    group: "Grup",
    sendMessage: "Mesaj gönder",
    typeMessage: "Mesaj yaz...",
    markAsPaid: "Ödendi Olarak İşaretle",
    edit: "Düzenle",
    deleteExpense: "Harcamayı Sil",
    paidBy: "Ödeyen",
    splitBetween: "Paylaşanlar",
    
    // Error/Success Messages
    error: "Hata",
    success: "Başarılı",
    invalidAmount: "Geçersiz tutar",
    pleaseTryAgain: "Lütfen tekrar deneyin.",
    failedToLoad: "Yüklenemedi",
    paymentRecorded: "Ödeme kaydedildi",
    expenseAdded: "Harcama başarıyla eklendi",
    expenseUpdated: "Harcama başarıyla güncellendi",
    paymentMarked: "Ödeme işaretlendi",
    couldNotSave: "Ayarlar kaydedilemedi",
    
    // Time
    justNow: "Şimdi",
    minutesAgo: "dk önce",
    hoursAgo: "sa önce",
    daysAgo: "gün önce",
    
    // Common
    cancel: "İptal",
    close: "Kapat",
    delete: "Sil",
    update: "Güncelle",
    save: "Kaydet",
    email: "E-posta",
    password: "Şifre",
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    signOut: "Çıkış Yap",
    
    // Auth
    welcomeToKasa: "Kasa'ya Hoşgeldiniz",
    signInDesc: "Paylaşılan harcamalarınızı yönetmek için giriş yapın",
    createAccount: "Hesabınızı oluşturun",
    joinKasaDesc: "Arkadaşlarınızla harcama paylaşmak için Kasa'ya katılın",
    orContinueWith: "veya şununla devam et",
    dontHaveAccount: "Hesabınız yok mu?",
    alreadyHaveAccount: "Zaten hesabınız var mı?",
    loginWithGoogle: "Google ile giriş yap",
    signingIn: "Giriş yapılıyor...",
    connecting: "Bağlanılıyor...",
    creatingAccount: "Hesap oluşturuluyor...",
    fullName: "Ad Soyad",
    confirmPassword: "Şifreyi Onayla",
    enterPassword: "Şifrenizi girin",
    enterPasswordConfirm: "Şifrenizi tekrar girin",
    createStrongPassword: "Güçlü bir şifre oluşturun",
    googleSignInFailed: "Google ile giriş başarısız. Lütfen tekrar deneyin.",
    signInFailed: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
    
    // Password Strength
    passwordStrength: "Şifre gücü:",
    weak: "Zayıf",
    fair: "Orta",
    good: "İyi",
    strong: "Güçlü",
    atLeast8Chars: "En az 8 karakter",
    upperAndLowerCase: "Büyük ve küçük harfler",
    atLeastOneNumber: "En az bir rakam",
    passwordsDoNotMatch: "Şifreler eşleşmiyor",
    passwordTooWeak: "Şifre çok zayıf",
    invalidEmail: "Geçersiz e-posta adresi",
    emailRequired: "E-posta gereklidir",
    passwordRequired: "Şifre gereklidir",
    nameRequired: "Ad soyad gereklidir",
    
    // Profile
    profileUpdated: "Profil güncellendi",
    profileSaved: "Profiliniz kaydedildi.",
    couldNotSaveProfile: "Profil kaydedilemedi",
    totalSpent: "Toplam Harcama",
    balance: "Bakiye",
    appSettings: "Uygulama Ayarları",
    preferencesPermissions: "Tercihler ve izinler",
    ksExpenseApp: "Kasa Harcama Paylaşım Uygulaması",
    signOutConfirmTitle: "Çıkış Yap",
    signOutConfirmDesc: "Çıkış yapmak istediğinize emin misiniz? Gruplarınıza ve harcamalarınıza erişmek için tekrar giriş yapmanız gerekecek.",
    memberSince: "Üyelik tarihi",
    noName: "(İsimsiz)",
    paid: "ödedi",
    people: "kişi",
    hello: "Merhaba",

    expenseOverview: "Harcama özetiniz",
    
    // Toasts
    invalidSplitAmount: "Geçersiz paylaşım tutarı",
    splitMismatch: "Paylaşım tutarları eşleşmiyor",
    inviteCodeGenerated: "Davet kodu oluşturuldu",
    copiedToClipboard: "Panoya kopyalandı",
    memberRemoved: "Üye çıkarıldı",
    ownershipTransferred: "Sahiplik devredildi",
    leftGroup: "Gruptan ayrıldı",
    transferOwnershipFirst: "Önce sahipliği devredin",
    paymentReceived: "Ödeme alındı",
    createFailed: "Oluşturma başarısız",
    joinFailed: "Katılma başarısız",
    invalidCode: "Geçersiz kod",
    inviteMissingGroup: "Davet grup bilgisi içermiyor",
    groupNotFound: "Grup bulunamadı",
    goBack: "Geri Dön",
    noActivityYet: "Henüz harcama yok",
    settlementRecorded: "Ödeme kaydedildi",
    memberJoined: "Üye katıldı",
    someone: "Biri",
    groupMembers: "Grup Üyeleri",
    owner: "Kurucu",
    transferOwnership: "Sahipliği Devret",
    removeMember: "Üyeyi Çıkar",
    generateInviteCode: "Davet Kodu Oluştur",
    generateInviteCodeDesc: "Başkalarıyla paylaşmak için kod oluşturun",
    leaveGroup: "Gruptan Ayrıl",
    leaveGroupDesc: "İstediğiniz zaman gruptan ayrılabilirsiniz.",
    leaveGroupOwnerDesc: "Grup kurucusunuz. Ayrılmadan önce sahipliği başkasına devretmelisiniz.",
    leaveGroupLastMemberDesc: "Son üyesiniz. Ayrılırsanız grup kalıcı olarak silinecek.",
    useMenuToTransfer: "Sahipliği devretmek için üyenin yanındaki ⋮ menüsünü kullanın.",

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
