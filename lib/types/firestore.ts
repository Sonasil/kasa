import { Timestamp } from "firebase/firestore"

// User document in Firestore
export interface UserDoc {
    displayName?: string
    email?: string
    photoURL?: string
    updatedAt?: Timestamp
    createdAt?: Timestamp
    settings?: {
        theme?: "system" | "light" | "dark"
        currency?: "TRY" | "USD" | "EUR" | "GBP"
        language?: "en" | "tr"
        notificationsEnabled?: boolean
    }
}

// Group document in Firestore
export interface GroupDoc {
    name: string
    createdBy: string
    createdByName: string
    createdAt: Timestamp
    memberIds: string[]
    balances: Record<string, number>
    totalAmount: number
    isActive?: boolean
}

// Group invite document in Firestore
export interface GroupInviteDoc {
    groupId: string
    createdBy: string
    createdAt: Timestamp
    disabled?: boolean
    expiresAt?: Timestamp
}

// Feed item in Firestore (subcollection under groups)
export interface FeedDoc {
    type: "expense" | "settlement" | "join" | "group"
    title: string
    createdAt: Timestamp
    createdBy: string
    createdByName: string
    amount?: number
    amountCents?: number
    description?: string
    text?: string
    message?: string
    isPositive?: boolean
    groupId?: string
}

// Expense document in Firestore
export interface ExpenseDoc {
    title: string
    description?: string
    amount: number
    createdBy: string
    createdByName: string
    createdAt: Timestamp
    paidBy: string
    paidByName: string
    splitBetween: string[]
    groupId: string
}

// Settlement document in Firestore
export interface SettlementDoc {
    from: string
    fromName: string
    to: string
    toName: string
    amount: number
    createdAt: Timestamp
    groupId: string
    note?: string
}
