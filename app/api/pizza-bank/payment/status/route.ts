import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaOrders } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/payment/status?orderId=XXX
 * Check payment status for an order
 * Used by frontend to poll for payment confirmation
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
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get the order
    const [order] = await db
      .select()
      .from(pizzaOrders)
      .where(eq(pizzaOrders.id, orderId))
      .limit(1)

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      payment: {
        orderId: order.id,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentInvoiceId: order.paymentInvoiceId,
        paymentTxId: order.paymentTxId,
        paidAt: order.paidAt,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
