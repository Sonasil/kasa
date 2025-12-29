"use client"

import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useEffect } from "react"

export default function TestPage() {
  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, "groups"))
      // Groups fetched successfully
    }
    fetchData()
  }, [])

  return <div>✅ Firebase bağlantısı test ediliyor... Console’a bak!</div>
}