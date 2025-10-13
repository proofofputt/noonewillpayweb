import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-helpers'
import db, { referrals, surveyResponses } from '@/lib/db'
import { eq, and, desc, gte, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all user's referrals
    const userReferrals = await db
      .select({
        id: referrals.id,
        referralLevel: referrals.referralLevel,
        pointsEarned: referrals.pointsEarned,
        createdAt: referrals.createdAt,
        referredSurveyId: referrals.referredSurveyId,
        // Join survey data
        quickQuizScore: surveyResponses.quickQuizScore,
        fullAssessmentCompleted: surveyResponses.fullAssessmentCompleted,
        fullAssessmentScore: surveyResponses.fullAssessmentScore,
      })
      .from(referrals)
      .leftJoin(surveyResponses, eq(referrals.referredSurveyId, surveyResponses.id))
      .where(
        and(
          eq(referrals.referrerId, user.id),
          gte(referrals.createdAt, startDate)
        )
      )
      .orderBy(referrals.createdAt)

    // Get all-time referrals for comparison
    const allTimeReferrals = await db
      .select({
        id: referrals.id,
        referralLevel: referrals.referralLevel,
        createdAt: referrals.createdAt,
        quickQuizScore: surveyResponses.quickQuizScore,
        fullAssessmentCompleted: surveyResponses.fullAssessmentCompleted,
      })
      .from(referrals)
      .leftJoin(surveyResponses, eq(referrals.referredSurveyId, surveyResponses.id))
      .where(eq(referrals.referrerId, user.id))

    // Time series data - group by day
    const timeSeriesMap = new Map<string, {
      date: string
      count: number
      level1: number
      level2: number
      level3: number
      level4: number
      level5: number
      cumulativeCount: number
    }>()

    // Initialize all days in range
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      const dateStr = date.toISOString().split('T')[0]
      timeSeriesMap.set(dateStr, {
        date: dateStr,
        count: 0,
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        cumulativeCount: 0,
      })
    }

    // Fill in actual data
    let cumulative = 0
    userReferrals.forEach(ref => {
      if (ref.createdAt) {
        const dateStr = ref.createdAt.toISOString().split('T')[0]
        const data = timeSeriesMap.get(dateStr)
        if (data) {
          data.count++
          cumulative++
          data.cumulativeCount = cumulative

          const level = ref.referralLevel || 1
          if (level === 1) data.level1++
          else if (level === 2) data.level2++
          else if (level === 3) data.level3++
          else if (level === 4) data.level4++
          else if (level === 5) data.level5++
        }
      }
    })

    // Update cumulative counts for days with no new referrals
    const timeSeriesArray = Array.from(timeSeriesMap.values())
    for (let i = 1; i < timeSeriesArray.length; i++) {
      if (timeSeriesArray[i].count === 0) {
        timeSeriesArray[i].cumulativeCount = timeSeriesArray[i - 1].cumulativeCount
      }
    }

    // Referrals by level
    const byLevel = {
      level1: allTimeReferrals.filter(r => r.referralLevel === 1).length,
      level2: allTimeReferrals.filter(r => r.referralLevel === 2).length,
      level3: allTimeReferrals.filter(r => r.referralLevel === 3).length,
      level4: allTimeReferrals.filter(r => r.referralLevel === 4).length,
      level5: allTimeReferrals.filter(r => r.referralLevel === 5).length,
    }

    // Conversion metrics
    const totalReferrals = allTimeReferrals.length
    const completedFullAssessment = allTimeReferrals.filter(r => r.fullAssessmentCompleted).length
    const averageScore = allTimeReferrals
      .filter(r => r.quickQuizScore !== null)
      .reduce((sum, r) => sum + (r.quickQuizScore || 0), 0) / (totalReferrals || 1)

    const conversionFunnel = {
      referred: totalReferrals,
      completedQuickQuiz: allTimeReferrals.filter(r => r.quickQuizScore !== null && r.quickQuizScore > 0).length,
      completedFullAssessment: completedFullAssessment,
      conversionRate: totalReferrals > 0 ? (completedFullAssessment / totalReferrals) * 100 : 0,
    }

    // Growth metrics
    const todayReferrals = userReferrals.filter(r => {
      if (!r.createdAt) return false
      const today = new Date()
      const refDate = new Date(r.createdAt)
      return refDate.toDateString() === today.toDateString()
    }).length

    const yesterdayReferrals = userReferrals.filter(r => {
      if (!r.createdAt) return false
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const refDate = new Date(r.createdAt)
      return refDate.toDateString() === yesterday.toDateString()
    }).length

    const weekReferrals = userReferrals.filter(r => {
      if (!r.createdAt) return false
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(r.createdAt) >= weekAgo
    }).length

    const monthReferrals = userReferrals.length

    const growthMetrics = {
      today: todayReferrals,
      yesterday: yesterdayReferrals,
      last7Days: weekReferrals,
      last30Days: monthReferrals,
      dailyAverage: monthReferrals / days,
      weeklyAverage: (monthReferrals / days) * 7,
    }

    // Peak day
    const dailyCounts = timeSeriesArray.map(d => d.count)
    const peakDay = timeSeriesArray[dailyCounts.indexOf(Math.max(...dailyCounts))]

    return NextResponse.json({
      success: true,
      timeSeries: timeSeriesArray,
      byLevel: [
        { level: 'Direct (L1)', count: byLevel.level1, points: 21, color: '#f59e0b' },
        { level: '2nd Degree (L2)', count: byLevel.level2, points: 10.5, color: '#3b82f6' },
        { level: '3rd Degree (L3)', count: byLevel.level3, points: 5.25, color: '#8b5cf6' },
        { level: '4th Degree (L4)', count: byLevel.level4, points: 2.25, color: '#ec4899' },
        { level: '5th Degree (L5)', count: byLevel.level5, points: 1.125, color: '#10b981' },
      ],
      conversionFunnel,
      growthMetrics,
      insights: {
        totalReferrals,
        averageScore: Math.round(averageScore * 10) / 10,
        peakDay: peakDay ? {
          date: peakDay.date,
          count: peakDay.count,
        } : null,
        mostActiveLevel: Object.entries(byLevel).reduce((a, b) => a[1] > b[1] ? a : b)[0].replace('level', 'Level '),
      },
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days,
      },
    })
  } catch (error) {
    console.error('Error fetching referral analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load analytics' },
      { status: 500 }
    )
  }
}
