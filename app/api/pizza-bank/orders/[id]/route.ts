import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaOrders, pizzerias, pizzaTreasury } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, sql } from 'drizzle-orm'

// GET /api/pizza-bank/orders/:id - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [orderData] = await db
      .select({
        order: pizzaOrders,
        pizzeria: pizzerias,
      })
      .from(pizzaOrders)
      .leftJoin(pizzerias, eq(pizzaOrders.pizzeriaId, pizzerias.id))
      .where(eq(pizzaOrders.id, params.id))
      .limit(1)

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authorization (order owner or pizzeria owner)
    if (
      orderData.order.userId !== user.id &&
      orderData.pizzeria?.ownerId !== user.id &&
      !user.isAdmin
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      order: orderData.order,
      pizzeria: orderData.pizzeria,
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PATCH /api/pizza-bank/orders/:id - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [order] = await db
      .select()
      .from(pizzaOrders)
      .where(eq(pizzaOrders.id, params.id))
      .limit(1)

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authorization (pizzeria owner or admin)
    const [pizzeria] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, order.pizzeriaId))
      .limit(1)

    if (!pizzeria || (pizzeria.ownerId !== user.id && !user.isAdmin)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const updates: any = {
      updatedAt: new Date(),
    }

    // Update allowed fields
    if (data.status) {
      updates.status = data.status

      // Set fulfillment timestamp when completed
      if (data.status === 'completed' && !order.fulfilledAt) {
        updates.fulfilledAt = new Date()

        // If order contributes to treasury, create treasury record
        if (order.contributesToTreasury && order.treasurySlicesGenerated > 0) {
          await db.insert(pizzaTreasury).values({
            pizzeriaId: order.pizzeriaId,
            fundedByOrderId: order.id,
            fundedByUserId: order.userId,
            itemType: 'slice',
            quantity: order.treasurySlicesGenerated,
            claimed: false,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          })

          // Update pizzeria treasury count
          await db
            .update(pizzerias)
            .set({
              treasurySlicesAvailable: sql`treasury_slices_available + ${order.treasurySlicesGenerated}`,
            })
            .where(eq(pizzerias.id, order.pizzeriaId))
        }
      }
    }

    if (data.paymentStatus) {
      updates.paymentStatus = data.paymentStatus
      if (data.paymentStatus === 'confirmed' && !order.paidAt) {
        updates.paidAt = new Date()
      }
    }

    if (data.paymentTxId) {
      updates.paymentTxId = data.paymentTxId
    }

    const [updated] = await db
      .update(pizzaOrders)
      .set(updates)
      .where(eq(pizzaOrders.id, params.id))
      .returning()

    return NextResponse.json({
      success: true,
      order: updated,
    })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
