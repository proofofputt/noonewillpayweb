'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface TreasuryItem {
  id: string
  pizzeriaId: string
  itemType: string
  quantity: number
  claimed: boolean
  expiresAt: string | null
  createdAt: string
}

interface TreasuryItemWithPizzeria {
  treasury: TreasuryItem
  pizzeria: {
    id: string
    name: string
    address: string
    city: string
    state: string
    imageUrl?: string
  } | null
}

interface Stats {
  totalAvailable: number
  slicesAvailable: number
  piesAvailable: number
}

export default function TreasuryPage() {
  const [items, setItems] = useState<TreasuryItemWithPizzeria[]>([])
  const [stats, setStats] = useState<Stats>({ totalAvailable: 0, slicesAvailable: 0, piesAvailable: 0 })
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'slice' | 'pie'>('all')

  useEffect(() => {
    fetchTreasuryItems()
  }, [filterType])

  const fetchTreasuryItems = async () => {
    try {
      setLoading(true)
      const url = filterType === 'all'
        ? '/api/pizza-bank/treasury'
        : `/api/pizza-bank/treasury?itemType=${filterType}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setItems(data.items)
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to load treasury items')
      }
    } catch (err) {
      console.error('Error fetching treasury:', err)
      setError('Failed to load treasury items')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (itemId: string) => {
    try {
      setClaiming(itemId)
      setError('')
      setSuccessMessage('')

      const response = await fetch('/api/pizza-bank/treasury/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treasuryItemId: itemId })
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message)
        // Refresh the list
        await fetchTreasuryItems()
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setError(data.error || 'Failed to claim item')
      }
    } catch (err) {
      console.error('Error claiming item:', err)
      setError('Failed to claim item')
    } finally {
      setClaiming(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading treasury...</div>
        </div>
      </div>
    )
  }

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true
    return item.treasury.itemType === filterType
  })

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
            Pizza Treasury
          </h1>
          <p className="text-gray-400">Free pizza funded by the community</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400"
          >
            {successMessage}
            <Link
              href="/pizza-bank/treasury/my-claims"
              className="block mt-2 text-sm underline hover:text-green-300"
            >
              View my claimed items →
            </Link>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-orange">
            <div className="text-3xl font-bold text-bitcoin mb-1">{stats.totalAvailable}</div>
            <div className="text-gray-400">Total Available</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <div className="text-3xl font-bold text-green-500 mb-1">{stats.slicesAvailable}</div>
            <div className="text-gray-400">🍕 Slices</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <div className="text-3xl font-bold text-purple-500 mb-1">{stats.piesAvailable}</div>
            <div className="text-gray-400">🥧 Full Pies</div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-gradient-to-br from-bitcoin/10 to-orange/10 p-6 rounded-lg border-2 border-bitcoin"
        >
          <h2 className="text-xl font-bold mb-4 text-bitcoin">🎁 How the Treasury Works</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="font-bold mb-1">Community Funded</h3>
              <p className="text-gray-400">
                Every 5th order at a pizzeria contributes 1 free slice to the treasury
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="font-bold mb-1">Claim for Free</h3>
              <p className="text-gray-400">
                Browse available items and claim your free pizza with one click
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="font-bold mb-1">Redeem at Pizzeria</h3>
              <p className="text-gray-400">
                Show your claim code at the counter to receive your free pizza
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All Items ({stats.totalAvailable})
            </button>
            <button
              onClick={() => setFilterType('slice')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'slice'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🍕 Slices ({stats.slicesAvailable})
            </button>
            <button
              onClick={() => setFilterType('pie')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'pie'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🥧 Full Pies ({stats.piesAvailable})
            </button>
          </div>
        </motion.div>

        {/* Treasury Items */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold mb-2">No Items Available</h2>
            <p className="text-gray-400 mb-6">
              {filterType === 'all'
                ? 'The treasury is currently empty. Check back soon!'
                : `No ${filterType}s available right now.`}
            </p>
            <p className="text-sm text-gray-500">
              Treasury items are generated when pizzerias receive their 5th order
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.treasury.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700 hover:border-orange transition-all"
              >
                {/* Item Icon */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">
                    {item.treasury.itemType === 'slice' ? '🍕' : '🥧'}
                  </div>
                  <h3 className="text-xl font-bold capitalize">
                    Free {item.treasury.itemType}
                  </h3>
                </div>

                {/* Pizzeria Info */}
                {item.pizzeria && (
                  <div className="mb-4 pb-4 border-b border-gray-700">
                    <div className="font-bold text-lg mb-1">{item.pizzeria.name}</div>
                    <div className="text-sm text-gray-400">
                      {item.pizzeria.city}, {item.pizzeria.state}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Added:</span>
                    <span>{new Date(item.treasury.createdAt).toLocaleDateString()}</span>
                  </div>
                  {item.treasury.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span>{new Date(item.treasury.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(item.treasury.id)}
                  disabled={claiming === item.treasury.id}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming === item.treasury.id ? 'Claiming...' : 'Claim This Item'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* View My Claims Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/pizza-bank/treasury/my-claims"
            className="inline-block px-6 py-3 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-all"
          >
            View My Claimed Items →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
