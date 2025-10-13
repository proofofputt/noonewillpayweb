/**
 * Multi-Level Referral System
 *
 * Implements Bitcoin-style halving for referral points:
 * - Level 1 (Direct): 21.00 points
 * - Level 2: 10.50 points (50% halving)
 * - Level 3: 5.25 points (50% halving)
 * - Level 4: 2.25 points (custom reduction)
 * - Level 5: 1.125 points (50% halving)
 */

import db, { surveyResponses, users, referrals, allocationPointsHistory } from '@/lib/db'
import { eq } from 'drizzle-orm'

/**
 * Points awarded at each referral level (Bitcoin-style halving)
 */
export const REFERRAL_POINTS_BY_LEVEL: Record<number, number> = {
  1: 21.000,   // Direct referral
  2: 10.500,   // 2nd degree (50% halving)
  3: 5.250,    // 3rd degree (50% halving)
  4: 2.250,    // 4th degree (custom reduction)
  5: 1.125,    // 5th degree (50% halving)
}

export const MAX_REFERRAL_DEPTH = 5

/**
 * Get points for a specific referral level
 */
export function getPointsForLevel(level: number): number {
  return REFERRAL_POINTS_BY_LEVEL[level] || 0
}

/**
 * Interface for referral chain node
 */
export interface ReferralChainNode {
  surveyId: string
  referralCode: string
  referredBy: string | null
  userId: string | null
  level: number
  points: number
}

/**
 * Walk up the referral chain and return all ancestors
 *
 * @param startingReferralCode - The code of the person who referred the new user
 * @param maxDepth - Maximum depth to traverse (default: 5)
 * @returns Array of referral chain nodes, ordered from closest to furthest
 */
export async function getReferralChain(
  startingReferralCode: string,
  maxDepth: number = MAX_REFERRAL_DEPTH
): Promise<ReferralChainNode[]> {
  const chain: ReferralChainNode[] = []
  let currentCode = startingReferralCode
  let level = 1

  while (currentCode && level <= maxDepth) {
    // Find the survey with this referral code
    const [survey] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, currentCode))
      .limit(1)

    if (!survey) {
      // Referral code doesn't exist or chain is broken
      break
    }

    // Add this node to the chain
    chain.push({
      surveyId: survey.id,
      referralCode: survey.referralCode,
      referredBy: survey.referredBy,
      userId: survey.userId,
      level,
      points: getPointsForLevel(level),
    })

    // Move up the chain
    currentCode = survey.referredBy || ''
    level++

    // Safety check: prevent infinite loops
    if (level > 100) {
      console.error('Referral chain depth exceeded 100, breaking to prevent infinite loop')
      break
    }
  }

  return chain
}

/**
 * Award points to all ancestors in the referral chain
 *
 * @param newSurveyId - ID of the newly created survey
 * @param referredByCode - Code of the person who directly referred this user
 * @returns Object with results of the point awards
 */
