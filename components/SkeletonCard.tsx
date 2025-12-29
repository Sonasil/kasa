import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card className="p-3 sm:p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-10 w-16" />
        </div>
        <div className="border-t pt-2">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  )
}
