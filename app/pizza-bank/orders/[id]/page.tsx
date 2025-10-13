'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import QRCode from 'qrcode'

interface OrderItem {
  id: string
  name: string
  size?: string
  price: number
  quantity: number
}

interface Order {
  id: string
  pizzeriaId: string
  userId: string
  orderType: string
  items: string
  totalAmount: string
  discount: string
  finalAmount: string
  paymentMethod: string
  paymentStatus: string
  status: string
  pickupTime?: string | null
  deliveryAddress?: string | null
  fulfillmentCode: string
  contributesToTreasury: boolean
  treasurySlicesGenerated: number
  notes?: string | null
  createdAt: string
  updatedAt: string
  paidAt?: string | null
  fulfilledAt?: string | null
}

interface Pizzeria {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email?: string
}

const statusSteps = ['pending', 'preparing', 'ready', 'completed']

const statusColors: Record<string, string> = {
  pending: 'text-yellow-500',
  preparing: 'text-blue-500',
  ready: 'text-green-500',
  completed: 'text-gray-500',
  cancelled: 'text-red-500'
}

const statusIcons: Record<string, string> = {
  pending: '⏳',
  preparing: '👨‍🍳',
  ready: '✅',
  completed: '🎉',
  cancelled: '❌'
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [pizzeria, setPizzeria] = useState<Pizzeria | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  useEffect(() => {
    if (order) {
      generateQRCode(order.fulfillmentCode)
    }
  }, [order])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pizza-bank/orders/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
        setPizzeria(data.pizzeria)

        // Parse items JSON
        try {
          const parsedItems = JSON.parse(data.order.items)
          setItems(parsedItems)
        } catch (err) {
          console.error('Error parsing items:', err)
          setItems([])
        }
      } else {
        setError(data.error || 'Failed to load order')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (code: string) => {
    try {
      const url = await QRCode.toDataURL(code, {
        width: 256,
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

  const getCurrentStatusIndex = () => {
    if (!order) return -1
    if (order.status === 'cancelled') return -1
    return statusSteps.indexOf(order.status)
  }

  const getStatusText = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading order...</div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This order does not exist'}</p>
          <Link
            href="/pizza-bank/orders"
            className="px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all inline-block"
          >
            View All Orders
          </Link>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getCurrentStatusIndex()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/pizza-bank/orders"
            className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
          >
            ← Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
                Order Details
              </h1>
              <p className="text-gray-400 font-mono">#{order.id.substring(0, 16)}...</p>
            </div>

            <div className="text-center md:text-right">
              <div className={`text-3xl font-bold ${statusColors[order.status]} mb-1`}>
                {statusIcons[order.status]} {getStatusText(order.status)}
              </div>
              <div className="text-sm text-gray-400">
                {order.paymentStatus === 'confirmed' ? '✓ Paid' : 'Payment Pending'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Progress */}
        {order.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border-2 border-gray-700 mb-8"
          >
            <h2 className="text-xl font-bold mb-6">Order Progress</h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-orange to-bitcoin transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`
                  }}
                />
              </div>

              {/* Status Steps */}
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={step} className="flex flex-col items-center" style={{ width: '25%' }}>
                      <div
                        className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all mb-3 ${
                          isActive
                            ? 'border-bitcoin bg-bitcoin text-black'
                            : 'border-gray-700 bg-gray-900 text-gray-600'
                        } ${isCurrent ? 'scale-110 shadow-lg shadow-bitcoin/50' : ''}`}
                      >
                        {statusIcons[step]}
                      </div>
                      <div
                        className={`text-sm font-bold text-center ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {getStatusText(step)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {order.status === 'ready' && (
              <div className="mt-6 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  🎉 Your order is ready for pickup!
                </div>
                <p className="text-green-300">Show the fulfillment code below to collect your order</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Cancelled Status */}
        {order.status === 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/10 border-2 border-red-500 p-6 rounded-lg mb-8"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">❌</div>
              <h2 className="text-2xl font-bold text-red-500 mb-2">Order Cancelled</h2>
              <p className="text-gray-400">This order has been cancelled</p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4">Order Items</h2>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b border-gray-700 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-400">{item.size}</p>
                      )}
                      <p className="text-sm text-gray-400">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-bitcoin">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t-2 border-orange space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount:</span>
                    <span>-${parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-bitcoin">${parseFloat(order.finalAmount).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Pizzeria Info */}
            {pizzeria && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700"
              >
                <h2 className="text-xl font-bold mb-4">Pizzeria Details</h2>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Name</div>
                    <div className="text-lg font-bold">{pizzeria.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Address</div>
                    <div>
                      {pizzeria.address}<br />
                      {pizzeria.city}, {pizzeria.state} {pizzeria.zipCode}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <a
                      href={`tel:${pizzeria.phone}`}
                      className="text-bitcoin hover:text-orange transition-colors"
                    >
                      {pizzeria.phone}
                    </a>
                  </div>

                  {pizzeria.email && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Email</div>
                      <a
                        href={`mailto:${pizzeria.email}`}
                        className="text-bitcoin hover:text-orange transition-colors"
                      >
                        {pizzeria.email}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4">Order Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Order Type</div>
                  <div className="font-bold capitalize">{order.orderType}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Payment Method</div>
                  <div className="font-bold">
                    {order.paymentMethod === 'bitcoin' && '₿ Bitcoin (On-Chain)'}
                    {order.paymentMethod === 'lightning' && '⚡ Lightning Network'}
                    {order.paymentMethod === 'fiat' && '💳 Credit/Debit Card'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Order Placed</div>
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </div>

                {order.paidAt && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Payment Confirmed</div>
                    <div>{new Date(order.paidAt).toLocaleString()}</div>
                  </div>
                )}

                {order.pickupTime && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Pickup Time</div>
                    <div>{new Date(order.pickupTime).toLocaleString()}</div>
                  </div>
                )}

                {order.fulfilledAt && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Fulfilled At</div>
                    <div>{new Date(order.fulfilledAt).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Special Instructions</div>
                  <div className="text-gray-300">{order.notes}</div>
                </div>
              )}

              {order.contributesToTreasury && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <span className="text-2xl">🎁</span>
                    <span>
                      This order contributed {order.treasurySlicesGenerated}{' '}
                      {order.treasurySlicesGenerated === 1 ? 'slice' : 'slices'} to the pizzeria treasury!
                    </span>
                  </div>
                  <p className="text-sm text-green-300 mt-2">
                    Thank you for helping others enjoy free pizza
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Fulfillment Code */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange/10 to-bitcoin/10 p-6 rounded-lg border-2 border-bitcoin sticky top-4"
            >
              <h2 className="text-xl font-bold mb-4 text-center">Fulfillment Code</h2>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold font-mono text-bitcoin mb-2">
                  {order.fulfillmentCode}
                </div>
                <p className="text-sm text-gray-400">
                  Show this code when picking up your order
                </p>
              </div>

              {qrCodeUrl && (
                <div className="bg-black p-4 rounded-lg mb-6 flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="Fulfillment QR Code"
                    className="w-64 h-64"
                  />
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-bitcoin">•</span>
                  <span>Present this code at the counter</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-bitcoin">•</span>
                  <span>Staff will verify and prepare your order</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-bitcoin">•</span>
                  <span>Code is valid until order is fulfilled</span>
                </div>
              </div>

              {order.status === 'ready' && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="text-green-400 font-bold">Ready for pickup!</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
