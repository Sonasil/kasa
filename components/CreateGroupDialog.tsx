"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [groupName, setGroupName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateGroup = async () => {
    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    const name = groupName.trim()
    if (!name) {
      toast({
        title: "Invalid input",
        description: "Please enter a group name",
        variant: "destructive",
      })
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const groupsCol = collection(db, "groups")
      const groupRef = doc(groupsCol) // auto-id

      // Create group document in transaction
      await runTransaction(db, async (tx) => {
        tx.set(groupRef, {
          name,
          createdBy: user.uid,
          createdByName: user.displayName || user.email || "",
          createdAt: serverTimestamp(),
          memberIds: [user.uid],
          balances: { [user.uid]: 0 },
          totalAmount: 0,
        })
      })

      // Best-effort: add a feed item
      try {
        const feedRef = doc(collection(db, "groups", groupRef.id, "feed"))
        await runTransaction(db, async (tx) => {
          tx.set(feedRef, {
            type: "group",
            title: "Group created",
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            createdByName: user.displayName || user.email || "",
            groupId: groupRef.id,
          })
        })
      } catch (e) {
        console.warn("Failed to write group creation feed item:", e)
      }

      toast({
        title: "Group created",
        description: `${name} has been created successfully`,
      })
      
      setGroupName("")
      onOpenChange(false)
      router.push("/groups")
    } catch (e: any) {
      console.error("Failed to create group:", e)
      toast({
        title: "Create failed",
        description: e?.message || "Could not create the group.",
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
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Weekend Trip, Apartment 4B, etc."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleCreateGroup()
                }
              }}
              disabled={loading}
              className="mt-2"
              autoFocus
            />
          </div>
          <Button onClick={handleCreateGroup} className="w-full" disabled={loading}>
            {loading ? "Creating..." : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
