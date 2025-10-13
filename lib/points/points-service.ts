// lib/points/points-service.ts

import { PointType } from './point-types'
import db, { allocationPointsHistory, users } from '@/lib/db'
import { eq, and, desc } from 'drizzle-orm'

export interface AwardPointsParams {
  userId: string
  points: number
  pointType: PointType
  source: string
  sourceId?: string
  description: string
  metadata?: Record<string, any>
  referralCode?: string
  referralLevel?: number
  referredUserId?: string
  quizType?: 'quick_quiz' | 'full_assessment'
  quizQuestionId?: string
  quizCorrect?: boolean
  createdBy?: 'user' | 'system' | 'admin'
  ipAddress?: string
  userAgent?: string
}

export class PointsService {
  /**
   * Award points to a user with full audit trail
   */
  static async awardPoints(params: AwardPointsParams): Promise<string> {
    const {
      userId,
      points,
      pointType,
      source,
      sourceId,
      description,
      metadata = {},
      referralCode,
      referralLevel,
      referredUserId,
      quizType,
      quizQuestionId,
      quizCorrect,
      createdBy = 'system',
      ipAddress,
      userAgent
    } = params

    // Validation
    if (points === 0) {
      throw new Error('Points must be non-zero')
    }

    // Record in history
    const [historyRecord] = await db.insert(allocationPointsHistory).values({
      userId,
      points: points.toFixed(3),
      pointType,
      source,
      sourceId: sourceId || null,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null,
      referralCode: referralCode || null,
      referralLevel: referralLevel || null,
      referredUserId: referredUserId || null,
      quizType: quizType || null,
      quizQuestionId: quizQuestionId || null,
      quizCorrect: quizCorrect ?? null,
      createdBy,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      verified: true,
      verifiedAt: new Date()
    }).returning()

    // Update user's total allocation points
    await this.recalculateUserPoints(userId)

    console.log(`[Points] Awarded ${points} points to user ${userId} for ${pointType}`)

    return historyRecord.id
  }

  /**
   * Recalculate user's total points from history
   * This ensures accuracy even if denormalized fields get out of sync
   */
  static async recalculateUserPoints(userId: string): Promise<number> {
    // Sum all non-reversed points from history
    const pointsHistory = await db
      .select()
      .from(allocationPointsHistory)
      .where(
        and(
          eq(allocationPointsHistory.userId, userId),
          eq(allocationPointsHistory.reversed, false)
        )
      )

    const totalPoints = pointsHistory.reduce((sum, record) => {
      return sum + parseFloat(record.points as any)
    }, 0)

    // Update user record
    await db
      .update(users)
      .set({ allocationPoints: totalPoints.toFixed(3) })
      .where(eq(users.id, userId))

    return totalPoints
  }

  /**
   * Get user's points history with filtering and pagination
   */
  static async getUserHistory(
    userId: string,
    options: {
      pointType?: PointType
      limit?: number
      offset?: number
      startDate?: Date
      endDate?: Date
    } = {}
  ) {
    const { limit = 50, offset = 0 } = options

    const history = await db
      .select()
      .from(allocationPointsHistory)
      .where(eq(allocationPointsHistory.userId, userId))
      .orderBy(desc(allocationPointsHistory.createdAt))
      .limit(limit)
      .offset(offset)

    return {
      history,
      total: history.length,
      hasMore: history.length === limit
    }
  }

  /**
   * Get user's points breakdown by type
   */
  static async getUserBreakdown(userId: string) {
    const history = await db
      .select()
      .from(allocationPointsHistory)
      .where(
        and(
          eq(allocationPointsHistory.userId, userId),
          eq(allocationPointsHistory.reversed, false)
        )
      )

    const breakdown: Record<string, { count: number; total: number }> = {}

    for (const record of history) {
      const type = record.pointType as string
      if (!breakdown[type]) {
        breakdown[type] = { count: 0, total: 0 }
      }
      breakdown[type].count++
      breakdown[type].total += parseFloat(record.points as any)
    }

    return breakdown
  }

  /**
   * Reverse a points transaction (admin only)
   */
  static async reversePoints(
    transactionId: string,
    reversedBy: string,
    reason: string
  ): Promise<void> {
    // Get original transaction
    const [original] = await db
      .select()
      .from(allocationPointsHistory)
      .where(eq(allocationPointsHistory.id, transactionId))
      .limit(1)

    if (!original) {
      throw new Error('Transaction not found')
    }

    if (original.reversed) {
      throw new Error('Transaction already reversed')
    }

    // Mark original as reversed
    await db
      .update(allocationPointsHistory)
      .set({
        reversed: true,
        reversedAt: new Date(),
        reversedBy,
        reversalReason: reason
      })
      .where(eq(allocationPointsHistory.id, transactionId))

    // Create reversal transaction (negative points)
    await db.insert(allocationPointsHistory).values({
      userId: original.userId as string,
      points: (parseFloat(original.points as any) * -1).toFixed(3),
      pointType: PointType.ADMIN_ADJUSTMENT,
      source: 'reversal',
      sourceId: original.id,
      description: `Reversal: ${reason}`,
      metadata: JSON.stringify({
        originalTransaction: original.id,
        originalPoints: original.points,
        originalType: original.pointType
      }),
      createdBy: 'admin',
      reversalTransactionId: original.id
    })

    // Recalculate user's total
    await this.recalculateUserPoints(original.userId as string)

    console.log(`[Points] Reversed transaction ${transactionId}: ${reason}`)
  }
}
