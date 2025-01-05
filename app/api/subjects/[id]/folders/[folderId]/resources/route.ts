import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { backendUrl } from '@/lib/config'

export async function POST(
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

    const formData = await request.formData()
    
    // Create a new FormData instance to ensure proper structure
    const forwardFormData = new FormData()
    
    // Get the file from the form data
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Add all form fields to the new FormData
    forwardFormData.append('file', file)
    forwardFormData.append('name', formData.get('name') as string)
    forwardFormData.append('description', formData.get('description') as string)

    // Make sure we don't set Content-Type header - let the browser set it with the boundary
    const response = await fetch(`${backendUrl}/subjects/${params.id}/folders/${params.folderId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: forwardFormData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Resource creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
} 

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, folderId: string, resourceId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${backendUrl}/subjects/${params.id}/folders/${params.folderId}/resources/${params.resourceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.user.accessToken}`
        }
    })
}
