import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { backendUrl } from '@/lib/config'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log(`Fetching study sessions from: ${backendUrl}/subjects/${params.id}/study-sessions`)
    
    const response = await fetch(`${backendUrl}/subjects/${params.id}/study-sessions`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })

    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch study sessions" },
        { status: response.status }
      )
    }

    // Transform the data to match the expected format if necessary
    const sessions = Array.isArray(data) ? data : data.sessions || []
    
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("[STUDY_SESSIONS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch study sessions" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { startTime, endTime, duration } = body

    console.log(`Posting study session to: ${backendUrl}/subjects/${params.id}/study-sessions`)
    console.log('Request body:', { startTime, endTime, duration })

    const response = await fetch(`${backendUrl}/subjects/${params.id}/study-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify({
        startTime,
        endTime,
        duration
      })
    })

    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to save study session" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[STUDY_SESSION_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to save study session" },
      { status: 500 }
    )
  }
} 