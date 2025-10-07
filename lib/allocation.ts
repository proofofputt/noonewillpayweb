export interface AllocationParams {
  userScore: number
  referralCount: number
  referredScores: number
}

export interface UserAllocation {
  userId: string
  email: string
  basePoints: number
  referralBonus: number
  scoreBonus: number
  totalPoints: number
  rank: number
  percentile: number
}

/**
 * Calculate allocation points for a user
 * Formula:
 * - Base: Personal survey score (0-300 points, 100 per question)
 * - Referral Bonus: 50 points per successful referral
 * - Score Bonus: 10% of referred users' total scores
 */
export function calculateAllocationPoints(params: AllocationParams): number {
  const { userScore, referralCount, referredScores } = params

  const basePoints = userScore
  const referralBonus = referralCount * 50
  const scoreBonus = referredScores * 0.1

  return basePoints + referralBonus + scoreBonus
}

/**
 * Calculate detailed allocation breakdown
 */
export function calculateAllocationBreakdown(params: AllocationParams) {
  const { userScore, referralCount, referredScores } = params

  const basePoints = userScore
  const referralBonus = referralCount * 50
  const scoreBonus = referredScores * 0.1
  const totalPoints = basePoints + referralBonus + scoreBonus

  return {
    basePoints,
    referralBonus,
    scoreBonus,
    totalPoints,
    breakdown: {
      personal: {
        score: userScore,
        points: basePoints,
        percentage: (basePoints / totalPoints) * 100
      },
      referrals: {
        count: referralCount,
        points: referralBonus,
        percentage: (referralBonus / totalPoints) * 100
      },
      quality: {
        referredScores,
        points: scoreBonus,
        percentage: (scoreBonus / totalPoints) * 100
      }
    }
  }
}

/**
 * Calculate score from survey answers
 */
export function calculateSurveyScore(answers: Array<{
  correct: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}>): number {
  return answers.reduce((total, answer) => {
    if (!answer.correct) return total

    switch (answer.difficulty) {
      case 'easy': return total + 100
      case 'medium': return total + 100
      case 'hard': return total + 100
      default: return total
    }
  }, 0)
}

/**
 * Rank users by allocation points
 */
export function rankUsers(allocations: UserAllocation[]): UserAllocation[] {
  const sorted = [...allocations].sort((a, b) => b.totalPoints - a.totalPoints)

  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
    percentile: ((sorted.length - index) / sorted.length) * 100
  }))
}

/**
 * Calculate total allocation pool
 */
export function calculateTotalPool(allocations: UserAllocation[]): number {
  return allocations.reduce((sum, user) => sum + user.totalPoints, 0)
}

/**
 * Calculate user's share of allocation
 */
export function calculateUserShare(
  userPoints: number,
  totalPool: number,
  totalAllocation: number = 1000000 // Default 1M tokens
): number {
  if (totalPool === 0) return 0
  return (userPoints / totalPool) * totalAllocation
}

/**
 * Generate allocation report
 */
export function generateAllocationReport(users: Array<{
  id: string
  email: string
  userScore: number
  referralCount: number
  referredScores: number
}>) {
  const allocations: UserAllocation[] = users.map(user => {
    const breakdown = calculateAllocationBreakdown({
      userScore: user.userScore,
      referralCount: user.referralCount,
      referredScores: user.referredScores
    })

    return {
      userId: user.id,
      email: user.email,
      basePoints: breakdown.basePoints,
      referralBonus: breakdown.referralBonus,
      scoreBonus: breakdown.scoreBonus,
      totalPoints: breakdown.totalPoints,
      rank: 0,
      percentile: 0
    }
  })

  const ranked = rankUsers(allocations)
  const totalPool = calculateTotalPool(ranked)

  return {
    users: ranked.map(user => ({
      ...user,
      share: calculateUserShare(user.totalPoints, totalPool),
      sharePercentage: (user.totalPoints / totalPool) * 100
    })),
    summary: {
      totalUsers: ranked.length,
      totalPool,
      averagePoints: totalPool / ranked.length,
      topUser: ranked[0],
      medianUser: ranked[Math.floor(ranked.length / 2)]
    }
  }
}
