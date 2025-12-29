"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Wallet, User } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useSettings()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname?.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border z-50">
      <div className="mx-auto max-w-4xl px-6 py-3">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/groups")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive("/groups") ? "" : "hover:bg-accent"
            }`}
            aria-label={t("navGroups")}
          >
            <Wallet className={`h-6 w-6 ${isActive("/groups") ? "text-green-600" : "text-muted-foreground"}`} />
          </button>

          <button
            onClick={() => router.push("/")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive("/") && pathname === "/" ? "" : "hover:bg-accent"
            }`}
            aria-label={t("navHome")}
          >
            <Home className={`h-6 w-6 ${isActive("/") && pathname === "/" ? "text-green-600" : "text-muted-foreground"}`} />
          </button>

          <button
            onClick={() => router.push("/profile")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive("/profile") ? "" : "hover:bg-accent"
            }`}
            aria-label={t("navProfile")}
          >
            <User className={`h-6 w-6 ${isActive("/profile") ? "text-green-600" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>
    </nav>
  )
}
