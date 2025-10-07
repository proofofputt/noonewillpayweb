import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, createToken, generateReferralCode } from '@/lib/auth'
import db, { users, referrals } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, referredByCode } = await request.json()

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate unique referral code
    let referralCode = generateReferralCode(email)
    let codeExists = true
    let attempts = 0

    // Ensure referral code is unique
    while (codeExists && attempts < 5) {
      const existing = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1)
      if (existing.length === 0) {
        codeExists = false
      } else {
        referralCode = generateReferralCode(email + attempts)
        attempts++
      }
    }

    // Create user in database
    const [newUser] = await db.insert(users).values({
      email,
      username,
      passwordHash,
      referralCode,
      referredByCode: referredByCode || null,
      allocationPoints: 0,
    }).returning()

    // If referred by someone, create referral record
    if (referredByCode) {
      const [referrer] = await db.select().from(users).where(eq(users.referralCode, referredByCode)).limit(1)

      if (referrer) {
        // Create referral record
        await db.insert(referrals).values({
          referrerId: referrer.id,
          referredId: newUser.id,
          pointsEarned: 50,
          status: 'active',
        })

        // Award points to referrer
        await db.update(users)
          .set({ allocationPoints: referrer.allocationPoints + 50 })
          .where(eq(users.id, referrer.id))
      }
    }

    // Create session token
    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      referralCode: newUser.referralCode,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        referralCode: newUser.referralCode,
      }
    })

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
