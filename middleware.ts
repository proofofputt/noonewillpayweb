import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting (resets on cold start, but good enough for basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = {
  '/api/submit-survey': 5, // Max 5 survey submissions per minute per IP
  '/api/submit-interview': 10, // Max 10 interview submissions per minute (admin)
  '/api/auth/login': 10, // Max 10 login attempts per minute
  '/api/auth/signup': 5, // Max 5 signups per minute
  default: 100, // Max 100 requests per minute for other endpoints
}

/**
 * Extract IP address from request
 */
function getIP(request: NextRequest): string {
  // Check Vercel's forwarded IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
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

  return 'unknown'
}

/**
 * Get rate limit for specific path
 */
function getRateLimit(pathname: string): number {
  for (const [path, limit] of Object.entries(MAX_REQUESTS_PER_WINDOW)) {
    if (pathname.startsWith(path)) {
      return limit
    }
  }
  return MAX_REQUESTS_PER_WINDOW.default
}

/**
 * Check if request should be rate limited
 */
function isRateLimited(ip: string, pathname: string): boolean {
  const now = Date.now()
  const key = `${ip}:${pathname}`
  const limit = getRateLimit(pathname)

  const existing = rateLimitMap.get(key)

  if (!existing || now > existing.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (existing.count >= limit) {
    return true // Rate limited
  }

  // Increment counter
  existing.count++
  return false
}

/**
 * Clean up old entries periodically (prevent memory leak)
 */
function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitMap, 5 * 60 * 1000)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip rate limiting for static assets and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Files with extensions
  ) {
    return NextResponse.next()
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api')) {
    const ip = getIP(request)

    if (isRateLimited(ip, pathname)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: 60, // seconds
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': String(getRateLimit(pathname)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Add security headers to response
  const response = NextResponse.next()

  // Additional runtime security headers
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  response.headers.set('X-Request-ID', crypto.randomUUID())

  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
