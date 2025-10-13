'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  }
}

export default function DealsPage() {
  const router = useRouter()

  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'active' | 'expired'>('active')

  useEffect(() => {
    fetchDeals()
  }, [filter])

  async function fetchDeals() {
    try {
      setLoading(true)
      const response = await fetch(`/api/pizza-bank/deals?status=${filter}`)

      if (!response.ok) {
        throw new Error('Failed to load deals')
      }

      const data = await response.json()
      setDeals(data.deals)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  function getTimeRemaining(deadlineStr: string) {
    const deadline = new Date(deadlineStr)
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`
    return 'Less than 1 hour'
  }

  const DealCard = ({ deal }: { deal: Deal }) => {
    const timeRemaining = getTimeRemaining(deal.deadline)
    const isExpired = timeRemaining === 'Expired'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all"
      >
        {/* Deal Image/Badge */}
        <div className="relative h-48 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
          {deal.pizzeria?.imageUrl ? (
            <img
              src={deal.pizzeria.imageUrl}
              alt={deal.pizzeria.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-6xl">🍕</div>
          )}
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-lg">
            {parseFloat(deal.discountPercent)}% OFF
          </div>
          {isExpired && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400">EXPIRED</div>
            </div>
          )}
        </div>

        {/* Deal Info */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2">{deal.title}</h3>

          {deal.pizzeria && (
            <Link
              href={`/pizza-bank/pizzerias/${deal.pizzeriaId}`}
              className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors mb-3"
            >
              <span>🍕</span>
              <span>
                {deal.pizzeria.name} - {deal.pizzeria.city}, {deal.pizzeria.state}
              </span>
            </Link>
          )}

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{deal.description}</p>

          {/* Deal Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Valid Until:</span>
              <span className="font-semibold">{formatDate(deal.deadline)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Time Left:</span>
              <span
                className={`font-semibold ${
                  isExpired ? 'text-red-400' : timeRemaining.includes('hour') ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {timeRemaining}
              </span>
            </div>

            {deal.maxParticipants && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Redeemed:</span>
                <span className="font-semibold">
                  {deal.participantCount} / {deal.maxParticipants}
                </span>
              </div>
            )}
          </div>

          {/* View Button */}
          <Link
            href={`/pizza-bank/deals/${deal.id}`}
            className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
              isExpired
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isExpired ? 'Deal Expired' : 'View Deal'}
          </Link>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading deals...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">🎉 Promotional Deals</h1>
            <Link
              href="/pizza-bank/deals/new"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              + Create Deal
            </Link>
          </div>
          <p className="text-gray-400">
            Exclusive discounts and special offers from your favorite pizzerias
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'active'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Active Deals
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'expired'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Expired Deals
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold mb-2">
              {filter === 'active' ? 'No Active Deals' : 'No Expired Deals'}
            </h2>
            <p className="text-gray-400 mb-6">
              {filter === 'active'
                ? 'Check back soon for new deals!'
                : 'All expired deals will appear here.'}
            </p>
            {filter === 'active' && (
              <Link
                href="/pizza-bank/deals/new"
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                Create First Deal
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
