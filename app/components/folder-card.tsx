"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Resource {
  id: string
  name: string
  description: string
  type: string
  url: string
  createdAt: string
}

interface FolderCardProps {
  id: string
  name: string
  type: 'Notes' | 'References' | 'PastQuestions'
  items: Resource[]
  onDelete: (id: string) => void
  onResourceClick: (resource: Resource) => void
}

export function FolderCard({ id, name, type, items, onDelete, onResourceClick }: FolderCardProps) {
  return (
    <Card className="relative group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete folder?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the folder and all its contents.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items yet</p>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => onResourceClick(item)}
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 