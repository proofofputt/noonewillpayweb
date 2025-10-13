import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { magicLinks, users } from '@/lib/db'
import { eq, and, gt } from 'drizzle-orm'
import { generateMagicLinkToken } from '@/lib/auth'
import { sendMagicLink, maskPhoneNumber } from '@/lib/sms'
import { getClientIP } from '@/lib/ip'

// Validation schema
const RequestSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

// Rate limiting: Track requests per phone number
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS_PER_HOUR = 5

function isRateLimited(phone: string): boolean {
  const now = Date.now()
  const existing = rateLimitMap.get(phone)

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(phone, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (existing.count >= MAX_REQUESTS_PER_HOUR) {
    return true
  }

  existing.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validated = RequestSchema.parse(data)

    // Check rate limiting
    if (isRateLimited(validated.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      )
    }

    // Check if user exists with this phone number
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, validated.phone))
      .limit(1)

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'No account found with this phone number. Please complete the survey first.',
        },
        { status: 404 }
      )
    }

    // Generate magic link token
    const token = generateMagicLinkToken()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Get client IP and user agent
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

    // Store magic link in database
    await db.insert(magicLinks).values({
      phone: validated.phone,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    })

    // Generate magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
    const magicLinkUrl = `${baseUrl}/api/auth/magic-link/verify?token=${token}`

    // Send magic link via SMS
    const smsResult = await sendMagicLink(validated.phone, magicLinkUrl)

    if (!smsResult.success) {
      console.error('Failed to send magic link SMS:', smsResult.error)
      // Don't fail the request if SMS fails in dev mode
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to send magic link. Please try again.',
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Magic link sent to ${maskPhoneNumber(validated.phone)}`,
      // In development, also return the link for easy testing
      ...(process.env.NODE_ENV === 'development' && {
        devMagicLink: magicLinkUrl,
      }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error requesting magic link:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to request magic link',
      },
      { status: 500 }
    )
  }
}
