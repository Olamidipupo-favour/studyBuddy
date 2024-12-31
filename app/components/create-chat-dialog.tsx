"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface CreateChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateChatDialog({ open, onOpenChange }: CreateChatDialogProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add chat creation logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>
            Start a new conversation with your AI study buddy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              placeholder="Chat title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Start Chat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 