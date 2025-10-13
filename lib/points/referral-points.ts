// lib/points/referral-points.ts

import { PointsService } from './points-service'
import { PointType, POINT_VALUES } from './point-types'

/**
 * Record referral points for a multi-level referral chain
 * Follows Bitcoin halving structure: 21 → 10.5 → 5.25 → 2.25 → 1.125
 */
export async function recordReferralPoints(
  referrerId: string,
  referredUserId: string,
  referralCode: string,
  level: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const pointTypeMap: Record<number, PointType> = {
    1: PointType.DIRECT_REFERRAL,
    2: PointType.SECOND_DEGREE_REFERRAL,
    3: PointType.THIRD_DEGREE_REFERRAL,
    4: PointType.FOURTH_DEGREE_REFERRAL,
    5: PointType.FIFTH_DEGREE_REFERRAL
  }

  const pointsMap: Record<number, number> = {
    1: POINT_VALUES.DIRECT_REFERRAL, // 21
    2: POINT_VALUES.SECOND_DEGREE, // 10.5
    3: POINT_VALUES.THIRD_DEGREE, // 5.25
    4: POINT_VALUES.FOURTH_DEGREE, // 2.25
    5: POINT_VALUES.FIFTH_DEGREE // 1.125
  }

  const pointType = pointTypeMap[level]
  const points = pointsMap[level]

  if (!pointType || !points) {
    console.error(`Invalid referral level: ${level}`)
    return
  }

  await PointsService.awardPoints({
    userId: referrerId,
    points,
    pointType,
    source: 'referral',
    sourceId: referredUserId,
    description: `Level ${level} referral`,
    metadata: {
      referralLevel: level,
      pointsStructure: {
        1: 21,
        2: 10.5,
        3: 5.25,
        4: 2.25,
        5: 1.125
      }
    },
    referralCode,
    referralLevel: level,
    referredUserId,
    createdBy: 'system',
    ipAddress,
    userAgent
  })

  console.log(`[Referral Points] Awarded ${points} points to user ${referrerId} for level ${level} referral`)
}

/**
 * Record all multi-level referral points for a new user signup
 * This replaces the inline logic currently in awardMultiLevelReferralPoints
 */
export async function awardMultiLevelReferralChain(
  referralChain: Array<{ referrerId: string; level: number }>,
  referredUserId: string,
  referralCode: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  for (const { referrerId, level } of referralChain) {
    await recordReferralPoints(
      referrerId,
      referredUserId,
      referralCode,
      level,
      ipAddress,
      userAgent
    )
  }
}
