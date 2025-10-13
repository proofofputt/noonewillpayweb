import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaTreasury, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, desc, sql, isNull } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/treasury - List available treasury items
 * Query params:
 * - pizzeriaId: Filter by pizzeria
 * - itemType: Filter by item type (slice, pie)
 * - available: Show only unclaimed items (default true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pizzeriaId = searchParams.get('pizzeriaId')
    const itemType = searchParams.get('itemType')
    const showAvailable = searchParams.get('available') !== 'false'

    let query = db
      .select({
        treasury: pizzaTreasury,
        pizzeria: {
          id: pizzerias.id,
          name: pizzerias.name,
          address: pizzerias.address,
          city: pizzerias.city,
          state: pizzerias.state,
          imageUrl: pizzerias.imageUrl,
        },
      })
      .from(pizzaTreasury)
      .leftJoin(pizzerias, eq(pizzaTreasury.pizzeriaId, pizzerias.id))
      .$dynamic()

    // Build WHERE conditions
    const conditions: any[] = []

    if (showAvailable) {
      conditions.push(eq(pizzaTreasury.claimed, false))
      // Only show items that haven't expired
      conditions.push(
        sql`${pizzaTreasury.expiresAt} IS NULL OR ${pizzaTreasury.expiresAt} > NOW()`
      )
    }

    if (pizzeriaId) {
      conditions.push(eq(pizzaTreasury.pizzeriaId, pizzeriaId))
    }

    if (itemType) {
      conditions.push(eq(pizzaTreasury.itemType, itemType))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const items = await query.orderBy(desc(pizzaTreasury.createdAt))

    // Calculate stats
    const stats = {
      totalAvailable: items.length,
      slicesAvailable: items.filter(
        (i) => i.treasury.itemType === 'slice' && !i.treasury.claimed
      ).length,
      piesAvailable: items.filter(
        (i) => i.treasury.itemType === 'pie' && !i.treasury.claimed
      ).length,
    }

    return NextResponse.json({
      success: true,
      items,
      stats,
    })
  } catch (error: any) {
    console.error('Error fetching treasury items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch treasury items' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pizza-bank/treasury - Contribute to treasury (admin only)
 * Body: { pizzeriaId, itemType, quantity }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const data = await request.json()

    if (!data.pizzeriaId || !data.itemType) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria ID and item type are required' },
        { status: 400 }
      )
    }

    const quantity = data.quantity || 1

    // Verify pizzeria exists
    const [pizzeria] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, data.pizzeriaId))
      .limit(1)

    if (!pizzeria) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria not found' },
        { status: 404 }
      )
    }

    // Create treasury items
    const items = []
    for (let i = 0; i < quantity; i++) {
      const [newItem] = await db
        .insert(pizzaTreasury)
        .values({
          pizzeriaId: data.pizzeriaId,
          fundedByUserId: user.id,
          itemType: data.itemType,
          quantity: 1,
          claimed: false,
          expiresAt: data.expiresAt
            ? new Date(data.expiresAt)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
          notes: data.notes || 'Admin contribution',
        })
        .returning()

      items.push(newItem)
    }

    // Update pizzeria treasury count
    if (data.itemType === 'slice') {
      await db
        .update(pizzerias)
        .set({
          treasurySlicesAvailable: sql`treasury_slices_available + ${quantity}`,
        })
        .where(eq(pizzerias.id, data.pizzeriaId))
    } else if (data.itemType === 'pie') {
      await db
        .update(pizzerias)
        .set({
          treasuryPiesAvailable: sql`treasury_pies_available + ${quantity}`,
        })
        .where(eq(pizzerias.id, data.pizzeriaId))
    }

    return NextResponse.json({
      success: true,
      items,
      message: `Added ${quantity} ${data.itemType}(s) to treasury`,
    })
  } catch (error: any) {
    console.error('Error contributing to treasury:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to contribute to treasury' },
      { status: 500 }
    )
  }
}
