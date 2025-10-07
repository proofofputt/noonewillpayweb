import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { charityPool } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'

const ClaimSchema = z.object({
  claimCode: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = ClaimSchema.parse(body)

    // Check if charity item is available
    const [item] = await db.select()
      .from(charityPool)
      .where(
        and(
          eq(charityPool.claimCode, data.claimCode),
          eq(charityPool.claimed, false)
        )
      )
      .limit(1)

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Charity item not available or already claimed' },
        { status: 404 }
      )
    }

    // Claim the item
    await db.update(charityPool)
      .set({
        claimed: true,
        claimedBy: session.id,
        claimedAt: new Date(),
      })
      .where(eq(charityPool.id, item.id))

    return NextResponse.json({
      success: true,
      claim: {
        successful: true,
        claimCode: data.claimCode,
        packageId: item.packageId,
        message: 'Charity item claimed successfully!',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Claim error:', error)
    return NextResponse.json(
      { success: false, message: 'Claim failed' },
      { status: 500 }
    )
  }
}
