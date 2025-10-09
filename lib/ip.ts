import { NextRequest } from 'next/server'

/**
 * Extract IP address from Next.js request
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 */
export function getClientIP(request: NextRequest): string | null {
  // Check Vercel's forwarded IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim()
  }

  // Check Cloudflare's connecting IP
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Check real IP header
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to remote address (not available in Edge runtime)
  return null
}

/**
 * Hash IP address for privacy (optional)
 * Uses simple hashing - for production consider crypto.subtle
 */
export function hashIP(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}
