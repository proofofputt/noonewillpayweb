import { NextRequest, NextResponse } from 'next/server'
import db, { users } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET /api/referral-info?code=XXX - Get basic info about a referrer by their code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required' },
        { status: 400 }
      )
    }

    const [user] = await db
      .select({
        username: users.username,
        referralCode: users.referralCode,
      })
      .from(users)
      .where(eq(users.referralCode, code))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      referralCode: user.referralCode,
    })
  } catch (error: any) {
    console.error('Error fetching referral info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referral info' },
      { status: 500 }
    )
  }
}
