import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import db, { users } from './db'
import { eq } from 'drizzle-orm'

export interface CurrentUser {
  id: string
  email: string
  username: string
  referralCode: string
  allocationPoints: string
  birthDecade: string | null
  registrationBonusAwarded: boolean
  isAdmin: boolean
  createdAt: Date
}

/**
 * Get the currently authenticated user from the auth-token cookie
 * Returns null if not authenticated or user not found
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    // Verify and decode the JWT token
    const session = await verifyToken(token)
    if (!session || !session.id) {
      return null
    }

    // Fetch the full user record from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      referralCode: user.referralCode,
      allocationPoints: user.allocationPoints,
      birthDecade: user.birthDecade,
      registrationBonusAwarded: user.registrationBonusAwarded,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in API routes and server components that require auth
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.isAdmin || false
}

// Re-export constants from shared constants file
export { BIRTH_DECADES, type BirthDecade } from './constants'
