import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        referralCode: user.referralCode,
        birthDecade: user.birthDecade,
        allocationPoints: user.allocationPoints,
        registrationBonusAwarded: user.registrationBonusAwarded,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}
