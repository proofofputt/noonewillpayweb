'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Order {
  id: string
  pizzeriaId: string
  orderType: string
  status: string
  paymentStatus: string
  paymentMethod: string
  finalAmount: string
  fulfillmentCode: string
  contributesToTreasury: boolean
  createdAt: string
  pickupTime?: string | null
}

interface OrderWithPizzeria {
  order: Order
  pizzeria: {
    id: string
    name: string
    address: string
    city: string
    phone: string
  } | null
}

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithPizzeria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const url = filterStatus === 'all'
        ? '/api/pizza-bank/orders'
        : `/api/pizza-bank/orders?status=${filterStatus}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        setError(data.error || 'Failed to load orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading your orders...</div>
        </div>
      </div>
    )
  }

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
            href="/pizza-bank"
            className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
          >
            ← Back to Pizza Bank
          </Link>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-400">Track your pizza orders</p>
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              ⏳ Pending
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterStatus === 'preparing'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              👨‍🍳 Preparing
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterStatus === 'ready'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              ✅ Ready
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterStatus === 'completed'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🎉 Completed
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500"
          >
            {error}
          </motion.div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">
              {filterStatus === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filterStatus} orders found.`}
            </p>
            <Link
              href="/pizza-bank"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
            >
              Browse Pizzerias
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((item, index) => (
              <motion.div
                key={item.order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/pizza-bank/orders/${item.order.id}`}>
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 hover:border-orange transition-all cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">
                            {statusIcons[item.order.status]}
                          </span>
                          <div>
                            <h3 className="text-xl font-bold">
                              {item.pizzeria?.name || 'Unknown Pizzeria'}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {item.pizzeria?.city || 'Unknown Location'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Order ID:</span>{' '}
                            <span className="font-mono text-bitcoin">
                              {item.order.id.substring(0, 8)}...
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Placed:</span>{' '}
                            <span>
                              {new Date(item.order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Payment:</span>{' '}
                            <span>
                              {item.order.paymentMethod === 'bitcoin' && '₿ Bitcoin'}
                              {item.order.paymentMethod === 'lightning' && '⚡ Lightning'}
                              {item.order.paymentMethod === 'fiat' && '💳 Card'}
                            </span>
                          </div>
                        </div>

                        {item.order.contributesToTreasury && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-xs font-bold">
                            🎁 Treasury Contributor
                          </div>
                        )}
                      </div>

                      {/* Status & Amount */}
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                        <div className="text-center">
                          <div
                            className={`text-lg font-bold ${
                              statusColors[item.order.status]
                            }`}
                          >
                            {getStatusText(item.order.status)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.order.paymentStatus === 'confirmed'
                              ? 'Paid'
                              : 'Payment Pending'}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-bitcoin">
                            ${parseFloat(item.order.finalAmount).toFixed(2)}
                          </div>
                          {item.order.status === 'ready' && (
                            <div className="text-xs text-green-500 font-bold mt-1">
                              Ready for pickup!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fulfillment Code (for ready/completed orders) */}
                    {(item.order.status === 'ready' || item.order.status === 'preparing') && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Fulfillment Code:</span>
                          <span className="text-2xl font-bold font-mono text-bitcoin">
                            {item.order.fulfillmentCode}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pickup Time */}
                    {item.order.pickupTime && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Pickup Time:</span>
                          <span className="text-white">
                            {new Date(item.order.pickupTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
