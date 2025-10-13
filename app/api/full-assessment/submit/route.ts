import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { surveyResponses, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getClientIP } from '@/lib/ip'
import { getAllQuestions, scoreQuestions, type Question } from '@/lib/questions'
import { recordFullAssessmentPoints } from '@/lib/points/quiz-points'

// Validation schema
const FullAssessmentSchema = z.object({
  answers: z.record(z.string()), // question1-21 format
  referralCode: z.string(), // User's referral code from their survey response
  timestamp: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate input
    const validated = FullAssessmentSchema.parse(data)

    // Get client IP and user agent for audit
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

    // Find the survey response by referral code (user's unique code)
    const [surveyResponse] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, validated.referralCode))
      .limit(1)

    if (!surveyResponse) {
      return NextResponse.json(
        { success: false, error: 'Survey not found. Please complete Quick Quiz first.' },
        { status: 404 }
      )
    }

    // Check if Full Assessment already completed
    if (surveyResponse.fullAssessmentCompleted) {
      return NextResponse.json(
        { success: false, error: 'Full Assessment already completed' },
        { status: 409 }
      )
    }

    // Get all questions
    const allQuestions = getAllQuestions()

    // Get the Quick Quiz question IDs (already answered)
    const quickQuizQuestionIds = surveyResponse.quickQuizQuestions
      ? JSON.parse(surveyResponse.quickQuizQuestions as string)
      : []

    // Filter to get only the remaining 18 questions
    const remainingQuestions = allQuestions.filter(
      q => !quickQuizQuestionIds.includes(q.id)
    )

    // Score the remaining questions
    const scoringResult = scoreQuestions(remainingQuestions, validated.answers)
    const { totalScore, maxScore, percentage, scoredQuestions } = scoringResult

    // Update survey response with Full Assessment data
    await db
      .update(surveyResponses)
      .set({
        fullAssessmentScore: totalScore,
        fullAssessmentCompleted: true,
        fullAssessmentCompletedAt: new Date(),
      })
      .where(eq(surveyResponses.id, surveyResponse.id))

    // Award points via PointsService if user exists
    if (surveyResponse.userId) {
      // Prepare questions array for points recording
      const questionsForPoints = scoredQuestions.map(q => ({
        id: q.id,
        correct: q.isCorrect,
        points: q.pointsEarned
      }))

      await recordFullAssessmentPoints(
        surveyResponse.userId,
        questionsForPoints,
        totalScore,
        ipAddress || undefined,
        userAgent || undefined
      )
    }

    // Calculate combined totals
    const quickQuizScore = surveyResponse.quickQuizScore || 0
    const combinedScore = quickQuizScore + totalScore
    const combinedMaxScore = 225 // 30 from Quick Quiz + 195 from Full Assessment

    return NextResponse.json({
      success: true,
      message: 'Full Assessment submitted successfully',
      fullAssessmentScore: totalScore,
      fullAssessmentMaxScore: maxScore,
      fullAssessmentPercentage: percentage,
      quickQuizScore,
      combinedScore,
      combinedMaxScore,
      combinedPercentage: Math.round((combinedScore / combinedMaxScore) * 100),
      scoredQuestions,
      questionsAnswered: 21,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid assessment data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing Full Assessment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit Full Assessment' },
      { status: 500 }
    )
  }
}
