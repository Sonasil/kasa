// lib/groupService.ts
import { auth, db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

// İleride daha fazla helper ekleyeceğiz (joinGroup, addExpense, vs.)
// Şimdilik sadece grup oluşturma akışını kapsıyoruz.

export async function createGroup(name: string) {
  const user = auth.currentUser

  if (!user) {
    throw new Error("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.")
  }

  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error("Grup adı boş olamaz.")
  }

  // ✅ Tek kaynak: groups/{groupId} dokümanı ve memberIds array'i
  // ❌ Bu aşamada members alt koleksiyonu / activities gibi ekstra write yapmıyoruz.
  const groupRef = await addDoc(collection(db, "groups"), {
    name: trimmed,
    createdBy: user.uid,
    memberIds: [user.uid],
    isActive: true,
    createdAt: serverTimestamp(),
  })

  return { groupId: groupRef.id }
}
