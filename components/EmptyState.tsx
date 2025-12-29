import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <Card className="p-8 sm:p-12 text-center">
      <div className="mx-auto w-fit mb-4 p-3 rounded-full bg-muted">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </Card>
  )
}
