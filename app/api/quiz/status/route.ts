import { NextRequest, NextResponse } from 'next/server'
import db, { surveyResponses } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('referralCode')

    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: 'Referral code required' },
        { status: 400 }
      )
    }

    // Find survey response by user's referral code
    const [surveyResponse] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, referralCode))
      .limit(1)

    if (!surveyResponse) {
      return NextResponse.json(
        { success: false, error: 'Survey not found' },
        { status: 404 }
      )
    }

    // Get Quick Quiz question IDs
    const quickQuizQuestionIds = surveyResponse.quickQuizQuestions
      ? JSON.parse(surveyResponse.quickQuizQuestions as string)
      : []

    // Calculate quiz status
    const quickQuizCompleted = !!surveyResponse.quickQuizScore
    const fullAssessmentCompleted = surveyResponse.fullAssessmentCompleted
    const questionsAnswered = quickQuizCompleted ? (fullAssessmentCompleted ? 21 : 3) : 0
    const remainingQuestions = fullAssessmentCompleted ? 0 : (quickQuizCompleted ? 18 : 21)

    // Calculate potential points
    let potentialPoints = 0
    if (!quickQuizCompleted) {
      potentialPoints = 30 // Quick Quiz max
    } else if (!fullAssessmentCompleted) {
      potentialPoints = 195 // Full Assessment remaining points
    }

    // Get current scores
    const quickQuizScore = surveyResponse.quickQuizScore || 0
    const fullAssessmentScore = surveyResponse.fullAssessmentScore || 0
    const totalScore = quickQuizScore + fullAssessmentScore

    return NextResponse.json({
      success: true,
      quickQuizCompleted,
      quickQuizScore,
      quickQuizMaxScore: 30,
      fullAssessmentCompleted,
      fullAssessmentScore,
      fullAssessmentMaxScore: 195,
      totalScore,
      totalMaxScore: 225,
      totalPercentage: totalScore > 0 ? Math.round((totalScore / 225) * 100) : 0,
      questionsAnswered,
      remainingQuestions,
      potentialPoints,
      quickQuizQuestionIds,
      canTakeFullAssessment: quickQuizCompleted && !fullAssessmentCompleted,
      allQuestionsCompleted: fullAssessmentCompleted
    })
  } catch (error) {
    console.error('Error fetching quiz status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz status' },
      { status: 500 }
    )
  }
}
