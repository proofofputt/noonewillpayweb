import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import db, { users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { createAdminToken } from '@/lib/admin-auth'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validated = LoginSchema.parse(data)

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied - admin only' },
        { status: 403 }
      )
    }

    // Create JWT token
    const token = await createAdminToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
