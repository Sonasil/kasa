"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface Group {
  id: string
  name: string
  memberIds: string[]
  createdBy: string
  createdAt: any
  balances: Record<string, number>
  totalAmount: number
  isActive?: boolean
  [key: string]: any
}

interface GroupsContextValue {
  groups: Group[]
  activeGroups: Group[]
  archivedGroups: Group[]
  loading: boolean
  error: string | null
}

const GroupsContext = createContext<GroupsContextValue>({
  groups: [],
  activeGroups: [],
  archivedGroups: [],
  loading: true,
  error: null,
})

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch {}
        unsubscribe = undefined
      }

      if (!user) {
        setGroups([])
        setLoading(false)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      const groupsQuery = query(
        collection(db, "groups"),
        where("memberIds", "array-contains", user.uid)
      )

      unsubscribe = onSnapshot(
        groupsQuery,
        (snapshot) => {
          const groupsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Group[]

          setGroups(groupsData)
          setLoading(false)
        },
        (err) => {
          console.error("Groups query error:", err)
          setError(err.message)
          setLoading(false)
        }
      )
    })

    return () => {
      try {
        unsubAuth()
      } catch {}
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch {}
      }
    }
  }, [])

  // Derive active and archived groups
  const activeGroups = groups.filter((g) => g.isActive !== false)
  const archivedGroups = groups.filter((g) => g.isActive === false)

  const value: GroupsContextValue = {
    groups,
    activeGroups,
    archivedGroups,
    loading,
    error,
  }

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
}

export function useGroups() {
  const context = useContext(GroupsContext)
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupsProvider")
  }
  return context
}
