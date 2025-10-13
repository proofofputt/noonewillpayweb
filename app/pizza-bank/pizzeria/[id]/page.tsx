'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Pizzeria {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  state: string | null
  zipCode: string | null
  phone: string | null
  email: string | null
  website: string | null
  hours: string | null
  imageUrl: string | null
  rating: string
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  lightningAddress: string | null
  bitcoinAddress: string | null
  treasurySlicesAvailable: number
  treasuryPiesAvailable: number
  totalOrders: number
  verified: boolean
  latitude: string | null
  longitude: string | null
}

export default function PizzeriaDetailPage() {
  const params = useParams()
  const [pizzeria, setPizzeria] = useState<Pizzeria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchPizzeria(params.id as string)
    }
  }, [params.id])

  const fetchPizzeria = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pizza-bank/pizzerias/${id}`)
      const data = await response.json()

      if (data.success) {
        setPizzeria(data.pizzeria)
      } else {
        setError(data.error || 'Failed to load pizzeria')
      }
    } catch (err) {
      console.error('Error fetching pizzeria:', err)
      setError('Failed to load pizzeria')
    } finally {
      setLoading(false)
    }
  }

  const parseHours = (hoursJson: string | null) => {
    if (!hoursJson) return null
    try {
      return JSON.parse(hoursJson)
    } catch {
      return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
          <p className="text-gray-400">Loading pizzeria...</p>
        </div>
      </div>
    )
  }

  if (error || !pizzeria) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Pizzeria Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'This pizzeria does not exist'}</p>
          <Link
            href="/pizza-bank/pizzerias"
            className="px-6 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors inline-block"
          >
            Browse All Pizzerias
          </Link>
        </div>
      </div>
    )
  }

  const hours = parseHours(pizzeria.hours)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        {pizzeria.imageUrl ? (
          <img
            src={pizzeria.imageUrl}
            alt={pizzeria.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange/30 to-transparent flex items-center justify-center">
            <div className="text-9xl opacity-30">🍕</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Back button */}
        <Link
          href="/pizza-bank/pizzerias"
          className="absolute top-8 left-8 px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors backdrop-blur-sm"
        >
          ← Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-32 relative z-10 pb-16">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-bold text-white">{pizzeria.name}</h1>
                {pizzeria.verified && (
                  <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm font-bold rounded">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <span>⭐ {parseFloat(pizzeria.rating).toFixed(1)}</span>
                <span>•</span>
                <span>{pizzeria.totalOrders} orders</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/pizza-bank/order?pizzeria=${pizzeria.id}`}
                className="px-6 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors"
              >
                🍕 Order Now
              </Link>
            </div>
          </div>

          {pizzeria.description && (
            <p className="text-gray-300 text-lg mb-6">{pizzeria.description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {pizzeria.acceptsBitcoin && (
              <span className="px-4 py-2 bg-orange/20 text-orange font-bold rounded-lg">
                ₿ Accepts Bitcoin
              </span>
            )}
            {pizzeria.acceptsLightning && (
              <span className="px-4 py-2 bg-yellow-600/20 text-yellow-400 font-bold rounded-lg">
                ⚡ Lightning Network
              </span>
            )}
            {pizzeria.treasurySlicesAvailable > 0 && (
              <span className="px-4 py-2 bg-green-600/20 text-green-400 font-bold rounded-lg">
                {pizzeria.treasurySlicesAvailable} Free Slices Available
              </span>
            )}
            {pizzeria.treasuryPiesAvailable > 0 && (
              <span className="px-4 py-2 bg-green-600/20 text-green-400 font-bold rounded-lg">
                {pizzeria.treasuryPiesAvailable} Free Pies Available
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-500">📍</span>
                  <div>
                    <div className="text-white">{pizzeria.address}</div>
                    <div className="text-gray-400">
                      {pizzeria.city}
                      {pizzeria.state && `, ${pizzeria.state}`}
                      {pizzeria.zipCode && ` ${pizzeria.zipCode}`}
                    </div>
                  </div>
                </div>

                {pizzeria.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">📞</span>
                    <a href={`tel:${pizzeria.phone}`} className="text-orange hover:underline">
                      {pizzeria.phone}
                    </a>
                  </div>
                )}

                {pizzeria.email && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">✉️</span>
                    <a href={`mailto:${pizzeria.email}`} className="text-orange hover:underline">
                      {pizzeria.email}
                    </a>
                  </div>
                )}

                {pizzeria.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">🌐</span>
                    <a
                      href={pizzeria.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange hover:underline"
                    >
                      {pizzeria.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Hours */}
            {hours && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Hours</h2>
                <div className="space-y-2">
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{day}</span>
                      <span className="text-white">{time as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Info */}
            {(pizzeria.acceptsBitcoin || pizzeria.acceptsLightning) && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Bitcoin Payment</h2>
                <div className="space-y-3">
                  {pizzeria.lightningAddress && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Lightning Address</div>
                      <div className="font-mono text-yellow-400 bg-black p-3 rounded break-all">
                        {pizzeria.lightningAddress}
                      </div>
                    </div>
                  )}
                  {pizzeria.bitcoinAddress && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Bitcoin Address</div>
                      <div className="font-mono text-orange bg-black p-3 rounded break-all text-sm">
                        {pizzeria.bitcoinAddress}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/pizza-bank/order?pizzeria=${pizzeria.id}`}
                  className="block w-full px-4 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors text-center"
                >
                  🍕 Place Order
                </Link>
                <Link
                  href={`/pizza-bank/group-buys?pizzeria=${pizzeria.id}`}
                  className="block w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  👥 Join Group Buy
                </Link>
                {(pizzeria.treasurySlicesAvailable > 0 || pizzeria.treasuryPiesAvailable > 0) && (
                  <Link
                    href={`/pizza-bank/treasury?pizzeria=${pizzeria.id}`}
                    className="block w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    🎁 Claim Free Pizza
                  </Link>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Orders</div>
                  <div className="text-2xl font-bold text-white">{pizzeria.totalOrders}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Rating</div>
                  <div className="text-2xl font-bold text-white">
                    ⭐ {parseFloat(pizzeria.rating).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Treasury Pool</div>
                  <div className="text-white">
                    {pizzeria.treasurySlicesAvailable} slices • {pizzeria.treasuryPiesAvailable} pies
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
