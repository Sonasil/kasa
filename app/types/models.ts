// types/models.ts
export type CurrencyCode = "TRY" | "USD" | "EUR" | "GBP";

export interface UserDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  currency?: CurrencyCode;
  language?: string; // "tr", "en" ...
  notifications?: { email?: boolean; push?: boolean };
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface GroupDoc {
  name: string;
  createdBy: string; // uid
  createdAt: any;
}

export interface GroupMemberDoc {
  role: "owner" | "member";
  joinedAt: any;
}

export interface ExpenseDoc {
  amount: number;             // kuruş
  paidBy: string;             // uid
  split: { uid: string; share: number }[]; // paylar (1.0 toplam)
  notes?: string;
  createdAt: any;
}

export interface SettlementDoc {
  from: string;  // uid
  to: string;    // uid
  amount: number;
  createdAt: any;
}

export type ActivityType = "expense" | "settlement" | "join";
export interface ActivityDoc {
  type: ActivityType;
  title: string;
  amount?: number;     // opsiyonel; settlement/expense’e göre
  user: { uid: string; name: string | null };
  groupName: string;
  timestamp: any;
  isPositive: boolean;
}