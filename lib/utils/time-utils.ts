import { Timestamp } from "firebase/firestore"

// Helper to convert various date formats to JavaScript Date
export const toDate = (value: any): Date => {
    if (!value) return new Date()
    if (value instanceof Date) return value
    if (typeof value?.toDate === "function") return value.toDate()
    if (typeof value?.seconds === "number") return new Date(value.seconds * 1000)
    return new Date(value)
}

// Format a date as a relative time string (e.g., "2h ago", "3d ago")
export const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

// Format a date as a full date string
export const formatFullDate = (date: Date): string => {
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}
