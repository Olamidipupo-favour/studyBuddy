import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { backendUrl } from '@/lib/config'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, folderId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await fetch(`${backendUrl}/subjects/${params.id}/folders/${params.folderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Folder deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    )
  }
} 