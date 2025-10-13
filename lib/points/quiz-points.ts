// lib/points/quiz-points.ts

import { PointsService } from './points-service'
import { PointType } from './point-types'

export async function recordQuickQuizPoints(
  userId: string,
  questions: Array<{ id: string; correct: boolean; points: number }>,
  totalScore: number,
  ipAddress?: string,
  userAgent?: string
) {
  // Record individual question points
  for (const question of questions) {
    if (question.correct) {
      await PointsService.awardPoints({
        userId,
        points: question.points,
        pointType: PointType.QUIZ_QUESTION,
        source: 'quick_quiz',
        sourceId: userId,
        description: `Quick Quiz Question ${question.id}`,
        metadata: {
          questionId: question.id,
          quizType: 'quick_quiz'
        },
        quizType: 'quick_quiz',
        quizQuestionId: question.id,
        quizCorrect: true,
        createdBy: 'system',
        ipAddress,
        userAgent
      })
    }
  }

  console.log(`[Quiz Points] Awarded ${totalScore} points to user ${userId} for Quick Quiz`)
}

export async function recordFullAssessmentPoints(
  userId: string,
  questions: Array<{ id: string; correct: boolean; points: number }>,
  totalScore: number,
  ipAddress?: string,
  userAgent?: string
) {
  // Record individual question points
  for (const question of questions) {
    if (question.correct) {
      await PointsService.awardPoints({
        userId,
        points: question.points,
        pointType: PointType.QUIZ_QUESTION,
        source: 'full_assessment',
        sourceId: userId,
        description: `Full Assessment Question ${question.id}`,
        metadata: {
          questionId: question.id,
          quizType: 'full_assessment'
        },
        quizType: 'full_assessment',
        quizQuestionId: question.id,
        quizCorrect: true,
        createdBy: 'system',
        ipAddress,
        userAgent
      })
    }
  }

  console.log(`[Quiz Points] Awarded ${totalScore} points to user ${userId} for Full Assessment`)
}

export async function recordRegistrationBonus(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  await PointsService.awardPoints({
    userId,
    points: 10,
    pointType: PointType.REGISTRATION_BONUS,
    source: 'registration',
    sourceId: userId,
    description: 'Registration bonus',
    metadata: {
      bonusType: 'registration'
    },
    createdBy: 'system',
    ipAddress,
    userAgent
  })

  console.log(`[Quiz Points] Awarded registration bonus (10 points) to user ${userId}`)
}
