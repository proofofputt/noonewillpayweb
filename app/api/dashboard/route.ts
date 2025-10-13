import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import db, { surveyResponses, referrals, stickerCodes } from '@/lib/db'
import { eq, and, desc, count, sql } from 'drizzle-orm'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's survey response
    const [survey] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.userId, user.id))
      .limit(1)

    // Get referrals data
    const userReferrals = await db
      .select({
        id: referrals.id,
        referredId: referrals.referredId,
        referredSurveyId: referrals.referredSurveyId,
        referralLevel: referrals.referralLevel,
        pointsEarned: referrals.pointsEarned,
        createdAt: referrals.createdAt,
        // Join with survey responses to get email and score
        surveyEmail: surveyResponses.email,
        surveyPhone: surveyResponses.phone,
        surveyScore: surveyResponses.score,
        quickQuizScore: surveyResponses.quickQuizScore,
        fullAssessmentCompleted: surveyResponses.fullAssessmentCompleted,
        fullAssessmentScore: surveyResponses.fullAssessmentScore,
      })
      .from(referrals)
      .leftJoin(surveyResponses, eq(referrals.referredSurveyId, surveyResponses.id))
      .where(eq(referrals.referrerId, user.id))
      .orderBy(desc(referrals.createdAt))

    // Get referral count by level
    const referralsByLevel = await db
      .select({
        level: referrals.referralLevel,
        count: count(),
      })
      .from(referrals)
      .where(eq(referrals.referrerId, user.id))
      .groupBy(referrals.referralLevel)

    // Get sticker codes claimed by user
    const stickers = await db
      .select()
      .from(stickerCodes)
      .where(eq(stickerCodes.claimedBy, user.id))

    // Calculate statistics
    const totalReferrals = userReferrals.length
    const directReferrals = userReferrals.filter(r => r.referralLevel === 1).length
    const totalReferralPoints = userReferrals.reduce((sum, r) => sum + parseFloat(r.pointsEarned || '0'), 0)

    // Format referrals for display
    const formattedReferrals = userReferrals.map(r => ({
      id: r.id,
      email: r.surveyEmail || 'Not provided',
      phone: r.surveyPhone || 'N/A',
      level: r.referralLevel || 1,
      pointsEarned: parseFloat(r.pointsEarned || '0'),
      quickQuizScore: r.quickQuizScore || 0,
      fullAssessmentScore: r.fullAssessmentScore || 0,
      fullAssessmentCompleted: r.fullAssessmentCompleted || false,
      date: r.createdAt?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        referralCode: user.referralCode,
        allocationPoints: parseFloat(user.allocationPoints),
        birthDecade: user.birthDecade,
      },
      survey: survey ? {
        quickQuizScore: survey.quickQuizScore || 0,
        fullAssessmentScore: survey.fullAssessmentScore || 0,
        fullAssessmentCompleted: survey.fullAssessmentCompleted,
        combinedScore: (survey.quickQuizScore || 0) + (survey.fullAssessmentScore || 0),
        maxPossibleScore: 225, // 30 + 195
      } : null,
      referrals: {
        total: totalReferrals,
        direct: directReferrals,
        byLevel: referralsByLevel.map(r => ({
          level: r.level || 1,
          count: Number(r.count),
        })),
        totalPoints: totalReferralPoints,
        list: formattedReferrals,
      },
      stickers: stickers.map(s => ({
        code: s.code,
        claimedAt: s.claimedAt?.toISOString(),
        usageCount: s.usageCount,
        batchId: s.batchId,
      })),
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
