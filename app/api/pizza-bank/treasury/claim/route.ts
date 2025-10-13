import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaTreasury, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql } from 'drizzle-orm'

/**
 * Helper to generate 6-digit claim code
 */
function generateClaimCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * POST /api/pizza-bank/treasury/claim
 * Claim a treasury item
 * Body: { treasuryItemId }
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

    if (!data.treasuryItemId) {
      return NextResponse.json(
        { success: false, error: 'Treasury item ID is required' },
        { status: 400 }
      )
    }

    // Get the treasury item
    const [item] = await db
      .select()
      .from(pizzaTreasury)
      .where(eq(pizzaTreasury.id, data.treasuryItemId))
      .limit(1)

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Treasury item not found' },
        { status: 404 }
      )
    }

    // Check if already claimed
    if (item.claimed) {
      return NextResponse.json(
        { success: false, error: 'This item has already been claimed' },
        { status: 400 }
      )
    }

    // Check if expired
    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This item has expired' },
        { status: 400 }
      )
    }

    // Generate unique claim code
    let claimCode = generateClaimCode()
    let codeExists = true

    while (codeExists) {
      const [existing] = await db
        .select()
        .from(pizzaTreasury)
        .where(eq(pizzaTreasury.claimCode, claimCode))
        .limit(1)

      if (!existing) {
        codeExists = false
      } else {
        claimCode = generateClaimCode()
      }
    }

    // Claim the item
    const [claimedItem] = await db
      .update(pizzaTreasury)
      .set({
        claimed: true,
        claimedByUserId: user.id,
        claimCode: claimCode,
        claimedAt: new Date(),
      })
      .where(eq(pizzaTreasury.id, data.treasuryItemId))
      .returning()

    // Update pizzeria treasury count
    if (item.itemType === 'slice') {
      await db
        .update(pizzerias)
        .set({
          treasurySlicesAvailable: sql`GREATEST(0, treasury_slices_available - 1)`,
        })
        .where(eq(pizzerias.id, item.pizzeriaId))
    } else if (item.itemType === 'pie') {
      await db
        .update(pizzerias)
        .set({
          treasuryPiesAvailable: sql`GREATEST(0, treasury_pies_available - 1)`,
        })
        .where(eq(pizzerias.id, item.pizzeriaId))
    }

    // Get pizzeria details
    const [pizzeria] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, item.pizzeriaId))
      .limit(1)

    return NextResponse.json({
      success: true,
      claim: {
        ...claimedItem,
        pizzeria: pizzeria,
      },
      message: `Successfully claimed 1 ${item.itemType}! Your claim code is ${claimCode}`,
    })
  } catch (error: any) {
    console.error('Error claiming treasury item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to claim treasury item' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pizza-bank/treasury/claim - Get user's claimed items
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

    const claims = await db
      .select({
        claim: pizzaTreasury,
        pizzeria: {
          id: pizzerias.id,
          name: pizzerias.name,
          address: pizzerias.address,
          city: pizzerias.city,
          state: pizzerias.state,
          phone: pizzerias.phone,
          imageUrl: pizzerias.imageUrl,
        },
      })
      .from(pizzaTreasury)
      .leftJoin(pizzerias, eq(pizzaTreasury.pizzeriaId, pizzerias.id))
      .where(
        and(
          eq(pizzaTreasury.claimedByUserId, user.id),
          eq(pizzaTreasury.claimed, true)
        )
      )
      .orderBy(sql`${pizzaTreasury.claimedAt} DESC`)

    return NextResponse.json({
      success: true,
      claims,
    })
  } catch (error: any) {
    console.error('Error fetching claimed items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claimed items' },
      { status: 500 }
    )
  }
}
