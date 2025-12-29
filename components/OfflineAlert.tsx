"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSettings } from "@/lib/settings-context"

export function OfflineAlert() {
  const { t } = useSettings()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 flex items-center justify-center h-10 px-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{t("noInternet")}</AlertDescription>
      </Alert>
    </div>
  )
}
