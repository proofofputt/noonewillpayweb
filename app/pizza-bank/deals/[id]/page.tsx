'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Deal {
  id: string
  pizzeriaId: string
  creatorId: string
  title: string
  description: string
  targetAmount: string
  currentAmount: string
  participantCount: number
  maxParticipants?: number
  discountPercent: string
  deadline: string
  status: string
  createdAt: string
  pizzeria?: {
    id: string
    name: string
    city: string
    state: string
    imageUrl?: string
    address: string
    phone?: string
  }
}

export default function DealDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const dealId = params.id as string

  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDealDetails()
  }, [dealId])

  async function fetchDealDetails() {
    try {
      const response = await fetch(`/api/pizza-bank/deals/${dealId}`)
      if (!response.ok) {
        throw new Error('Failed to load deal')
      }
      const data = await response.json()
      setDeal(data.deal)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function getTimeRemaining(deadlineStr: string) {
    const deadline = new Date(deadlineStr)
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()

    if (diff <= 0) return { expired: true, text: 'Expired' }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return { expired: false, text: `${days} day${days > 1 ? 's' : ''} remaining` }
    if (hours > 0) return { expired: false, text: `${hours} hour${hours > 1 ? 's' : ''} remaining` }
    return { expired: false, text: `${minutes} minute${minutes > 1 ? 's' : ''} remaining` }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading deal...</div>
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Deal Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This deal does not exist.'}</p>
          <Link
            href="/pizza-bank/deals"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
          >
            Browse Deals
          </Link>
        </div>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining(deal.deadline)
  const isExpired = timeRemaining.expired || deal.status === 'cancelled'

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/pizza-bank/deals"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Deals
          </Link>
        </div>

        {/* Deal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-64 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
            {deal.pizzeria?.imageUrl ? (
              <img
                src={deal.pizzeria.imageUrl}
                alt={deal.pizzeria.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-8xl">🍕</div>
            )}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
              {parseFloat(deal.discountPercent)}% OFF
            </div>
            {isExpired && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-400">
                  {deal.status === 'cancelled' ? 'CANCELLED' : 'EXPIRED'}
                </div>
              </div>
            )}
          </div>

          {/* Deal Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{deal.title}</h1>
              {deal.pizzeria && (
                <Link
                  href={`/pizza-bank/pizzerias/${deal.pizzeriaId}`}
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span>🍕</span>
                  <span className="text-lg">
                    {deal.pizzeria.name} - {deal.pizzeria.city}, {deal.pizzeria.state}
                  </span>
                </Link>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                Deal Details
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {deal.description}
              </p>
            </div>

            {/* Deal Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Discount</div>
                <div className="text-2xl font-bold text-orange-400">
                  {parseFloat(deal.discountPercent)}%
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Valid Until</div>
                <div className="text-lg font-semibold">{formatDate(deal.deadline)}</div>
              </div>

              <div className={`rounded-lg p-4 ${
                isExpired
                  ? 'bg-red-900/30 border border-red-600'
                  : 'bg-green-900/30 border border-green-600'
              }`}>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className={`text-lg font-semibold ${
                  isExpired ? 'text-red-400' : 'text-green-400'
                }`}>
                  {timeRemaining.text}
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            {deal.maxParticipants && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  Deal Usage
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>Redeemed</span>
                    <span className="font-semibold">
                      {deal.participantCount} / {deal.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (deal.participantCount / deal.maxParticipants) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {deal.pizzeria && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  📍 Location
                </h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-lg">{deal.pizzeria.address}</p>
                  {deal.pizzeria.phone && (
                    <a
                      href={`tel:${deal.pizzeria.phone}`}
                      className="text-orange-400 hover:text-orange-300 transition-colors mt-2 inline-block"
                    >
                      📞 {deal.pizzeria.phone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isExpired && (
                <Link
                  href={`/pizza-bank/order?pizzeria=${deal.pizzeriaId}`}
                  className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg text-center transition-colors"
                >
                  Order Now & Save {parseFloat(deal.discountPercent)}%
                </Link>
              )}

              {deal.pizzeria && (
                <Link
                  href={`/pizza-bank/pizzerias/${deal.pizzeriaId}`}
                  className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-center"
                >
                  View Pizzeria
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* How to Redeem */}
        {!isExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-blue-900/20 border border-blue-600 rounded-lg p-6"
          >
            <h3 className="text-lg font-bold mb-4">How to Redeem This Deal</h3>
            <ol className="space-y-2 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </span>
                <span>Click "Order Now" to place your pizza order</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </span>
                <span>The {parseFloat(deal.discountPercent)}% discount will be automatically applied</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </span>
                <span>Complete payment and pick up your discounted pizza!</span>
              </li>
            </ol>
          </motion.div>
        )}
      </div>
    </div>
  )
}
