import { NextRequest, NextResponse } from 'next/server'
import db, { surveyResponses, users } from '@/lib/db'
import { eq, and, isNotNull, sql } from 'drizzle-orm'
import { getAllQuestions, type ScoredQuestion } from '@/lib/questions'

interface FilterParams {
  quizType?: 'quick' | 'full' | 'both'
  birthDecade?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const quizType = searchParams.get('quizType') as FilterParams['quizType'] || 'both'
    const birthDecade = searchParams.get('birthDecade') || undefined

    // Build where conditions
    const conditions: any[] = []

    // Filter by quiz type
    if (quizType === 'full') {
      conditions.push(eq(surveyResponses.fullAssessmentCompleted, true))
    }

    // Filter by birth decade (join with users)
    let query = db
      .select({
        surveyId: surveyResponses.id,
        userId: surveyResponses.userId,
        answers: surveyResponses.answers,
        quickQuizScore: surveyResponses.quickQuizScore,
        fullAssessmentScore: surveyResponses.fullAssessmentScore,
        fullAssessmentCompleted: surveyResponses.fullAssessmentCompleted,
        quickQuizQuestions: surveyResponses.quickQuizQuestions,
        timestamp: surveyResponses.timestamp,
        userBirthDecade: users.birthDecade,
        userUsername: users.username,
      })
      .from(surveyResponses)
      .leftJoin(users, eq(surveyResponses.userId, users.id))

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    // If filtering by birth decade, add that condition
    if (birthDecade) {
      query = query.where(eq(users.birthDecade, birthDecade)) as any
    }

    const surveys = await query

    // Calculate statistics
    const totalResponses = surveys.length

    if (totalResponses === 0) {
      return NextResponse.json({
        success: true,
        totalResponses: 0,
        averageScores: null,
        questionStats: [],
        demographicBreakdown: {},
        filters: { quizType, birthDecade },
      })
    }

    // Calculate average scores
    const quickQuizScores = surveys
      .filter(s => s.quickQuizScore !== null)
      .map(s => s.quickQuizScore || 0)

    const fullAssessmentScores = surveys
      .filter(s => s.fullAssessmentCompleted && s.fullAssessmentScore !== null)
      .map(s => s.fullAssessmentScore || 0)

    const combinedScores = surveys.map(s =>
      (s.quickQuizScore || 0) + (s.fullAssessmentScore || 0)
    )

    const averageScores = {
      quickQuiz: quickQuizScores.length > 0
        ? quickQuizScores.reduce((sum, score) => sum + score, 0) / quickQuizScores.length
        : 0,
      fullAssessment: fullAssessmentScores.length > 0
        ? fullAssessmentScores.reduce((sum, score) => sum + score, 0) / fullAssessmentScores.length
        : 0,
      combined: combinedScores.reduce((sum, score) => sum + score, 0) / combinedScores.length,
    }

    // Analyze question answers
    const allQuestions = getAllQuestions()
    const questionStats: Array<{
      id: string
      question: string
      difficulty: string
      correctAnswer: string
      totalAnswers: number
      correctAnswers: number
      correctPercentage: number
      answerDistribution: Record<string, number>
    }> = []

    for (const question of allQuestions) {
      let totalAnswers = 0
      let correctAnswers = 0
      const answerDistribution: Record<string, number> = {}

      for (const survey of surveys) {
        try {
          const answers: ScoredQuestion[] = JSON.parse(survey.answers)
          const answer = answers.find(a => a.id === question.id)

          if (answer) {
            totalAnswers++
            if (answer.isCorrect) {
              correctAnswers++
            }

            // Track answer distribution
            const userAnswer = answer.userAnswer || 'No answer'
            answerDistribution[userAnswer] = (answerDistribution[userAnswer] || 0) + 1
          }
        } catch (e) {
          // Skip malformed answers
        }
      }

      if (totalAnswers > 0) {
        questionStats.push({
          id: question.id,
          question: question.question,
          difficulty: question.difficulty,
          correctAnswer: question.correctAnswer,
          totalAnswers,
          correctAnswers,
          correctPercentage: (correctAnswers / totalAnswers) * 100,
          answerDistribution,
        })
      }
    }

    // Sort questions by hardest (lowest correct percentage) first
    questionStats.sort((a, b) => a.correctPercentage - b.correctPercentage)

    // Demographic breakdown
    const demographicBreakdown: Record<string, {
      count: number
      averageScore: number
      fullAssessmentCompletionRate: number
    }> = {}

    for (const survey of surveys) {
      const decade = survey.userBirthDecade || 'Not specified'

      if (!demographicBreakdown[decade]) {
        demographicBreakdown[decade] = {
          count: 0,
          averageScore: 0,
          fullAssessmentCompletionRate: 0,
        }
      }

      demographicBreakdown[decade].count++
      demographicBreakdown[decade].averageScore += (survey.quickQuizScore || 0) + (survey.fullAssessmentScore || 0)

      if (survey.fullAssessmentCompleted) {
        demographicBreakdown[decade].fullAssessmentCompletionRate++
      }
    }

    // Calculate averages
    for (const decade in demographicBreakdown) {
      const data = demographicBreakdown[decade]
      data.averageScore = data.averageScore / data.count
      data.fullAssessmentCompletionRate = (data.fullAssessmentCompletionRate / data.count) * 100
    }

    // Quiz completion stats
    const completionStats = {
      quickQuizOnly: surveys.filter(s => !s.fullAssessmentCompleted).length,
      fullAssessmentCompleted: surveys.filter(s => s.fullAssessmentCompleted).length,
      completionRate: (surveys.filter(s => s.fullAssessmentCompleted).length / totalResponses) * 100,
    }

    return NextResponse.json({
      success: true,
      totalResponses,
      averageScores: {
        quickQuiz: Math.round(averageScores.quickQuiz * 10) / 10,
        fullAssessment: Math.round(averageScores.fullAssessment * 10) / 10,
        combined: Math.round(averageScores.combined * 10) / 10,
      },
      completionStats,
      questionStats,
      demographicBreakdown,
      filters: { quizType, birthDecade },
    })
  } catch (error) {
    console.error('Error aggregating results:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate results' },
      { status: 500 }
    )
  }
}
