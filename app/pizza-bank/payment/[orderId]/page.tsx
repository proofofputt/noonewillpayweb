'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import QRCode from 'qrcode'

interface PaymentData {
  invoiceId: string
  paymentMethod: string
  status: string
  expiresAt?: string
  // Bitcoin fields
  address?: string
  amountBTC?: string
  qrCode?: string
  confirmationsRequired?: number
  // Lightning fields
  invoice?: string
  amountSats?: number
  // Fiat fields
  clientSecret?: string
  publishableKey?: string
  amount?: number
  currency?: string
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [orderAmount, setOrderAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<string>('pending')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    createPayment()
    // Poll for payment status every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000)
    return () => clearInterval(interval)
  }, [params.orderId])

  useEffect(() => {
    if (payment && payment.paymentMethod === 'bitcoin' && payment.qrCode) {
      generateQRCode(payment.qrCode)
    } else if (payment && payment.paymentMethod === 'lightning' && payment.invoice) {
      generateQRCode(payment.invoice)
    }
  }, [payment])

  const createPayment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pizza-bank/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: params.orderId })
      })

      const data = await response.json()

      if (data.success) {
        setPayment(data.payment)
        setOrderAmount(data.payment.amount || data.payment.amountUSD || 0)
      } else {
        setError(data.error || 'Failed to create payment')
      }
    } catch (err) {
      console.error('Error creating payment:', err)
      setError('Failed to create payment')
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/pizza-bank/payment/status?orderId=${params.orderId}`)
      const data = await response.json()

      if (data.success) {
        setPaymentStatus(data.payment.paymentStatus)

        if (data.payment.paymentStatus === 'confirmed') {
          // Payment confirmed - redirect to order details
          setTimeout(() => {
            router.push(`/pizza-bank/orders/${params.orderId}`)
          }, 2000)
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err)
    }
  }

  const generateQRCode = async (text: string) => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#F7931A', // Bitcoin orange
          light: '#000000'
        }
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💳</div>
          <div className="text-xl">Creating payment...</div>
        </div>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Payment Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Could not create payment'}</p>
          <Link
            href={`/pizza-bank/orders/${params.orderId}`}
            className="px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all inline-block"
          >
            View Order
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href={`/pizza-bank/orders/${params.orderId}`}
            className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
          >
            ← Back to Order
          </Link>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
            Complete Payment
          </h1>
          <p className="text-gray-400">Order total: ${orderAmount.toFixed(2)}</p>
        </motion.div>

        {/* Payment Status */}
        {paymentStatus === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-green-500/20 border-2 border-green-500 rounded-lg text-center"
          >
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Confirmed!</h2>
            <p className="text-green-300">Redirecting to order details...</p>
          </motion.div>
        )}

        {/* Bitcoin Payment */}
        {payment.paymentMethod === 'bitcoin' && paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border-2 border-bitcoin"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">₿</div>
              <h2 className="text-2xl font-bold mb-2">Bitcoin Payment</h2>
              <p className="text-gray-400">Send Bitcoin to the address below</p>
            </div>

            {qrCodeUrl && (
              <div className="bg-black p-4 rounded-lg mb-6 flex justify-center">
                <img src={qrCodeUrl} alt="Bitcoin QR Code" className="w-72 h-72" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bitcoin Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={payment.address}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(payment.address!)}
                    className="px-6 py-3 bg-bitcoin text-black rounded-lg font-bold hover:bg-orange transition-all"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (BTC)</label>
                <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xl font-bold text-bitcoin">
                  {payment.amountBTC} BTC
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="text-sm">
                    <p className="font-bold text-yellow-400 mb-1">Important:</p>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Send exactly {payment.amountBTC} BTC to the address above</li>
                      <li>• Payment requires {payment.confirmationsRequired} confirmation(s)</li>
                      <li>• This page will auto-update when payment is detected</li>
                      <li>• Invoice expires at {new Date(payment.expiresAt!).toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lightning Payment */}
        {payment.paymentMethod === 'lightning' && paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border-2 border-bitcoin"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚡</div>
              <h2 className="text-2xl font-bold mb-2">Lightning Payment</h2>
              <p className="text-gray-400">Scan with your Lightning wallet</p>
            </div>

            {qrCodeUrl && (
              <div className="bg-black p-4 rounded-lg mb-6 flex justify-center">
                <img src={qrCodeUrl} alt="Lightning Invoice QR Code" className="w-72 h-72" />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Lightning Invoice</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={payment.invoice}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xs"
                  />
                  <button
                    onClick={() => copyToClipboard(payment.invoice!)}
                    className="px-6 py-3 bg-bitcoin text-black rounded-lg font-bold hover:bg-orange transition-all"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <div className="font-mono text-xl font-bold text-bitcoin">
                    {payment.amountSats?.toLocaleString()} sats
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    ≈ ${orderAmount.toFixed(2)} USD
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-sm">
                    <p className="font-bold text-blue-400 mb-1">Lightning is fast!</p>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Payment confirms instantly (within seconds)</li>
                      <li>• Scan QR code with any Lightning wallet</li>
                      <li>• This page will auto-update when payment is received</li>
                      <li>• Invoice expires at {new Date(payment.expiresAt!).toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fiat Payment */}
        {payment.paymentMethod === 'fiat' && paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border-2 border-bitcoin"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">💳</div>
              <h2 className="text-2xl font-bold mb-2">Card Payment</h2>
              <p className="text-gray-400">Enter your payment details below</p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 mb-4">Stripe payment integration placeholder</p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">In production, Stripe Elements would appear here</p>
                <p className="font-mono">Client Secret: {payment.clientSecret}</p>
              </div>

              <div className="mt-6">
                <div className="text-2xl font-bold text-bitcoin mb-2">
                  ${orderAmount.toFixed(2)}
                </div>
                <p className="text-sm text-gray-400">Amount to charge</p>
              </div>

              {/* Mock payment button */}
              <button
                onClick={() => alert('In production, this would process payment via Stripe')}
                className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
              >
                Pay ${orderAmount.toFixed(2)}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div className="text-sm">
                  <p className="font-bold text-gray-300 mb-1">Secure Payment</p>
                  <p className="text-gray-400">
                    Payments are processed securely through Stripe. Your card information
                    is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Waiting for payment...</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
