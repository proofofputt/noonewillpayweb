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

/**
 * Birth decade options for user profiles
 */
export const BIRTH_DECADES = [
  { value: '1900-1940', label: 'Born 1900-1940 (Silent Generation and earlier)' },
  { value: '1940-1950', label: 'Born 1940-1950 (Silent Generation)' },
  { value: '1950-1960', label: 'Born 1950-1960 (Baby Boomers)' },
  { value: '1960-1970', label: 'Born 1960-1970 (Baby Boomers / Gen X)' },
  { value: '1970-1980', label: 'Born 1970-1980 (Gen X)' },
  { value: '1980-1990', label: 'Born 1980-1990 (Millennials)' },
  { value: '1990-2000', label: 'Born 1990-2000 (Millennials / Gen Z)' },
  { value: '2000-2010', label: 'Born 2000-2010 (Gen Z)' },
] as const

export type BirthDecade = typeof BIRTH_DECADES[number]['value']
