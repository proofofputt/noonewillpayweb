'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TokenPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-gray-400">Nobody</span>
            <span className="text-orange-500">•</span>
            <span className="text-gray-400">Will</span>
            <span className="text-orange-500">•</span>
            <span className="text-gray-400">Pay</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            A Runes Token on Bitcoin
          </p>
          <p className="text-lg text-gray-400">
            13 characters • 202,301,703 supply • 100% Free Airdrop
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
            <h2 className="text-3xl font-bold mb-4">A Worthless Token with Meaning</h2>
            <p className="text-lg text-gray-300 mb-4">
              Nobody•Will•Pay is intentionally <span className="text-orange-500 font-bold">worthless</span> in monetary terms,
              but invaluable in the spirit of digital connectivity and participation. This 13-character Runes token celebrates the first minimum character limit
              of the Runes protocol, with 12 digits to be removed every few months over the next four years.
            </p>
            <p className="text-lg text-gray-300">
              Distributed <span className="text-green-400 font-bold">100% freely</span> to those who "Dox for Nothing" -
              confirming email, accepting text messages, and providing a Bitcoin Taproot address.
            </p>
          </div>
        </motion.div>

        {/* Free and Fair Movement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-orange-900/30 to-green-900/30 border border-orange-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">🚀 Free and Fair Is The Movement</h2>
            <p className="text-lg text-gray-300 mb-4">
              Unlike traditional projects that rely on pre-sales, team allocations, and market makers, Nobody•Will•Pay takes a revolutionary approach:
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="font-bold mb-1">No Pre-Sales</h3>
                <p className="text-sm text-gray-400">100% free airdrop. Nobody pays to participate.</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="font-bold mb-1">No Team Allocations</h3>
                <p className="text-sm text-gray-400">No central entity holds disproportionate power.</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="font-bold mb-1">No Market Makers</h3>
                <p className="text-sm text-gray-400">Organic growth driven by genuine community interest.</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 italic">
              This approach passes the Howey Test - no investment of money, no expectation of profits, no efforts of others required.
              Just pure community participation.
            </p>
          </div>
        </motion.div>

        {/* Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Distribution Plan</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Region</th>
                  <th className="px-6 py-3 text-right">Max Holders</th>
                  <th className="px-6 py-3 text-right">Tokens per Holder</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-semibold">Maryland</div>
                    <div className="text-sm text-gray-400">Verified Locals</div>
                  </td>
                  <td className="px-6 py-4 text-right">270</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">202,300</td>
                  <td className="px-6 py-4 text-right">54,621,000</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-semibold">Virginia</div>
                    <div className="text-sm text-gray-400">Verified Locals</div>
                  </td>
                  <td className="px-6 py-4 text-right">270</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">202,300</td>
                  <td className="px-6 py-4 text-right">54,621,000</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-semibold">District of Columbia</div>
                    <div className="text-sm text-gray-400">Verified Locals</div>
                  </td>
                  <td className="px-6 py-4 text-right">270</td>
                  <td className="px-6 py-4 text-right text-green-400 font-bold">202,300</td>
                  <td className="px-6 py-4 text-right">54,621,000</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="font-semibold">Local Foreigners</div>
                    <div className="text-sm text-gray-400">DMV area, non-residents</div>
                  </td>
                  <td className="px-6 py-4 text-right">378</td>
                  <td className="px-6 py-4 text-right text-orange-400 font-bold">101,101</td>
                  <td className="px-6 py-4 text-right">38,216,178</td>
                </tr>
                <tr className="border-t border-gray-700 bg-gray-900/50 font-bold">
                  <td className="px-6 py-4">Total Supply</td>
                  <td className="px-6 py-4 text-right">1,188</td>
                  <td className="px-6 py-4 text-right">-</td>
                  <td className="px-6 py-4 text-right text-orange-500">202,079,178</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-400 text-center mt-4">
            * 270 holders per state represents the Electoral College votes needed to win the presidency -
            a playful nod to the DMV's political significance as the "Capital of the Free World"
          </p>
        </motion.div>

        {/* The DMV */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">🏛️ The DMV: Capital of the Free World</h2>
            <p className="text-lg text-gray-300 mb-4">
              We playfully refer to the DMV (District of Columbia, Maryland, and Virginia) as the "Capital of the free world."
              Washington, DC is home to global leaders, policy makers, and a diverse population that influences decisions on an international scale.
            </p>
            <p className="text-lg text-gray-300 mb-4">
              Residents of this area often have an <span className="text-orange-500 font-bold">outsized impact on the world</span> due to their
              proximity to power and engagement in global affairs.
            </p>
            <p className="text-lg text-gray-300">
              Having access to a network that originates from this influential area, <span className="text-green-400 font-bold">filtered for those
              who have at least begun a Bitcoin journey</span>, fosters unexpected collaborations and opportunities the world needs. By participating,
              you position yourself at the intersection of innovation and influence.
            </p>
          </div>
        </motion.div>

        {/* How to Claim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">How to Claim Your Airdrop</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-bold mb-2">1. Confirm Email</h3>
              <p className="text-sm text-gray-400">Verify your email address for updates</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold mb-2">2. Accept SMS</h3>
              <p className="text-sm text-gray-400">DMV phone number verification</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="font-bold mb-2">3. Set Up Xverse</h3>
              <p className="text-sm text-gray-400">Create Bitcoin wallet with Taproot address</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-bold mb-2">4. Receive Tokens</h3>
              <p className="text-sm text-gray-400">Free airdrop to your wallet</p>
            </div>
          </div>
        </motion.div>

        {/* Via Negativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-orange-900/30 border border-purple-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Via Negativa: What We Are NOT</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-bold text-orange-500 mb-2">❌ We Do NOT:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Require payment (it's FREE)</li>
                  <li>• Have team allocations (100% airdrop)</li>
                  <li>• Use market makers (organic growth)</li>
                  <li>• Promise profits (it's worthless)</li>
                  <li>• Extract value (community-first)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-green-500 mb-2">✅ We DO:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Celebrate community participation</li>
                  <li>• Demonstrate Bitcoin innovation</li>
                  <li>• Foster unexpected collaborations</li>
                  <li>• Build DMV Bitcoin network</li>
                  <li>• Embrace transparency and fairness</li>
                </ul>
              </div>
            </div>
            <p className="text-center text-gray-400 italic">
              "By defining what we are NOT, we reveal what Bitcoin truly IS."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
