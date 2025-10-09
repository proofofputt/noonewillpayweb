import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface AdminPayload extends Record<string, any> {
  userId: string
  email: string
  isAdmin: boolean
}

/**
 * Create JWT token for admin user
 */
export async function createAdminToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

/**
 * Verify JWT token and extract payload
 */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract admin token from request headers
 */
export function getAdminToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

/**
 * Verify if request is from authenticated admin
 */
export async function verifyAdminRequest(request: NextRequest): Promise<AdminPayload | null> {
  const token = getAdminToken(request)
  if (!token) {
    return null
  }
  return await verifyAdminToken(token)
}
