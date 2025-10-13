import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaOrders, pizzerias } from '@/lib/db'
import { eq } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/payment/webhook
 * Receives payment confirmation webhooks from payment providers
 *
 * Supports:
 * - BTCPay Server webhooks
 * - Lightning (LNbits/Alby/Strike) webhooks
 * - Stripe webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    // Determine payment provider by headers or payload
    const btcpaySignature = request.headers.get('btcpay-sig')
    const stripeSignature = request.headers.get('stripe-signature')

    const rawBody = await request.text()
    const data = JSON.parse(rawBody)

    // Route to appropriate handler
    if (btcpaySignature) {
      return await handleBTCPayWebhook(data, btcpaySignature)
    } else if (stripeSignature) {
      return await handleStripeWebhook(rawBody, stripeSignature)
    } else if (data.type === 'lightning_payment' || data.payment_request) {
      return await handleLightningWebhook(data)
    } else {
      return NextResponse.json(
        { success: false, error: 'Unknown webhook type' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error processing payment webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

/**
 * Handle BTCPay Server webhook
 */
async function handleBTCPayWebhook(data: any, signature: string) {
  // TODO: Verify BTCPay webhook signature
  // const isValid = verifyBTCPaySignature(data, signature, process.env.BTCPAY_WEBHOOK_SECRET)
  // if (!isValid) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  // }

  const { orderId, invoiceId, status, type } = data

  // BTCPay webhook types: InvoiceCreated, InvoiceReceivedPayment, InvoicePaymentSettled, InvoiceExpired, etc.
  if (type === 'InvoicePaymentSettled' || status === 'settled') {
    await updateOrderPaymentStatus(orderId, 'confirmed', invoiceId)

    // Send notification to pizzeria
    await notifyPizzeriaNewOrder(orderId)
  } else if (type === 'InvoiceExpired' || status === 'expired') {
    await updateOrderPaymentStatus(orderId, 'failed', invoiceId)
  }

  return NextResponse.json({ success: true })
}

/**
 * Handle Lightning webhook (LNbits, Alby, Strike)
 */
async function handleLightningWebhook(data: any) {
  // TODO: Verify webhook signature based on provider

  const { payment_hash, orderId, status, paid } = data

  if (paid || status === 'paid' || status === 'settled') {
    await updateOrderPaymentStatus(orderId, 'confirmed', payment_hash)

    // Send notification to pizzeria
    await notifyPizzeriaNewOrder(orderId)
  }

  return NextResponse.json({ success: true })
}

/**
 * Handle Stripe webhook
 */
async function handleStripeWebhook(rawBody: string, signature: string) {
  // TODO: Verify Stripe webhook signature
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  // let event
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     rawBody,
  //     signature,
  //     process.env.STRIPE_WEBHOOK_SECRET
  //   )
  // } catch (err) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  // }

  const data = JSON.parse(rawBody)
  const { type, data: eventData } = data

  // Handle payment_intent.succeeded event
  if (type === 'payment_intent.succeeded') {
    const { id: paymentIntentId, metadata } = eventData.object
    const orderId = metadata.orderId

    if (orderId) {
      await updateOrderPaymentStatus(orderId, 'confirmed', paymentIntentId)

      // Send notification to pizzeria
      await notifyPizzeriaNewOrder(orderId)
    }
  }

  return NextResponse.json({ success: true })
}

/**
 * Update order payment status in database
 */
async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  transactionId: string
) {
  try {
    const updates: any = {
      paymentStatus,
      paymentTxId: transactionId,
      updatedAt: new Date(),
    }

    if (paymentStatus === 'confirmed') {
      updates.paidAt = new Date()
      updates.status = 'preparing' // Auto-advance to preparing when paid
    }

    await db
      .update(pizzaOrders)
      .set(updates)
      .where(eq(pizzaOrders.id, orderId))

    console.log(`✓ Order ${orderId} payment status updated to ${paymentStatus}`)
  } catch (error) {
    console.error('Error updating order payment status:', error)
    throw error
  }
}

/**
 * Notify pizzeria of new paid order via webhook
 */
async function notifyPizzeriaNewOrder(orderId: string) {
  try {
    // Get order and pizzeria details
    const [order] = await db
      .select()
      .from(pizzaOrders)
      .where(eq(pizzaOrders.id, orderId))
      .limit(1)

    if (!order) return

    const [pizzeria] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, order.pizzeriaId))
      .limit(1)

    if (!pizzeria || !pizzeria.webhookUrl) return

    // Parse order items
    let items = []
    try {
      items = JSON.parse(order.items)
    } catch (e) {
      items = []
    }

    // Send webhook to pizzeria
    const webhookPayload = {
      event: 'order.payment_confirmed',
      timestamp: new Date().toISOString(),
      order: {
        id: order.id,
        pizzeria_id: order.pizzeriaId,
        items: items,
        total_amount: parseFloat(order.finalAmount),
        payment_method: order.paymentMethod,
        fulfillment_code: order.fulfillmentCode,
        pickup_time: order.pickupTime,
        notes: order.notes,
        created_at: order.createdAt,
        paid_at: order.paidAt,
      },
    }

    await fetch(pizzeria.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pizza-Bank-Signature': generateWebhookSignature(webhookPayload),
      },
      body: JSON.stringify(webhookPayload),
    })

    console.log(`✓ Pizzeria ${pizzeria.name} notified of order ${orderId}`)
  } catch (error) {
    console.error('Error notifying pizzeria:', error)
    // Don't throw - webhook delivery failures shouldn't block payment processing
  }
}

/**
 * Generate HMAC signature for pizzeria webhook
 */
function generateWebhookSignature(payload: any): string {
  // TODO: Implement HMAC-SHA256 signature
  // const crypto = require('crypto')
  // const secret = process.env.PIZZERIA_WEBHOOK_SECRET
  // const hmac = crypto.createHmac('sha256', secret)
  // hmac.update(JSON.stringify(payload))
  // return hmac.digest('hex')

  return 'mock_signature'
}

/**
 * GET handler - returns webhook setup instructions
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Payment webhook endpoint',
    supported_providers: ['BTCPay Server', 'Lightning (LNbits/Alby/Strike)', 'Stripe'],
    webhook_url: `${process.env.NEXT_PUBLIC_URL || 'https://noonewillpay.com'}/api/pizza-bank/payment/webhook`,
    documentation: 'https://noonewillpay.com/pizza-bank/api-docs',
  })
}
