import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaTreasury, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/treasury/redeem
 * Redeem a claim code at pizzeria (pizzeria owner or admin only)
 * Body: { claimCode }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.claimCode) {
      return NextResponse.json(
        { success: false, error: 'Claim code is required' },
        { status: 400 }
      )
    }

    // Find the claim
    const [claim] = await db
      .select({
        claim: pizzaTreasury,
        pizzeria: pizzerias,
      })
      .from(pizzaTreasury)
      .leftJoin(pizzerias, eq(pizzaTreasury.pizzeriaId, pizzerias.id))
      .where(eq(pizzaTreasury.claimCode, data.claimCode))
      .limit(1)

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim code' },
        { status: 404 }
      )
    }

    // Check authorization (must be pizzeria owner or admin)
    if (claim.pizzeria?.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - you do not own this pizzeria' },
        { status: 403 }
      )
    }

    // Check if already redeemed
    if (claim.claim.redeemedAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'This claim has already been redeemed',
          redeemedAt: claim.claim.redeemedAt,
        },
        { status: 400 }
      )
    }

    // Check if claim has expired
    if (claim.claim.expiresAt && new Date(claim.claim.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This claim has expired' },
        { status: 400 }
      )
    }

    // Redeem the claim
    const [redeemed] = await db
      .update(pizzaTreasury)
      .set({
        redeemedAt: new Date(),
      })
      .where(eq(pizzaTreasury.id, claim.claim.id))
      .returning()

    return NextResponse.json({
      success: true,
      redemption: {
        ...redeemed,
        pizzeria: claim.pizzeria,
      },
      message: `Successfully redeemed 1 ${claim.claim.itemType}`,
    })
  } catch (error: any) {
    console.error('Error redeeming claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to redeem claim' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pizza-bank/treasury/redeem?code=XXX
 * Verify a claim code (view details without redeeming)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const claimCode = searchParams.get('code')

    if (!claimCode) {
      return NextResponse.json(
        { success: false, error: 'Claim code is required' },
        { status: 400 }
      )
    }

    // Find the claim
    const [claim] = await db
      .select({
        claim: pizzaTreasury,
        pizzeria: pizzerias,
      })
      .from(pizzaTreasury)
      .leftJoin(pizzerias, eq(pizzaTreasury.pizzeriaId, pizzerias.id))
      .where(eq(pizzaTreasury.claimCode, claimCode))
      .limit(1)

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Invalid claim code' },
        { status: 404 }
      )
    }

    // Check authorization (must be pizzeria owner or admin)
    if (claim.pizzeria?.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check status
    const isExpired = claim.claim.expiresAt && new Date(claim.claim.expiresAt) < new Date()
    const isRedeemed = !!claim.claim.redeemedAt
    const isValid = !isExpired && !isRedeemed

    return NextResponse.json({
      success: true,
      claim: {
        ...claim.claim,
        pizzeria: claim.pizzeria,
        isValid,
        isExpired,
        isRedeemed,
      },
    })
  } catch (error: any) {
    console.error('Error verifying claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify claim' },
      { status: 500 }
    )
  }
}
