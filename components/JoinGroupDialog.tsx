"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, runTransaction, serverTimestamp, collection } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { normalizeInviteCode } from "@/lib/utils/invite-utils"
import { useSettings } from "@/lib/settings-context"
import type { GroupInviteDoc } from "@/lib/types/firestore"

interface JoinGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JoinGroupDialog({ open, onOpenChange }: JoinGroupDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useSettings()
  const [joinCode, setJoinCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoinGroup = async () => {
    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    const code = normalizeInviteCode(joinCode)
    if (!code) {
      toast({
        title: t("invalidInput"),
        description: t("enterInviteCodeError"),
        variant: "destructive",
      })
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const inviteRef = doc(db, "groupInvites", code)
      const inviteSnap = await getDoc(inviteRef)
      
      if (!inviteSnap.exists()) {
        toast({
          title: t("invalidCode"),
          description: t("inviteNotFound"),
          variant: "destructive",
        })
        return
      }

      const invite = inviteSnap.data() as GroupInviteDoc
      const groupId = invite?.groupId
      
      if (!groupId || typeof groupId !== "string") {
        toast({
          title: t("invalidInput"),
          description: t("inviteMissingInfo"),
          variant: "destructive",
        })
        return
      }

      const groupRef = doc(db, "groups", groupId)

      await runTransaction(db, async (tx) => {
        const groupSnap = await tx.get(groupRef)
        if (!groupSnap.exists()) {
          throw new Error("Group not found")
        }

        const g = groupSnap.data()
        const currentMembers: string[] = Array.isArray(g?.memberIds) ? g.memberIds : []
        
        if (currentMembers.includes(user.uid)) {
          // Already a member
          return
        }

        const nextMembers = [...currentMembers, user.uid]
        const nextBalances = { ...(g?.balances || {}) }
        if (typeof nextBalances[user.uid] !== "number") {
          nextBalances[user.uid] = 0
        }

        tx.update(groupRef, {
          memberIds: nextMembers,
          balances: nextBalances,
        })

        const feedRef = doc(collection(db, "groups", groupId, "feed"))
        tx.set(feedRef, {
          type: "join",
          title: "Member joined",
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          createdByName: user.displayName || user.email || "",
        })
      })

      toast({
        title: t("joinedGroup"),
        description: t("joinedGroupDesc"),
      })
      
      setJoinCode("")
      onOpenChange(false)
      router.push("/groups")
    } catch (e: any) {
      console.error("Failed to join group:", e)
      toast({
        title: t("joinFailed"),
        description: e?.message || t("couldNotJoin"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("joinGroup")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="join-code">{t("inviteCode")}</Label>
            <Input
              id="join-code"
              placeholder={t("enterInviteCodePlaceholder")}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleJoinGroup()
                }
              }}
              disabled={loading}
              className="mt-2 uppercase font-mono"
              autoFocus
              maxLength={6}
            />
          </div>
          <Button onClick={handleJoinGroup} className="w-full" disabled={loading}>
            {loading ? t("joining") : (
              <>
                <Link className="mr-2 h-4 w-4" />
                {t("joinGroup")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
