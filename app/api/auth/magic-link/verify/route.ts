import { NextRequest, NextResponse } from 'next/server'
import db, { magicLinks, users } from '@/lib/db'
import { eq, and, gt } from 'drizzle-orm'
import { createToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=missing_token', request.url)
      )
    }

    // Find the magic link in database
    const [magicLink] = await db
      .select()
      .from(magicLinks)
      .where(
        and(
          eq(magicLinks.token, token),
          eq(magicLinks.used, false),
          gt(magicLinks.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!magicLink) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_or_expired', request.url)
      )
    }

    // Find user by phone number
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.phone, magicLink.phone))
      .limit(1)

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=user_not_found', request.url)
      )
    }

    // Mark magic link as used
    await db
      .update(magicLinks)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(magicLinks.id, magicLink.id))

    // Create session token
    const sessionToken = await createToken({
      id: user.id,
      email: user.email,
      username: user.username,
      referralCode: user.referralCode,
    })

    // Redirect to dashboard with cookie set
    const response = NextResponse.redirect(
      new URL('/my-dashboard', request.url)
    )

    // Set secure cookie
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error verifying magic link:', error)
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', request.url)
    )
  }
}
