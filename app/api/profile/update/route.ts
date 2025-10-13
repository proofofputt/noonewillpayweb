import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { requireAuth, BIRTH_DECADES } from '@/lib/auth-helpers'

const UpdateProfileSchema = z.object({
  birthDecade: z.string().optional().refine(
    (val) => !val || BIRTH_DECADES.some(d => d.value === val),
    { message: 'Invalid birth decade' }
  ),
  username: z.string().min(3, 'Username must be at least 3 characters').max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const currentUser = await requireAuth()

    const body = await request.json()
    const data = UpdateProfileSchema.parse(body)

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date(),
    }

    if (data.birthDecade !== undefined) {
      updates.birthDecade = data.birthDecade || null
    }

    if (data.username) {
      // Check if username is already taken by another user
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, data.username))
        .limit(1)

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 400 }
        )
      }

      updates.username = data.username
    }

    // Update the user
    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, currentUser.id))

    // Fetch updated user
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUser.id))
      .limit(1)

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        referralCode: updatedUser.referralCode,
        birthDecade: updatedUser.birthDecade,
        allocationPoints: updatedUser.allocationPoints,
      }
    })
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Please log in to update your profile' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
