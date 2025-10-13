import { NextRequest, NextResponse } from 'next/server'
import { PointsService } from '@/lib/points/points-service'
import { PointType } from '@/lib/points/point-types'
import db, { surveyResponses } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('referralCode')
    const pointType = searchParams.get('type') as PointType | null
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code required' },
        { status: 400 }
      )
    }

    // Find survey response to get userId
    const [surveyResponse] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, referralCode))
      .limit(1)

    if (!surveyResponse || !surveyResponse.userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const history = await PointsService.getUserHistory(surveyResponse.userId, {
      pointType: pointType || undefined,
      limit,
      offset
    })

    return NextResponse.json({
      success: true,
      ...history
    })
  } catch (error) {
    console.error('Error fetching points history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