export async function awardMultiLevelReferralPoints(
  newSurveyId: string,
  referredByCode: string
): Promise<{
  success: boolean
  levelsAwarded: number
  totalPoints: number
  chain: ReferralChainNode[]
  errors: string[]
}> {
  const errors: string[] = []
  let levelsAwarded = 0
  let totalPoints = 0

  try {
    // Get the referral chain
    const chain = await getReferralChain(referredByCode, MAX_REFERRAL_DEPTH)

    console.log(`[Multi-Level Referrals] Processing chain of ${chain.length} levels for survey ${newSurveyId}`)

    // Award points to each ancestor in the chain
    for (const node of chain) {
      try {
        const points = node.points

        console.log(`[Multi-Level Referrals] Awarding ${points} points to ${node.referralCode} (level ${node.level})`)

        // Update user's allocation points if they have an account
        if (node.userId) {
          // Create referral record (only when user exists)
          await db.insert(referrals).values({
            referrerId: node.userId,
            referredId: null, // Will be set if the new user creates an account
            referredSurveyId: newSurveyId,
            referralLevel: node.level,
            status: 'active',
            pointsEarned: points.toString(),
          })
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, node.userId))
            .limit(1)

          if (user) {
            const currentPoints = parseFloat(user.allocationPoints as any) || 0
            const newPoints = currentPoints + points

            await db
              .update(users)
              .set({ allocationPoints: newPoints.toFixed(3) })
              .where(eq(users.id, user.id))

            // Record in points history
            await db.insert(allocationPointsHistory).values({
              userId: user.id,
              points: points.toString(),
              source: 'referral',
              sourceId: newSurveyId,
              referralLevel: node.level,
              description: `Level ${node.level} referral (${points} points)`,
            })

            console.log(`[Multi-Level Referrals] Updated user ${user.id} allocation points: ${currentPoints} -> ${newPoints}`)
          }
        }

        levelsAwarded++
        totalPoints += points
      } catch (error) {
        const errorMsg = `Failed to award points at level ${node.level}: ${error}`
        console.error(`[Multi-Level Referrals] ${errorMsg}`)
        errors.push(errorMsg)
      }
    }

    return {
      success: levelsAwarded > 0,
      levelsAwarded,
      totalPoints,
      chain,
      errors,
    }
  } catch (error) {
    console.error('[Multi-Level Referrals] Error in awardMultiLevelReferralPoints:', error)
    errors.push(`System error: ${error}`)

    return {
      success: false,
      levelsAwarded,
      totalPoints,
      chain: [],
      errors,
    }
  }
}

/**
 * Get referral statistics for a user
 *
 * @param referralCode - The user's referral code
 * @returns Statistics broken down by level
 */
export async function getReferralStats(referralCode: string): Promise<{
  totalReferrals: number
  directReferrals: number
  referralsByLevel: Record<number, number>
  pointsByLevel: Record<number, number>
  totalPoints: number
}> {
  // Find this user's survey
  const [userSurvey] = await db
    .select()
    .from(surveyResponses)
    .where(eq(surveyResponses.referralCode, referralCode))
    .limit(1)

  if (!userSurvey) {
    return {
      totalReferrals: 0,
      directReferrals: 0,
      referralsByLevel: {},
      pointsByLevel: {},
      totalPoints: 0,
    }
  }

  // Get all referrals for this user
  const allReferrals = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userSurvey.userId || ''))

  // Count referrals by level
  const referralsByLevel: Record<number, number> = {}
  const pointsByLevel: Record<number, number> = {}
  let totalPoints = 0

  for (const referral of allReferrals) {
    const level = referral.referralLevel || 1
    const points = parseFloat(referral.pointsEarned as any) || 0

    referralsByLevel[level] = (referralsByLevel[level] || 0) + 1
    pointsByLevel[level] = (pointsByLevel[level] || 0) + points
    totalPoints += points
  }

  return {
    totalReferrals: allReferrals.length,
    directReferrals: referralsByLevel[1] || 0,
    referralsByLevel,
    pointsByLevel,
    totalPoints,
  }
}

/**
 * Validate referral chain integrity
 * Checks for circular references and broken chains
 *
 * @param referralCode - Starting point to validate
 * @returns Validation result
 */
export async function validateReferralChain(referralCode: string): Promise<{
  valid: boolean
  issues: string[]
  chain: ReferralChainNode[]
}> {
  const issues: string[] = []
  const seenCodes = new Set<string>()

  try {
    const chain = await getReferralChain(referralCode, 100) // Use high limit to detect cycles

    // Check for circular references
    for (const node of chain) {
      if (seenCodes.has(node.referralCode)) {
        issues.push(`Circular reference detected: ${node.referralCode} appears multiple times in chain`)
        break
      }
      seenCodes.add(node.referralCode)
    }

    // Check for excessive depth
    if (chain.length > MAX_REFERRAL_DEPTH) {
      issues.push(`Chain depth ${chain.length} exceeds maximum of ${MAX_REFERRAL_DEPTH}`)
    }

    return {
      valid: issues.length === 0,
      issues,
      chain,
    }
  } catch (error) {
    issues.push(`Error validating chain: ${error}`)
    return {
      valid: false,
      issues,
      chain: [],
    }
  }
}
