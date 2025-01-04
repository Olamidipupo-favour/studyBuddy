import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { backendUrl } from '@/lib/config'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await fetch(`${backendUrl}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Token invalid' },
        { status: 401 }
      )
    }

    return NextResponse.json({ valid: true })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    )
  }
} 