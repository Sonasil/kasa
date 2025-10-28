"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
} from "lucide-react"

const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex@example.com",
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [currency, setCurrency] = useState("TRY")
  const [language, setLanguage] = useState("en")

  // Dialog states
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false)
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null)

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked)
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: checked ? "You will receive app notifications" : "You won't receive app notifications",
    })
  }

  const handleCurrencyChange = (value: string) => {
    setCurrency(value)
    setCurrencyDialogOpen(false)
    toast({
      title: "Currency updated",
      description: `Default currency set to ${value}`,
    })
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setLanguageDialogOpen(false)
    toast({
      title: "Language updated",
      description: `Language set to ${value === "en" ? "English" : "Türkçe"}`,
    })
  }

  const handlePermissionClick = (permission: string) => {
    setSelectedPermission(permission)
    setPermissionDialogOpen(true)
  }

  const handleInviteFriends = () => {
    toast({
      title: "Invite link copied",
      description: "Share this link with your friends to invite them",
    })
  }

  const handleRateUs = () => {
    toast({
      title: "Thank you!",
      description: "Redirecting to app store...",
    })
  }

  if (loading) {
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
      title: "General",
      items: [
        {
          icon: User,
          title: "Profile",
          subtitle: "Manage your profile information",
          onClick: () => router.push("/profile"),
          type: "navigation" as const,
        },
        {
          icon: DollarSign,
          title: "Currency",
          subtitle: currency,
          onClick: () => setCurrencyDialogOpen(true),
          type: "navigation" as const,
        },
        {
          icon: Globe,
          title: "Language",
          subtitle: language === "en" ? "English" : "Türkçe",
          onClick: () => setLanguageDialogOpen(true),
          type: "navigation" as const,
        },
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Enable app notifications",
          checked: notificationsEnabled,
          onCheckedChange: handleNotificationToggle,
          type: "toggle" as const,
        },
      ],
    },
    {
      title: "Permissions",
      items: [
        {
          icon: Camera,
          title: "Camera",
          subtitle: "Allowed",
          onClick: () => handlePermissionClick("Camera"),
          type: "navigation" as const,
        },
        {
          icon: ImageIcon,
          title: "Photos & Media",
          subtitle: "Allowed",
          onClick: () => handlePermissionClick("Photos & Media"),
          type: "navigation" as const,
        },
        {
          icon: Users,
          title: "Contacts",
          subtitle: "Denied",
          onClick: () => handlePermissionClick("Contacts"),
          type: "navigation" as const,
        },
        {
          icon: Bell,
          title: "Notifications",
          subtitle: "Allowed",
          onClick: () => handlePermissionClick("Notifications"),
          type: "navigation" as const,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          icon: FileText,
          title: "Terms of Service",
          subtitle: "Read our terms",
          onClick: () => toast({ title: "Terms of Service", description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: Shield,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          onClick: () => toast({ title: "Privacy Policy", description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: Scale,
          title: "Licenses",
          subtitle: "Open source licenses",
          onClick: () => toast({ title: "Licenses", description: "Opening..." }),
          type: "navigation" as const,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          icon: HelpCircle,
          title: "FAQ",
          subtitle: "Frequently asked questions",
          onClick: () => toast({ title: "FAQ", description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: Mail,
          title: "Contact Support",
          subtitle: "Get help from our team",
          onClick: () => toast({ title: "Contact Support", description: "Opening..." }),
          type: "navigation" as const,
        },
        {
          icon: AlertCircle,
          title: "Report a Problem",
          subtitle: "Let us know about issues",
          onClick: () => toast({ title: "Report a Problem", description: "Opening..." }),
          type: "navigation" as const,
        },
      ],
    },
    {
      title: "Invite & Rate Us",
      items: [
        {
          icon: Share2,
          title: "Invite Friends",
          subtitle: "Share Kasa with others",
          onClick: handleInviteFriends,
          type: "action" as const,
        },
        {
          icon: Star,
          title: "Rate Us",
          subtitle: "Rate us on the app store",
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
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 sm:h-9 sm:w-9">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
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
                  <button
                    key={index}
                    onClick={item.type !== "toggle" ? item.onClick : undefined}
                    className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-accent transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      <Switch checked={item.checked} onCheckedChange={item.onCheckedChange} aria-label={item.title} />
                    ) : (
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                )
              })}
            </Card>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Kasa v1.0.0</p>
          <p className="mt-1">© 2025 Kasa. All rights reserved.</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-around p-2">
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
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent"
              aria-label="Profile"
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
            <DialogTitle>Select Currency</DialogTitle>
          </DialogHeader>
          <Select value={currency} onValueChange={handleCurrencyChange}>
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
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          <Select value={language} onValueChange={handleLanguageChange}>
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

      {/* Permission Dialog */}
      <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPermission} Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This permission allows Kasa to access your {selectedPermission?.toLowerCase()}. You can change this in
              your device settings.
            </p>
            <Button onClick={() => setPermissionDialogOpen(false)} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
