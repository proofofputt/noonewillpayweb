'use client'

import { motion } from 'framer-motion'

export default function PodiumPopPage() {
  const combinations = [
    { trait: 'Background - Exterior', frequency: 3, options: ['Grey', 'Gold', 'Orange'] },
    { trait: 'Background - Interior', frequency: 3, options: ['Grey', 'Gold', 'Orange'] },
    { trait: 'Sphere Orientation', frequency: 10, options: ['10 unique perspectives'] },
    { trait: 'Function Symbol (Top)', frequency: 3, options: ['Grey (3rd Tier)', 'Gold (2nd Tier)', 'Orange (1st Tier)'] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-yellow-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-gray-400 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
            Podium Pop
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Open-Source Recursive Ordinals Collection
          </p>
          <p className="text-lg text-gray-400">
            270 Combinations • Grey, Gold, Orange • Learn Bitcoin NFTs
          </p>
        </motion.div>

        {/* What Is It */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">🎨 What is Podium Pop?</h2>
            <p className="text-lg text-gray-300 mb-4">
              Podium Pop is an <span className="text-yellow-500 font-bold">open-source educational project</span> from the Drop-Collect-Give initiative.
              It's a recursive Ordinals collection featuring spheres stacked on layered backgrounds, designed to teach Bitcoin digital art creation.
            </p>
            <p className="text-lg text-gray-300 mb-4">
              Each piece is composed of <span className="text-orange-500 font-bold">4 distinct layers</span>, resulting in exactly{' '}
              <span className="text-green-400 font-bold">270 unique combinations</span> - a number representing the Electoral College votes,
              mirroring the DMV's political significance.
            </p>
            <p className="text-lg text-gray-300">
              The colors <span className="text-gray-400 font-bold">Grey</span>,{' '}
              <span className="text-yellow-500 font-bold">Gold</span>, and{' '}
              <span className="text-orange-500 font-bold">Orange</span> represent the new order of scarce monetary assets.
            </p>
          </div>
        </motion.div>

        {/* Color Meaning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">The Monetary Podium</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-gray-600 to-gray-800 border border-gray-500 rounded-lg p-6">
              <div className="text-6xl mb-4 text-center">🥉</div>
              <h3 className="text-2xl font-bold mb-2 text-center text-gray-300">Grey</h3>
              <p className="text-center text-gray-400 text-sm mb-2">3rd Tier</p>
              <p className="text-sm text-gray-300">
                Represents the foundational and stable third tier of assets. Solid, dependable, the baseline.
              </p>
            </div>
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 border border-yellow-500 rounded-lg p-6">
              <div className="text-6xl mb-4 text-center">🥈</div>
              <h3 className="text-2xl font-bold mb-2 text-center text-yellow-300">Gold</h3>
              <p className="text-center text-yellow-400 text-sm mb-2">2nd Tier</p>
              <p className="text-sm text-yellow-100">
                Symbolizes the valuable and prestigious second tier. Timeless store of value, historically significant.
              </p>
            </div>
            <div className="bg-gradient-to-b from-orange-600 to-orange-800 border border-orange-500 rounded-lg p-6">
              <div className="text-6xl mb-4 text-center">🥇</div>
              <h3 className="text-2xl font-bold mb-2 text-center text-orange-300">Orange</h3>
              <p className="text-center text-orange-400 text-sm mb-2">1st Tier</p>
              <p className="text-sm text-orange-100">
                The pinnacle of scarcity and value. Bitcoin orange - absolute scarcity, digital perfection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Traits Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">270 Combinations</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Trait Layer</th>
                  <th className="px-6 py-3 text-center">Variations</th>
                  <th className="px-6 py-3 text-left">Options</th>
                </tr>
              </thead>
              <tbody>
                {combinations.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-6 py-4 font-semibold">{item.trait}</td>
                    <td className="px-6 py-4 text-center text-orange-500 font-bold">{item.frequency}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.options.join(', ')}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-700 bg-gray-900/50 font-bold">
                  <td className="px-6 py-4">Total Combinations</td>
                  <td className="px-6 py-4 text-center text-green-400 text-2xl">270</td>
                  <td className="px-6 py-4 text-sm text-gray-400">3 × 3 × 10 × 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Open Source Vision */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-orange-900/30 border border-purple-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">📖 Open-Source Educational Mission</h2>
            <p className="text-lg text-gray-300 mb-4">
              Podium Pop is <span className="text-green-400 font-bold">intentionally designed to be replicated</span>. This is not about scarcity
              of the artwork itself, but about teaching the mechanics of recursive Ordinals on Bitcoin.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-3 text-orange-500">What You'll Learn:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ How to create recursive Ordinals inscriptions</li>
                <li>✅ Understanding immutable provenance on Bitcoin</li>
                <li>✅ Mempool dynamics and fee estimation</li>
                <li>✅ The non-fungible phenomenon explained</li>
                <li>✅ Community building around digital art</li>
                <li>✅ Avoiding highly compressed images as fees fluctuate</li>
              </ul>
            </div>

            <p className="text-lg text-gray-300 mb-4">
              Since it's designed to be replicated, <span className="text-yellow-500 font-bold">many people may own the same combination of traits</span>.
              However, each piece will have <span className="text-orange-500 font-bold">unique provenance</span> - immutable on the first and greatest
              blockchain, Bitcoin.
            </p>

            <p className="text-sm text-gray-400 italic">
              "In its simplicity, Podium Pop employs a palatable perspective on the positive aspects of Bitcoin.
              While the traits may be shared, the journey and history of each piece remain distinct and special."
            </p>
          </div>
        </motion.div>

        {/* Canary in the Coal Mine */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">🐦 A Canary for Mempool Prices</h2>
            <p className="text-lg text-gray-300 mb-4">
              Podium Pop serves as a <span className="text-yellow-500 font-bold">canary in the coal mine</span> for curious Bitcoiners
              to observe mempool price surges in our lifetimes.
            </p>
            <p className="text-lg text-gray-300 mb-4">
              As Bitcoin adoption grows and block space becomes more valuable, recursive inscriptions demonstrate how to create
              rich visual content <span className="text-green-400 font-bold">without uploading incredibly small or highly compressed images</span>.
            </p>
            <p className="text-lg text-gray-300">
              By keeping this project open-source and replicable, we provide a window into understanding the subtle bitcoinization
              of digital art and the reality of on-chain permanence.
            </p>
          </div>
        </motion.div>

        {/* Ordinals Explained */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">⚙️ How Ordinals Work</h2>
            <p className="text-lg text-gray-300 mb-4">
              Ordinals utilize the <span className="text-orange-500 font-bold">witness data</span> in Bitcoin transactions to
              permanently store files on the Bitcoin blockchain, decoded using the Ord client.
            </p>
            <p className="text-lg text-gray-300 mb-4">
              This approach has been <span className="text-yellow-500 font-bold">contentious among monetary maximalists</span>, who question
              its implications for Bitcoin's primary use as a currency. However, the significance of an <span className="text-green-400 font-bold">immutable
              ledger that persists indefinitely</span> into the future is unprecedented.
            </p>
            <p className="text-lg text-gray-300 mb-4">
              <span className="font-bold">Nothing like this has ever existed.</span> The potential to grow value around a common thread of
              transactions is a fundamental part of life in the future.
            </p>
            <p className="text-gray-400 italic">
              "The ability to store and access permanent records on a decentralized and immutable ledger opens up new possibilities
              for value creation and preservation, shaping how we interact with digital assets and information."
            </p>
          </div>
        </motion.div>

        {/* Get Started */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border border-orange-700 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Podium Pop Community</h2>
            <p className="text-lg text-gray-300 mb-6">
              By collecting Podium Pop artworks and contributing to the open-source project, you become part of a community
              that values digital innovation and the symbolic representation of monetary assets.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-3xl mb-2">1️⃣</div>
                <p className="text-sm">Explore the 270 combinations</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-3xl mb-2">2️⃣</div>
                <p className="text-sm">Learn recursive Ordinals development</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-3xl mb-2">3️⃣</div>
                <p className="text-sm">Contribute to the open-source project</p>
              </div>
            </div>

            <p className="text-gray-400 italic">
              Connect. Create. Collaborate. Discover the New Order of Digital Scarcity with Podium Pop.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
