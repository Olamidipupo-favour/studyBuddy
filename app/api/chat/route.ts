import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { backendUrl } from '@/lib/config'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (response.status === 401) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
} 