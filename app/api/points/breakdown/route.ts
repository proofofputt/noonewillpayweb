import { NextRequest, NextResponse } from 'next/server'
import { PointsService } from '@/lib/points/points-service'
import { POINT_TYPE_DESCRIPTIONS } from '@/lib/points/point-types'
import db, { surveyResponses } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('referralCode')

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

    const breakdown = await PointsService.getUserBreakdown(surveyResponse.userId)

    // Add descriptions and categorize
    const enrichedBreakdown = Object.entries(breakdown).map(([type, data]) => ({
      type,
      description: POINT_TYPE_DESCRIPTIONS[type as keyof typeof POINT_TYPE_DESCRIPTIONS] || type,
      count: data.count,
      total: data.total
    }))

    // Categorize by type
    const categories = {
      quiz: enrichedBreakdown.filter(b =>
        b.type.includes('quiz') || b.type.includes('question')
      ),
      referrals: enrichedBreakdown.filter(b => b.type.includes('referral')),
      community: enrichedBreakdown.filter(b =>
        ['meetup_attendance', 'book_club', 'node_runner', 'first_inscription'].includes(b.type)
      ),
      bonuses: enrichedBreakdown.filter(b =>
        b.type.includes('bonus') || b.type.includes('early_adopter')
      ),
      admin: enrichedBreakdown.filter(b =>
        ['admin_adjustment', 'contest_prize'].includes(b.type)
      )
    }

    // Calculate category totals
    const categoryTotals = {
      quiz: categories.quiz.reduce((sum, item) => sum + item.total, 0),
      referrals: categories.referrals.reduce((sum, item) => sum + item.total, 0),
      community: categories.community.reduce((sum, item) => sum + item.total, 0),
      bonuses: categories.bonuses.reduce((sum, item) => sum + item.total, 0),
      admin: categories.admin.reduce((sum, item) => sum + item.total, 0)
    }

    const grandTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)

    return NextResponse.json({
      success: true,
      breakdown: enrichedBreakdown,
      categories,
      categoryTotals,
      grandTotal
    })
  } catch (error) {
    console.error('Error fetching points breakdown:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch breakdown' },
      { status: 500 }
    )
  }
}
