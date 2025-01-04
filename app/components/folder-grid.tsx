"use client"

import { FolderCard } from "./folder-card"
import { useToast } from "@/hooks/use-toast"
import { fetchWithAuth } from "@/lib/fetch-interceptor"

interface Resource {
  id: string
  name: string
  description: string
  type: string
  url: string
  createdAt: string
}

interface Folder {
  id: string
  name: string
  type: 'Notes' | 'References' | 'PastQuestions'
  items: Resource[]
}

interface FolderGridProps {
  folders: Folder[]
  onFoldersChange: (folders: Folder[]) => void
  subjectId: string
}

export function FolderGrid({ folders, onFoldersChange, subjectId }: FolderGridProps) {
  const { toast } = useToast()

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const response = await fetchWithAuth(`/api/subjects/${subjectId}/folders/${folderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete folder')
      }

      // Update local state
      onFoldersChange(folders.filter(f => f.id !== folderId))

      toast({
        title: "Folder deleted",
        description: "The folder and its contents have been deleted.",
      })
    } catch (error) {
      console.error('Error deleting folder:', error)
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResourceClick = (resource: Resource) => {
    // Open resource in new tab
    window.open(resource.url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          {...folder}
          onDelete={handleDeleteFolder}
          onResourceClick={handleResourceClick}
        />
      ))}
    </div>
  )
} 