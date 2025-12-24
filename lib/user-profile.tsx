"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

type UserProfile = {
  uid: string | null
  displayName: string
  email: string
  photoURL: string
  photoUpdatedAt?: number
}

type UserProfileContextValue = UserProfile & {
  loading: boolean
  refreshAuthUser: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined)

const initialState: UserProfileContextValue = {
  uid: null,
  displayName: "",
  email: "",
  photoURL: "",
  loading: true,
  photoUpdatedAt: undefined,
  refreshAuthUser: async () => {},
}

const appendCacheBust = (url: string, updatedAt?: number) => {
  if (!url) return ""
  if (!updatedAt) return url
  const sep = url.includes("?") ? "&" : "?"
  return `${url}${sep}v=${updatedAt}`
}

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfileContextValue>(initialState)
  const unsubUserRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (unsubUserRef.current) {
          try {
            unsubUserRef.current()
          } catch {}
          unsubUserRef.current = null
        }

        if (!user) {
          setProfile({ ...initialState, loading: false })
          return
        }

        const userDocRef = doc(db, "users", user.uid)
        unsubUserRef.current = onSnapshot(
          userDocRef,
          (snap) => {
            const data = snap.data() as any
            const displayName = (data?.displayName as string) || user.displayName || ""
            const email = (data?.email as string) || user.email || ""
            const rawPhoto = (data?.photoURL as string) || user.photoURL || ""
            const updatedAt = data?.updatedAt?.toMillis ? data.updatedAt.toMillis() : undefined
            const photoURL = appendCacheBust(rawPhoto, updatedAt)

            setProfile({
              uid: user.uid,
              displayName,
              email,
              photoURL,
              photoUpdatedAt: updatedAt,
              loading: false,
              refreshAuthUser: async () => {
                await auth.currentUser?.reload()
              },
            })
          },
          () => {
            setProfile({
              uid: user.uid,
              displayName: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              photoUpdatedAt: undefined,
              loading: false,
              refreshAuthUser: async () => {
                await auth.currentUser?.reload()
              },
            })
          },
        )
      },
      () => {
        setProfile({ ...initialState, loading: false })
      },
    )

    return () => {
      try {
        unsubAuth()
      } catch {}
      if (unsubUserRef.current) {
        try {
          unsubUserRef.current()
        } catch {}
      }
    }
  }, [])

  return <UserProfileContext.Provider value={profile}>{children}</UserProfileContext.Provider>
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider")
  }
  return ctx
}
