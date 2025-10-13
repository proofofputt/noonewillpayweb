'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function PizzaBankPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: '🍕',
      title: 'Pizza Radar',
      description: 'Interactive map showing all participating pizzerias. Find Bitcoin-accepting pizza shops near you.',
      link: '/pizza-bank/map',
      color: 'from-orange to-orange-dark',
    },
    {
      icon: '👥',
      title: 'Group Buying',
      description: 'Coordinate bulk orders with your network. Greater purchasing power, better prices, more pizza.',
      link: '/pizza-bank/group-buys',
      color: 'from-purple-600 to-purple-800',
    },
    {
      icon: '🏦',
      title: 'Pizza Treasury',
      description: 'Every 5th purchase adds free slices to the community pool. Pay it forward, claim free pizza.',
      link: '/pizza-bank/treasury',
      color: 'from-green-600 to-green-800',
    },
    {
      icon: '₿',
      title: 'Bitcoin Payments',
      description: 'Pay with Bitcoin or Lightning. Support sound money while enjoying great pizza.',
      link: '/pizza-bank/pizzerias?bitcoin=true',
      color: 'from-orange to-yellow-600',
    },
    {
      icon: '🎉',
      title: 'Culture Club',
      description: 'Pizza events, tastings, and social feed. Connect with fellow pizza enthusiasts.',
      link: '/pizza-bank/culture-club',
      color: 'from-blue-600 to-blue-800',
    },
    {
      icon: '💰',
      title: 'Affiliate System',
      description: 'Promote your favorite pizzerias. Earn commissions on orders you generate.',
      link: '/pizza-bank/affiliates',
      color: 'from-red-600 to-red-800',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange/20 via-black to-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,147,26,0.3),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6">
              <span className="text-white">Pizza</span>{' '}
              <span className="text-bitcoin">Bank</span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              The Group Buying Network for Pizza
            </p>

            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
              Coordinate with your community. Pool purchasing power. Pay with Bitcoin.
              Support local pizzerias. Build a treasury of free slices.
              One pizza at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pizza-bank/map"
                className="px-8 py-4 bg-gradient-to-r from-orange to-orange-dark text-black font-bold text-lg rounded-lg hover:from-orange-dark hover:to-orange transition-all transform hover:scale-105 shadow-lg"
              >
                🗺️ Explore Pizza Radar
              </Link>
              <Link
                href="/pizza-bank/pizzerias"
                className="px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 border-2 border-gray-700"
              >
                📋 Browse Pizzerias
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-bitcoin">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Discover</h3>
              <p className="text-gray-400">
                Browse participating pizzerias on the Pizza Radar map. Filter by Bitcoin acceptance,
                active group buys, or available free slices in the treasury.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Coordinate</h3>
              <p className="text-gray-400">
                Join or create group buys to unlock bulk discounts. Pool orders with friends,
                family, or the wider community for better pricing.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Pay Forward</h3>
              <p className="text-gray-400">
                Every 5th purchase contributes free slices to the treasury. Claim free pizza
                when available, or contribute to help others.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                    hoveredFeature === index
                      ? 'border-orange bg-gradient-to-br from-orange/20 to-transparent transform scale-105'
                      : 'border-gray-800 bg-gray-900'
                  }`}
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>

                  {hoveredFeature === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-4 right-4 text-orange font-bold"
                    >
                      Explore →
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-12 border-2 border-purple-700"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-300">
            Network Stats
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange mb-2">12</div>
              <div className="text-sm text-gray-400">Participating Pizzerias</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">247</div>
              <div className="text-sm text-gray-400">Group Orders Placed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">89</div>
              <div className="text-sm text-gray-400">Free Slices Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">8</div>
              <div className="text-sm text-gray-400">Active Group Buys</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Join the Pizza Bank?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Sign up to start coordinating group buys, building the treasury,
            and connecting with pizza lovers in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-bitcoin text-black font-bold text-lg rounded-lg hover:bg-orange-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-800 text-white font-bold text-lg rounded-lg hover:bg-gray-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Pizza Bank - A No One Will Pay Initiative</p>
          <p className="mt-2">Building community through coordination and sound money</p>
        </div>
      </footer>
    </div>
  )
}
