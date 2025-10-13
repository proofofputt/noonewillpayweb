import crypto from 'crypto'
import db, { surveyResponses } from '@/lib/db'
import { eq } from 'drizzle-orm'

/**
 * Generate a unique 8-character referral code
 * Format: XXXX-XXXX (e.g., AB3X-9K2L)
 */
export async function generateReferralCode(): Promise<string> {
  const maxAttempts = 10

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate random code
    const bytes = crypto.randomBytes(4)
    const code = bytes.toString('hex').toUpperCase().slice(0, 8)
    const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}`

    // Check if it already exists
    const existing = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, formatted))
      .limit(1)

    if (existing.length === 0) {
      return formatted
    }
  }

  // Fallback to timestamp-based code if collisions persist
  const timestamp = Date.now().toString(36).toUpperCase().slice(-8)
  return `${timestamp.slice(0, 4)}-${timestamp.slice(4, 8)}`
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)
}

/**
 * Award points to referrer when someone signs up using their code
 */
export async function awardReferralPoints(referralCode: string): Promise<{ success: boolean; points?: number }> {
  try {
    // Find the referrer's survey response
    const [referrer] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.referralCode, referralCode))
      .limit(1)

    if (!referrer) {
      return { success: false }
    }

    // Award 50 points to referrer (stored in their record for now)
    // In future, this could update a separate referral_stats table
    const referralPoints = 50

    return { success: true, points: referralPoints }
  } catch (error) {
    console.error('Error awarding referral points:', error)
    return { success: false }
  }
}
