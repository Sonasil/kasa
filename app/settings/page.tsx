"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSettings, type AppSettings } from "@/lib/settings-context"
import {
  ArrowLeft,
  User,
  DollarSign,
  Globe,
  Bell,
  Camera,
  ImageIcon,
  Users,
  FileText,
  Shield,
  Scale,
  HelpCircle,
  Mail,
  AlertCircle,
  Share2,
  Star,
  ChevronRight,
  Search,
  Home,
  Wallet,
  Palette,
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { settings, setCurrency, setLanguage, setNotificationsEnabled, setTheme, loading, t } = useSettings()
  const [hydrating, setHydrating] = useState(true)
  const [profileName, setProfileName] = useState<string>("")
  const [profileEmail, setProfileEmail] = useState<string>("")

  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false)
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login")
        return
      }

      setProfileName(user.displayName || "")
      setProfileEmail(user.email || "")
    })

    return () => {
      try { unsubAuth() } catch {}
    }
  }, [router])

  useEffect(() => {
    if (!loading) {
      setHydrating(false)
    }
  }, [loading])

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked)
    toast({
      title: checked ? t("notificationsEnabled") : t("notificationsDisabled"),
      description: checked ? t("willReceive") : t("wontReceive"),
    })
  }

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as AppSettings["currency"])
    setCurrencyDialogOpen(false)
    toast({
      title: t("currencyUpdated"),
      description: `${t("currencySet")} ${value}`,
    })
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value as AppSettings["language"])
    setLanguageDialogOpen(false)
    toast({
      title: t("languageUpdated"),
      description: `${t("languageSet")} ${value === "en" ? "English" : "Türkçe"}`,
    })
  }

  const handleThemeChange = (value: string) => {
    setTheme(value as AppSettings["theme"])
    setThemeDialogOpen(false)
    toast({
      title: t("themeUpdated"),
      description: value === "system" ? t("followingSystem") : `${t("switchedTo")} ${value} mode`,
    })
  }

  const handlePermissionClick = (permission: string) => {
    setSelectedPermission(permission)
    setPermissionDialogOpen(true)
  }

  const handleInviteFriends = () => {
    toast({
      title: t("inviteLinkCopied"),
      description: t("shareLink"),
    })
  }

  const handleRateUs = () => {
    toast({
      title: t("thankYou"),
      description: t("redirecting"),
    })
  }

  if (hydrating) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="border-b bg-card">
          <div className="mx-auto max-w-4xl p-3 sm:p-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="mx-auto max-w-4xl p-3 sm:p-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  const settingsSections = [
    {
      title: t("general"),
      items: [
        {
          icon: User,
          title: t("profile"),
          subtitle: t("manageProfileInfo"),
          onClick: () => router.push("/profile/settings"),
          type: "navigation" as const,
        },
        {
          icon: DollarSign,
          title: t("currency"),
          subtitle: settings.currency,
          onClick: () => setCurrencyDialogOpen(true),
          type: "navigation" as const,
        },
        {
          icon: Palette,
          title: t("theme"),
          subtitle: settings.theme === "system" ? t("system") : settings.theme === "dark" ? t("dark") : t("light"),
          onClick: () => setThemeDialogOpen(true),
          type: "navigation" as const,
        },
        {
          icon: Globe,
          title: t("language"),
          subtitle: settings.language === "en" ? "English" : "Türkçe",
          onClick: () => setLanguageDialogOpen(true),
          type: "navigation" as const,
        },

      ],
    },
    {
      title: t("permissions"),
      items: [
        {
          icon: Camera,
          title: t("camera"),
          subtitle: t("allowed"),
          onClick: () => handlePermissionClick(t("camera")),
          type: "navigation" as const,
        },
        {
          icon: ImageIcon,
          title: t("photosMedia"),
          subtitle: t("allowed"),
          onClick: () => handlePermissionClick(t("photosMedia")),
          type: "navigation" as const,
        },
        {
          icon: Users,
          title: t("contacts"),
          subtitle: t("denied"),
          onClick: () => handlePermissionClick(t("contacts")),
          type: "navigation" as const,
        },
        {
          icon: Bell,
          title: t("notifications"),
          subtitle: t("enableNotifications"),
          checked: settings.notificationsEnabled,
          onCheckedChange: handleNotificationToggle,
          type: "toggle" as const,
        },
      ],
    },
    {
      title: t("legal"),
      items: [
        {
          icon: FileText,
          title: t("termsOfService"),
          subtitle: t("readTerms"),
          onClick: () => router.push("/legal/terms"),
          type: "navigation" as const,
        },
        {
          icon: Shield,
          title: t("privacyPolicy"),
          subtitle: t("protectData"),
          onClick: () => router.push("/legal/privacy"),
          type: "navigation" as const,
        },
        {
          icon: Scale,
          title: t("cookiePolicy"),
          subtitle: t("cookiePolicyDesc"),
          onClick: () => router.push("/legal/cookies"),
          type: "navigation" as const,
        },
      ],
    },
    {
      title: t("help"),
      items: [
        {
          icon: HelpCircle,
          title: t("faq"),
          subtitle: t("frequentlyAsked"),
          onClick: () => toast({ title: t("faq"), description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: Mail,
          title: t("contactSupport"),
          subtitle: t("getHelp"),
          onClick: () => toast({ title: t("contactSupport"), description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: AlertCircle,
          title: t("reportProblem"),
          subtitle: t("letUsKnow"),
          onClick: () => toast({ title: t("reportProblem"), description: "Opening..." }),
          type: "navigation" as const,
        },
      ],
    },
    {
      title: t("inviteRate"),
      items: [
        {
          icon: Share2,
          title: t("inviteFriends"),
          subtitle: t("shareKasa"),
          onClick: handleInviteFriends,
          type: "action" as const,
        },
        {
          icon: Star,
          title: t("rateUs"),
          subtitle: t("rateAppStore"),
          onClick: handleRateUs,
          type: "navigation" as const,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-4xl p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.replace("/profile")} className="h-8 w-8 sm:h-9 sm:w-9">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">{t("settings")}</h1>
            <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {profileName ? profileName : ""}{profileName && profileEmail ? " • " : ""}{profileEmail ? profileEmail : ""}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchSettings")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 sm:h-10"
            />
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="mx-auto max-w-4xl p-3 sm:p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">{section.title}</h2>
            <Card className="divide-y">
              {section.items.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    onClick={item.type !== "toggle" ? item.onClick : undefined}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-accent transition-colors text-left ${item.type !== "toggle" ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.subtitle}</p>
                      )}
                    </div>
                    {item.type === "toggle" ? (
                      <Switch checked={item.checked} onCheckedChange={item.onCheckedChange} aria-label={item.title} onClick={(e) => e.stopPropagation()} />
                    ) : (
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                )
              })}
            </Card>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>HesAppcım v1.0.0</p>
          <p className="mt-1">© 2025 HesAppcım. {t("allRightsReserved")}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-around p-2">
            <button
              onClick={() => router.push("/groups")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label={t("navGroups")}
            >
              <Wallet className="h-6 w-6 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label={t("navHome")}
            >
              <Home className="h-6 w-6 text-muted-foreground" />
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label={t("navProfile")}
            >
              <User className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Currency Dialog */}
      <Dialog open={currencyDialogOpen} onOpenChange={setCurrencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("selectCurrency")}</DialogTitle>
          </DialogHeader>
          <Select value={settings.currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRY">Turkish Lira (₺)</SelectItem>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="GBP">British Pound (£)</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      {/* Language Dialog */}
      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("selectLanguage")}</DialogTitle>
          </DialogHeader>
          <Select value={settings.language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="tr">Türkçe</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      {/* Theme Dialog */}
      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("selectTheme")}</DialogTitle>
          </DialogHeader>
          <Select value={settings.theme} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">{t("system")}</SelectItem>
              <SelectItem value="light">{t("light")}</SelectItem>
              <SelectItem value="dark">{t("dark")}</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>

      {/* Permission Dialog */}
      <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPermission} {t("permission")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("permissionAllows")} {selectedPermission?.toLowerCase()}. {t("changeInSettings")}.
            </p>
            <Button onClick={() => setPermissionDialogOpen(false)} className="w-full">
              {t("gotIt")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
