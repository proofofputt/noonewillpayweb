import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaOrders, pizzerias, pizzeriaAffiliates } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, desc, sql } from 'drizzle-orm'

// Helper to generate 6-digit fulfillment code
function generateFulfillmentCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// GET /api/pizza-bank/orders - List user's orders
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
    const status = searchParams.get('status')

    let query = db
      .select({
        order: pizzaOrders,
        pizzeria: {
          id: pizzerias.id,
          name: pizzerias.name,
          address: pizzerias.address,
          city: pizzerias.city,
          phone: pizzerias.phone,
        },
      })
      .from(pizzaOrders)
      .leftJoin(pizzerias, eq(pizzaOrders.pizzeriaId, pizzerias.id))
      .where(eq(pizzaOrders.userId, user.id))
      .$dynamic()

    if (status) {
      query = query.where(eq(pizzaOrders.status, status))
    }

    const orders = await query.orderBy(desc(pizzaOrders.createdAt))

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/pizza-bank/orders - Create new order
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

    // Validate required fields
    if (!data.pizzeriaId || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria and items are required' },
        { status: 400 }
      )
    }

    if (!data.paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Get pizzeria and validate
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

    if (!pizzeria.active || !pizzeria.verified) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria is not accepting orders' },
        { status: 400 }
      )
    }

    // Validate payment method is supported
    if (data.paymentMethod === 'bitcoin' && !pizzeria.acceptsBitcoin) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria does not accept Bitcoin' },
        { status: 400 }
      )
    }
    if (data.paymentMethod === 'lightning' && !pizzeria.acceptsLightning) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria does not accept Lightning' },
        { status: 400 }
      )
    }

    // Calculate totals
    const totalAmount = data.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    const discount = data.discount || 0
    const finalAmount = totalAmount - discount

    // Check if this will be the 5th order (contributes to treasury)
    const currentTotal = pizzeria.totalOrders
    const contributesToTreasury = (currentTotal + 1) % 5 === 0
    const treasurySlicesGenerated = contributesToTreasury ? 1 : 0

    // Generate unique fulfillment code
    let fulfillmentCode = generateFulfillmentCode()
    let codeExists = true

    // Ensure uniqueness
    while (codeExists) {
      const [existing] = await db
        .select()
        .from(pizzaOrders)
        .where(eq(pizzaOrders.fulfillmentCode, fulfillmentCode))
        .limit(1)

      if (!existing) {
        codeExists = false
      } else {
        fulfillmentCode = generateFulfillmentCode()
      }
    }

    // Create order
    const [newOrder] = await db
      .insert(pizzaOrders)
      .values({
        pizzeriaId: data.pizzeriaId,
        userId: user.id,
        groupBuyId: data.groupBuyId || null,
        orderType: data.groupBuyId ? 'group' : 'individual',
        items: JSON.stringify(data.items),
        totalAmount: totalAmount.toFixed(2),
        discount: discount.toFixed(2),
        finalAmount: finalAmount.toFixed(2),
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        status: 'pending',
        pickupTime: data.pickupTime || null,
        deliveryAddress: data.deliveryAddress || null,
        fulfillmentCode: fulfillmentCode,
        contributesToTreasury,
        treasurySlicesGenerated,
        notes: data.notes || null,
      })
      .returning()

    // Update pizzeria total orders
    await db
      .update(pizzerias)
      .set({
        totalOrders: sql`total_orders + 1`,
        updatedAt: new Date(),
      })
      .where(eq(pizzerias.id, data.pizzeriaId))

    // TODO: Generate payment invoice/address based on payment method
    // This would integrate with BTCPay Server, Lightning provider, or Stripe

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: contributesToTreasury ?
        'Order created! This order will contribute 1 free slice to the treasury.' :
        'Order created successfully',
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
