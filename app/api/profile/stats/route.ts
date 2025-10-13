import { NextRequest, NextResponse } from 'next/server'
import db, { surveyResponses, stickerCodes } from '@/lib/db'
import { eq, or, and } from 'drizzle-orm'
import { getReferralStats, REFERRAL_POINTS_BY_LEVEL } from '@/lib/multi-level-referrals'

/**
 * Get user's referral statistics
 * Can be queried by:
 * - referralCode (from survey response)
 * - phone number
 * - email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('referralCode')
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')

    if (!referralCode && !phone && !email) {
      return NextResponse.json(
        { success: false, error: 'Must provide referralCode, phone, or email' },
        { status: 400 }
      )
    }

    // Find the user's survey response
    const conditions = []
    if (referralCode) conditions.push(eq(surveyResponses.referralCode, referralCode))
    if (phone) conditions.push(eq(surveyResponses.phone, phone))
    if (email) conditions.push(eq(surveyResponses.email, email))

    const [userSurvey] = await db
      .select()
      .from(surveyResponses)
      .where(or(...conditions))
      .limit(1)

    if (!userSurvey) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all referrals (people who used this user's referral code)
    const referrals = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referredBy, userSurvey.referralCode))

    // Get sticker codes claimed by this user
    const claimedStickers = await db
      .select()
      .from(stickerCodes)
      .where(
        and(
          eq(stickerCodes.claimedBySurvey, userSurvey.id),
          eq(stickerCodes.claimed, true)
        )
      )

    // Calculate statistics
    const referralCount = referrals.length
    const totalReferralScore = referrals.reduce((sum, r) => sum + r.score, 0)
    const scoreBonus = Math.floor(totalReferralScore * 0.1)

    // Base allocation points
    const basePoints = userSurvey.score
    const referralBonus = referralCount * 50

    // Total allocation points
    const allocationPoints = basePoints + referralBonus + scoreBonus

    // Calculate rank (simple version - count how many have more points)
    const allSurveys = await db.select().from(surveyResponses)
    const surveyPoints = allSurveys.map(s => {
      const refs = allSurveys.filter(r => r.referredBy === s.referralCode)
      const refBonus = refs.length * 50
      const refScoreBonus = Math.floor(refs.reduce((sum, r) => sum + r.score, 0) * 0.1)
      return s.score + refBonus + refScoreBonus
    })
    const rank = surveyPoints.filter(p => p > allocationPoints).length + 1

    // Format referrals for display
    const formattedReferrals = referrals.map(r => ({
      email: r.email || 'Anonymous',
      phone: r.phone,
      score: r.score,
      completed: true,
      date: r.timestamp.toISOString(),
    }))

    // Sticker code information
    const stickerInfo = claimedStickers.length > 0 ? {
      stickers: claimedStickers.map(s => ({
        code: s.code,
        claimedAt: s.claimedAt,
        usageCount: s.usageCount,
        batchId: s.batchId,
      })),
      totalStickerReferrals: claimedStickers.reduce((sum, s) => sum + s.usageCount, 0),
    } : null

    // Get multi-level referral statistics
    const multiLevelStats = await getReferralStats(userSurvey.referralCode)

    return NextResponse.json({
      success: true,
      user: {
        referralCode: userSurvey.referralCode,
        email: userSurvey.email,
        phone: userSurvey.phone,
        score: userSurvey.score,
        submittedAt: userSurvey.timestamp,
      },
      stats: {
        referralCode: userSurvey.referralCode,
        referralCount,
        totalScore: userSurvey.score,
        allocationPoints,
        rank,
        referrals: formattedReferrals,
      },
      breakdown: {
        basePoints,
        referralBonus,
        scoreBonus,
        total: allocationPoints,
      },
      multiLevel: {
        totalReferrals: multiLevelStats.totalReferrals,
        directReferrals: multiLevelStats.directReferrals,
        referralsByLevel: multiLevelStats.referralsByLevel,
        pointsByLevel: multiLevelStats.pointsByLevel,
        totalPoints: multiLevelStats.totalPoints,
        pointsStructure: REFERRAL_POINTS_BY_LEVEL,
      },
      stickerCodes: stickerInfo,
    })
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
