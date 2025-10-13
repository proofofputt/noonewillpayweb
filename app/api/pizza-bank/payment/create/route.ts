import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaOrders } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/payment/create
 * Creates a payment invoice/request for an order based on payment method
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

    if (!data.orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get the order
    const [order] = await db
      .select()
      .from(pizzaOrders)
      .where(eq(pizzaOrders.id, data.orderId))
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

    // Check if already paid
    if (order.paymentStatus === 'confirmed') {
      return NextResponse.json(
        { success: false, error: 'Order already paid' },
        { status: 400 }
      )
    }

    const amount = parseFloat(order.finalAmount)
    let paymentData: any = {}

    // Generate payment based on method
    switch (order.paymentMethod) {
      case 'bitcoin':
        paymentData = await createBitcoinPayment(order.id, amount)
        break

      case 'lightning':
        paymentData = await createLightningPayment(order.id, amount)
        break

      case 'fiat':
        paymentData = await createFiatPayment(order.id, amount)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid payment method' },
          { status: 400 }
        )
    }

    // Update order with payment info
    await db
      .update(pizzaOrders)
      .set({
        paymentInvoiceId: paymentData.invoiceId,
        updatedAt: new Date(),
      })
      .where(eq(pizzaOrders.id, order.id))

    return NextResponse.json({
      success: true,
      payment: paymentData,
    })
  } catch (error: any) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

/**
 * Create Bitcoin (on-chain) payment
 * TODO: Integrate with BTCPay Server or similar
 */
async function createBitcoinPayment(orderId: string, amount: number) {
  // In production, this would integrate with BTCPay Server
  // For now, return a mock payment address

  // Example BTCPay Server integration:
  // const btcpayClient = new BTCPayClient(process.env.BTCPAY_URL, process.env.BTCPAY_API_KEY)
  // const invoice = await btcpayClient.createInvoice({
  //   amount: amount,
  //   currency: 'USD',
  //   orderId: orderId,
  //   redirectURL: `${process.env.NEXT_PUBLIC_URL}/pizza-bank/orders/${orderId}`,
  //   notificationURL: `${process.env.NEXT_PUBLIC_URL}/api/pizza-bank/payment/webhook`,
  // })

  return {
    invoiceId: `btc_${orderId.substring(0, 8)}`,
    paymentMethod: 'bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Mock address
    amount: amount,
    amountBTC: (amount / 50000).toFixed(8), // Mock BTC conversion at $50k
    qrCode: `bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=${(amount / 50000).toFixed(8)}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    confirmationsRequired: 1,
    status: 'pending',
  }
}

/**
 * Create Lightning Network payment
 * TODO: Integrate with LNbits, Alby, or Strike
 */
async function createLightningPayment(orderId: string, amount: number) {
  // In production, this would integrate with a Lightning provider
  // For now, return a mock Lightning invoice

  // Example LNbits integration:
  // const lnbitsClient = new LNbitsClient(process.env.LNBITS_URL, process.env.LNBITS_API_KEY)
  // const invoice = await lnbitsClient.createInvoice({
  //   amount: Math.round(amount * 100000000 / btcPrice), // Convert USD to sats
  //   memo: `Pizza Bank Order ${orderId}`,
  //   webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/pizza-bank/payment/webhook`,
  // })

  const amountSats = Math.round((amount / 50000) * 100000000) // Mock conversion to satoshis

  return {
    invoiceId: `ln_${orderId.substring(0, 8)}`,
    paymentMethod: 'lightning',
    invoice: 'lnbc1234567890...', // Mock Lightning invoice (BOLT11)
    amountSats: amountSats,
    amountUSD: amount,
    qrCode: 'lightning:lnbc1234567890...',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    status: 'pending',
  }
}

/**
 * Create Fiat (Stripe) payment
 * TODO: Integrate with Stripe Payment Intents
 */
async function createFiatPayment(orderId: string, amount: number) {
  // In production, this would integrate with Stripe
  // For now, return mock payment intent

  // Example Stripe integration:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(amount * 100), // Convert to cents
  //   currency: 'usd',
  //   metadata: {
  //     orderId: orderId,
  //   },
  //   automatic_payment_methods: {
  //     enabled: true,
  //   },
  // })

  return {
    invoiceId: `stripe_${orderId.substring(0, 8)}`,
    paymentMethod: 'fiat',
    clientSecret: 'pi_mock_secret_123', // Mock Stripe client secret
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
    amount: amount,
    currency: 'usd',
    status: 'pending',
  }
}
