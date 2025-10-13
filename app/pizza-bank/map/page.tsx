'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import map component to avoid SSR issues with Leaflet
const PizzaRadarMap = dynamic(
  () => import('@/components/PizzaRadarMap').then(mod => mod.PizzaRadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
          <p>Loading Pizza Radar...</p>
        </div>
      </div>
    )
  }
)

interface Pizzeria {
  id: string
  name: string
  address: string
  city: string
  state: string | null
  latitude: string | null
  longitude: string | null
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  treasurySlicesAvailable: number
  verified: boolean
}

export default function PizzaRadarMapPage() {
  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([])
  const [loading, setLoading] = useState(true)
  const [bitcoinOnly, setBitcoinOnly] = useState(false)
  const [treasuryOnly, setTreasuryOnly] = useState(false)

  useEffect(() => {
    fetchPizzerias()
  }, [])

  const fetchPizzerias = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pizza-bank/pizzerias')
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

  // Apply filters
  const filteredPizzerias = pizzerias.filter(p => {
    if (bitcoinOnly && !p.acceptsBitcoin && !p.acceptsLightning) return false
    if (treasuryOnly && p.treasurySlicesAvailable === 0) return false
    return true
  })

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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold text-bitcoin mb-2">
                🗺️ Pizza Radar
              </h1>
              <p className="text-xl text-gray-400">
                Interactive map of all participating pizzerias
              </p>
            </div>

            <Link
              href="/pizza-bank/pizzerias"
              className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              📋 List View
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange">
                  {filteredPizzerias.length}
                </div>
                <div className="text-sm text-gray-400">On Map</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredPizzerias.filter(p => p.acceptsBitcoin || p.acceptsLightning).length}
                </div>
                <div className="text-sm text-gray-400">Accept Bitcoin</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {filteredPizzerias.reduce((sum, p) => sum + p.treasurySlicesAvailable, 0)}
                </div>
                <div className="text-sm text-gray-400">Free Slices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {filteredPizzerias.filter(p => p.verified).length}
                </div>
                <div className="text-sm text-gray-400">Verified</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-bold text-gray-300">Filters:</span>

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

              <button
                onClick={() => setTreasuryOnly(!treasuryOnly)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  treasuryOnly
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                🎁 Free Pizza Available
              </button>

              {(bitcoinOnly || treasuryOnly) && (
                <button
                  onClick={() => {
                    setBitcoinOnly(false)
                    setTreasuryOnly(false)
                  }}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all font-bold"
                >
                  Clear Filters
                </button>
              )}

              <div className="ml-auto text-sm text-gray-400">
                Showing {filteredPizzerias.length} of {pizzerias.length} pizzerias
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
                <p className="text-gray-400">Loading pizzerias...</p>
              </div>
            </div>
          ) : (
            <PizzaRadarMap pizzerias={filteredPizzerias} />
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Map Legend</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange/20 rounded flex items-center justify-center text-sm">
                ₿
              </div>
              <div>
                <div className="text-white font-bold">Bitcoin Accepted</div>
                <div className="text-sm text-gray-400">On-chain payments supported</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-600/20 rounded flex items-center justify-center text-sm">
                ⚡
              </div>
              <div>
                <div className="text-white font-bold">Lightning Network</div>
                <div className="text-sm text-gray-400">Instant Bitcoin payments</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center text-sm">
                🎁
              </div>
              <div>
                <div className="text-white font-bold">Free Pizza Available</div>
                <div className="text-sm text-gray-400">Treasury slices ready to claim</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-orange/20 to-purple-600/20 rounded-lg p-8 border-2 border-orange text-center"
        >
          <h3 className="text-2xl font-bold mb-2 text-white">
            Don't see your favorite pizzeria?
          </h3>
          <p className="text-gray-300 mb-6">
            Help expand the Pizza Bank network by adding new locations
          </p>
          <Link
            href="/pizza-bank/pizzerias/new"
            className="inline-block px-8 py-4 bg-orange text-black font-bold text-lg rounded-lg hover:bg-orange-dark transition-all transform hover:scale-105"
          >
            + Add Pizzeria
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
