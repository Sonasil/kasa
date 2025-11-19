// lib/groupService.ts
import { auth, db } from "@/lib/firebase"
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"

// İleride daha fazla helper ekleyeceğiz (joinGroup, addExpense, vs.)
// Şimdilik sadece grup oluşturma akışını kapsıyoruz.

export async function createGroup(name: string) {
  const user = auth.currentUser

  if (!user) {
    throw new Error("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.")
  }

  // 1) groups koleksiyonunda yeni grup dokümanı oluştur
  const groupRef = doc(collection(db, "groups"))
  const groupId = groupRef.id

  await setDoc(groupRef, {
    name,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  })

  // 2) members alt koleksiyonuna current user'ı owner olarak ekle
  const memberRef = doc(db, "groups", groupId, "members", user.uid)
  await setDoc(memberRef, {
    role: "owner",
    joinedAt: serverTimestamp(),
  })

  // 3) activities alt koleksiyonuna 'join' aktivitesi ekle
  const activityRef = collection(db, "groups", groupId, "activities")
  await addDoc(activityRef, {
    type: "join",
    title: "Joined the group",
    user: {
      uid: user.uid,
      name: user.displayName ?? user.email ?? "Someone",
    },
    groupName: name,
    timestamp: serverTimestamp(),
    isPositive: true,
  })

  return { groupId }
}
