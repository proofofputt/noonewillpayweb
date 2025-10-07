'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Package {
  id: string
  package_name: string
  description: string
  category: string
  regular_price: number
  mates_price: number
  discount_percentage: number
  charity_threshold: number
  charity_counter: number
  next_purchase_generates_charity: boolean
  business_name: string
  business_type: string
  region: string
  logo_url: string
  total_purchases: number
}

export default function MarketplacePage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [selectedCategory, selectedRegion])

  const fetchPackages = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') params.append('category', selectedCategory)
    if (selectedRegion !== 'all') params.append('region', selectedRegion)

    const response = await fetch(`/api/packages?${params}`)
    const data = await response.json()
    setPackages(data.packages || [])
    setLoading(false)
  }

  const handlePurchase = async (packageId: string) => {
    setPurchasingId(packageId)

    try {
      const response = await fetch('/api/packages/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          paymentMethod: 'bitcoin', // TODO: Add payment method selection
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Purchase successful!\n\nRedemption Code: ${data.purchase.redemptionCode}\n\n${data.purchase.charityGenerated ? '🎉 Your purchase generated a free item for someone in need!' : ''}`)
        fetchPackages() // Refresh to update charity counters
      } else {
        alert('Purchase failed: ' + data.message)
      }
    } catch (error) {
      alert('Purchase failed')
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#F7931A] via-[#8B5CF6] to-[#10B981] text-transparent bg-clip-text">
            Mates Rates Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Support local businesses, get great deals, help the community
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Every purchase contributes to free items for people in need
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              <option value="all">All Categories</option>
              <option value="meal">Meals</option>
              <option value="service">Services</option>
              <option value="bulk">Bulk Deals</option>
              <option value="subscription">Subscriptions</option>
              <option value="vip">VIP Access</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-4 py-2"
            >
              <option value="all">All Regions</option>
              <option value="DC">Washington, DC</option>
              <option value="MD">Maryland</option>
              <option value="VA">Virginia</option>
            </select>
          </div>
        </div>

        {/* Package Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400">No packages available in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 transition-all"
              >
                {/* Package Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{pkg.package_name}</h3>
                      <p className="text-sm text-gray-400">{pkg.business_name}</p>
                      <p className="text-xs text-gray-500">{pkg.region} • {pkg.category}</p>
                    </div>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{pkg.discount_percentage.toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4">{pkg.description}</p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-400">
                        ${pkg.mates_price.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${pkg.regular_price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Save ${(pkg.regular_price - pkg.mates_price).toFixed(2)}
                    </p>
                  </div>

                  {/* Charity Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Charity Progress</span>
                      <span className="text-gray-400">
                        {pkg.charity_counter}/{pkg.charity_threshold}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(pkg.charity_counter / pkg.charity_threshold) * 100}%` }}
                      ></div>
                    </div>
                    {pkg.next_purchase_generates_charity && (
                      <p className="text-xs text-green-400 mt-1 font-semibold">
                        🎉 Next purchase generates a free item!
                      </p>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasingId === pkg.id}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    {purchasingId === pkg.id ? 'Processing...' : 'Purchase Now'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-2">
                    {pkg.total_purchases} purchases • Earn 25 allocation points
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gray-800/30 border border-gray-700 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold mb-2">Mates Rates Pricing</h3>
              <p className="text-sm text-gray-300">
                Get exclusive discounts from local businesses. Every package is cheaper than regular price.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="font-bold mb-2">Automatic Charity</h3>
              <p className="text-sm text-gray-300">
                For every 5 purchases (or custom ratio), one free item is automatically generated for someone in need.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold mb-2">Earn Points</h3>
              <p className="text-sm text-gray-300">
                Every purchase earns you 25 allocation points. Support the community and increase your allocation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
