import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { randomBytes } from 'crypto'

// Validate JWT_SECRET exists - fail fast in production
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export interface UserSession {
  id: string
  email: string
  username: string
  referralCode: string
  [key: string]: string // Index signature for JWT compatibility
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: UserSession): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as UserSession
  } catch (error) {
    return null
  }
}

export function generateReferralCode(email: string): string {
  const emailPrefix = email.substring(0, 4).toUpperCase()
  // Use cryptographically secure random
  const random = randomBytes(4).toString('hex').toUpperCase()
  return `${emailPrefix}${random}`
}

/**
 * Generate a secure magic link token
 * @returns 64-character hex string
 */
export function generateMagicLinkToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Generate a username from phone number
 * Format: user_{last4digits}_{random}
 */
export function generateUsernameFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const last4 = digits.slice(-4)
  const random = randomBytes(2).toString('hex')
  return `user_${last4}_${random}`
}
