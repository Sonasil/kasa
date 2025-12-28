import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Bell } from "lucide-react"

type SimplifiedDebtCardProps = {
  uid: string
  userName: string
  userPhoto?: string
  amount: number
  direction: "owe" | "owed" // You owe them OR they owe you
  currency: string
  onPayBack?: () => void
  onRemind?: () => void
}

export function SimplifiedDebtCard({
  uid,
  userName,
  userPhoto,
  amount,
  direction,
  currency,
  onPayBack,
  onRemind,
}: SimplifiedDebtCardProps) {
  const isOwe = direction === "owe"
  const formattedAmount = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency,
  }).format(amount / 100)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card
      className={`p-4 flex items-center justify-between gap-3 transition-all hover:shadow-md ${
        isOwe
          ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
          : "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={userPhoto} alt={userName} />
          <AvatarFallback className={isOwe ? "bg-red-200" : "bg-green-200"}>
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{userName}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isOwe ? (
              <>
                <span>You owe</span>
                <ArrowRight className="h-3 w-3" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-3 w-3" />
                <span>Owes you</span>
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className={`font-bold text-lg ${isOwe ? "text-red-700" : "text-green-700"}`}>
            {formattedAmount}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {isOwe && onPayBack && (
          <Button
            size="sm"
            onClick={onPayBack}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Pay Back
          </Button>
        )}
        {!isOwe && onRemind && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRemind}
            className="border-green-300"
          >
            <Bell className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
