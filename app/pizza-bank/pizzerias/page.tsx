'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Pizzeria {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  state: string | null
  phone: string | null
  imageUrl: string | null
  rating: string
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  treasurySlicesAvailable: number
  treasuryPiesAvailable: number
  totalOrders: number
  verified: boolean
}

export default function PizzeriasPage() {
  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([])
  const [loading, setLoading] = useState(true)
  const [bitcoinOnly, setBitcoinOnly] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')

  useEffect(() => {
    fetchPizzerias()
  }, [bitcoinOnly, selectedCity])

  const fetchPizzerias = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (bitcoinOnly) params.append('bitcoin', 'true')
      if (selectedCity) params.append('city', selectedCity)

      const response = await fetch(`/api/pizza-bank/pizzerias?${params}`)
      const data = await response.json()

      if (data.success) {
        setPizzerias(data.pizzerias)
      }
    } catch (error) {
      console.error('Error fetching pizzerias:', error)
    } finally {
      setLoading(false)
    }
  }

  const cities = Array.from(new Set(pizzerias.map(p => p.city))).sort()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pizza-bank"
            className="text-orange hover:text-orange-light transition-colors mb-4 inline-block"
          >
            ← Back to Pizza Bank
          </Link>

          <h1 className="text-5xl font-bold text-bitcoin mb-4">
            🍕 Pizzeria Directory
          </h1>
          <p className="text-xl text-gray-400">
            Browse all participating pizzerias in the Pizza Bank network
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-300">Filters:</label>
              <button
                onClick={() => setBitcoinOnly(!bitcoinOnly)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  bitcoinOnly
                    ? 'bg-bitcoin text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                ₿ Bitcoin Only
              </button>
            </div>

            {cities.length > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-300">City:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-orange focus:outline-none"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="ml-auto">
              <Link
                href="/pizza-bank/pizzerias/new"
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add Pizzeria
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
            <p className="text-gray-400">Loading pizzerias...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && pizzerias.length === 0 && (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-6xl mb-4">🍕</div>
            <h3 className="text-2xl font-bold mb-2">No pizzerias found</h3>
            <p className="text-gray-400 mb-4">
              Be the first to add a pizzeria to the network!
            </p>
            <Link
              href="/pizza-bank/pizzerias/new"
              className="inline-block px-6 py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors"
            >
              Add First Pizzeria
            </Link>
          </div>
        )}

        {/* Pizzerias Grid */}
        {!loading && pizzerias.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzerias.map((pizzeria, index) => (
              <motion.div
                key={pizzeria.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/pizza-bank/pizzeria/${pizzeria.id}`}>
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-orange transition-all transform hover:scale-105 h-full">
                    {/* Image */}
                    {pizzeria.imageUrl ? (
                      <div className="h-48 bg-gray-800 overflow-hidden">
                        <img
                          src={pizzeria.imageUrl}
                          alt={pizzeria.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-orange/20 to-transparent flex items-center justify-center">
                        <div className="text-8xl opacity-50">🍕</div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{pizzeria.name}</h3>
                        {pizzeria.verified && (
                          <span className="text-green-400 text-sm">✓</span>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 mb-4">
                        {pizzeria.city}{pizzeria.state && `, ${pizzeria.state}`}
                      </p>

                      {pizzeria.description && (
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                          {pizzeria.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pizzeria.acceptsBitcoin && (
                          <span className="px-2 py-1 bg-orange/20 text-orange text-xs font-bold rounded">
                            ₿ Bitcoin
                          </span>
                        )}
                        {pizzeria.acceptsLightning && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs font-bold rounded">
                            ⚡ Lightning
                          </span>
                        )}
                        {pizzeria.treasurySlicesAvailable > 0 && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs font-bold rounded">
                            {pizzeria.treasurySlicesAvailable} Free Slices
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          ⭐ {parseFloat(pizzeria.rating).toFixed(1)}
                        </div>
                        <div>
                          {pizzeria.totalOrders} orders
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && pizzerias.length > 0 && (
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-orange mb-1">
                  {pizzerias.length}
                </div>
                <div className="text-sm text-gray-400">Total Pizzerias</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {pizzerias.filter(p => p.acceptsBitcoin || p.acceptsLightning).length}
                </div>
                <div className="text-sm text-gray-400">Accept Bitcoin</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {pizzerias.reduce((sum, p) => sum + p.treasurySlicesAvailable, 0)}
                </div>
                <div className="text-sm text-gray-400">Free Slices Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {pizzerias.reduce((sum, p) => sum + p.totalOrders, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Orders</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
