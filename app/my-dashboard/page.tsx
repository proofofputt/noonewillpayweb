'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PointsHistory } from '@/components/PointsHistory'
import { PointsBreakdown } from '@/components/PointsBreakdown'

interface DashboardData {
  user: {
    id: string
    email: string
    username: string
    referralCode: string
    allocationPoints: number
    birthDecade: string | null
  }
  survey: {
    quickQuizScore: number
    fullAssessmentScore: number
    fullAssessmentCompleted: boolean
    combinedScore: number
    maxPossibleScore: number
  } | null
  referrals: {
    total: number
    direct: number
    byLevel: Array<{ level: number; count: number }>
    totalPoints: number
    list: Array<{
      id: string
      email: string
      phone: string
      level: number
      pointsEarned: number
      quickQuizScore: number
      fullAssessmentScore: number
      fullAssessmentCompleted: boolean
      date: string
    }>
  }
  stickers: Array<{
    code: string
    claimedAt: string
    usageCount: number
    batchId: string | null
  }>
}

export default function MyDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [referralUrl, setReferralUrl] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  useEffect(() => {
    if (data) {
      setReferralUrl(`${window.location.origin}/?ref=${data.user.referralCode}`)
    }
  }, [data])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to load dashboard')
      }

      const result = await response.json()

      if (result.success) {
        setData(result)
        setError(null)
      } else {
        setError(result.error || 'Unknown error')
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err)
      setError('Could not load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Loading...</div>
          <p className="text-gray-400">Fetching your dashboard data</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error || 'Unknown error occurred'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-bitcoin mb-2">My Dashboard</h1>
            <p className="text-gray-400">Welcome back, {data.user.username}!</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/analytics"
              className="px-4 py-2 bg-gradient-to-r from-orange to-orange-dark text-white font-bold rounded-lg hover:from-orange-dark hover:to-orange transition-colors border-2 border-orange-darker"
            >
              📈 Analytics
            </Link>
            <Link
              href="/results"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📊 Results
            </Link>
            <Link
              href="/profile/settings"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>

        {/* Bitcoin Book Clubs - Prominent Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-8 border-2 border-purple-400"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">📚</span>
                <h2 className="text-3xl font-bold text-white">
                  12 Months of Bitcoin Book Clubs
                </h2>
              </div>
              <p className="text-lg text-gray-200 mb-4 leading-relaxed">
                Access your comprehensive guide to running Bitcoin education book clubs. Includes book notes, discussion guides, and 21 professionally designed slide presentations.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-black/30 px-4 py-2 rounded-lg border border-purple-300">
                  <span className="text-purple-300 font-semibold">📖 Book Notes</span>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-lg border border-blue-300">
                  <span className="text-blue-300 font-semibold">🎯 Discussion Guides</span>
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-lg border border-green-300">
                  <span className="text-green-300 font-semibold">📊 21 Slide Decks</span>
                </div>
              </div>
              <Link
                href="/book-club"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Open Book Club Resources →
              </Link>
            </div>
            <div className="hidden lg:block ml-6">
              <div className="w-48 h-48 bg-gradient-to-br from-bitcoin to-orange rounded-lg flex items-center justify-center text-8xl shadow-2xl">
                📚
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Allocation Points"
            value={data.user.allocationPoints.toLocaleString()}
            subtitle={`From ${data.referrals.total} referrals`}
            icon="🏆"
            highlight
          />
          <StatCard
            title="Quiz Score"
            value={data.survey?.combinedScore || 0}
            subtitle={`Out of ${data.survey?.maxPossibleScore || 225}`}
            icon="📚"
          />
          <StatCard
            title="Direct Referrals"
            value={data.referrals.direct}
            subtitle="+21 pts each"
            icon="👥"
          />
          <StatCard
            title="Referral Points"
            value={data.referrals.totalPoints.toFixed(1)}
            subtitle="Total earned"
            icon="⭐"
          />
        </div>

        {/* Quiz Progress CTA */}
        {data.survey && !data.survey.fullAssessmentCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 border-2 border-purple-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Complete Your Full Assessment
                </h3>
                <p className="text-white mb-2">
                  You've scored {data.survey.quickQuizScore} / 30 on the Quick Quiz
                </p>
                <p className="text-purple-200">
                  Earn up to 195 more points by completing the remaining 18 questions!
                </p>
              </div>
              <Link
                href={`/full-assessment?ref=${data.user.referralCode}`}
                className="px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors"
              >
                Continue Assessment →
              </Link>
            </div>
          </motion.div>
        )}

        {/* Referral Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Referral Link */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-ordinal">Your Referral Link</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Referral Code</label>
              <div className="text-3xl font-bold text-bitcoin font-mono">
                {data.user.referralCode}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg font-mono text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-2 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-950 rounded border border-gray-800">
              <h3 className="font-bold mb-2 text-sm">Referral Rewards:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ Level 1 (Direct): 21 points</li>
                <li>✓ Level 2 (2nd degree): 10.5 points</li>
                <li>✓ Level 3 (3rd degree): 5.25 points</li>
                <li>✓ Level 4 (4th degree): 2.25 points</li>
                <li>✓ Level 5 (5th degree): 1.125 points</li>
              </ul>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-runes">QR Code</h2>

            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-lg mb-4">
                <QRCodeSVG
                  value={referralUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="text-sm text-gray-400 text-center mb-4">
                Scan to take the survey with your referral code
              </p>

              <button
                onClick={() => {
                  const svg = document.querySelector('svg')
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg)
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const img = new Image()
                    img.onload = () => {
                      canvas.width = img.width
                      canvas.height = img.height
                      ctx?.drawImage(img, 0, 0)
                      const pngFile = canvas.toDataURL('image/png')
                      const downloadLink = document.createElement('a')
                      downloadLink.download = `referral-${data.user.referralCode}.png`
                      downloadLink.href = pngFile
                      downloadLink.click()
                    }
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                  }
                }}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Sticker Codes */}
        {data.stickers.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-lg border border-purple-500 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">🎫 Your Claimed Sticker Codes</h2>
            <p className="text-sm text-gray-300 mb-4">
              You claimed {data.stickers.length} sticker code(s)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.stickers.map((sticker, idx) => (
                <div key={idx} className="bg-black/40 p-4 rounded border border-purple-400">
                  <div className="text-xl font-bold font-mono text-purple-300 mb-2">
                    {sticker.code}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Claimed: {sticker.claimedAt ? new Date(sticker.claimedAt).toLocaleDateString() : 'N/A'}</div>
                    <div>Referrals: {sticker.usageCount}</div>
                    {sticker.batchId && <div className="text-xs">Batch: {sticker.batchId}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pizzeria Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange/10 to-purple-900/10 p-6 rounded-lg border-2 border-orange mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-bitcoin">🍕 Pizza Bank Partnerships</h2>
          <p className="text-gray-300 mb-4">
            Refer pizzerias to join the Pizza Bank network and earn 10% commission on all orders they generate!
          </p>

          <div className="bg-black/40 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-bold mb-3 text-white">Your Pizzeria Referral Link</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={`${window.location.origin}/pizza-bank/pizzerias/new?ref=${data.user.referralCode}`}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-gray-300"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/pizza-bank/pizzerias/new?ref=${data.user.referralCode}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="px-6 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">10%</div>
                <div className="text-xs text-gray-400">Commission Rate</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">Lifetime</div>
                <div className="text-xs text-gray-400">Recurring Income</div>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">Track</div>
                <div className="text-xs text-gray-400">All Performance</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/pizza-bank/pizzerias"
              className="px-6 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors"
            >
              Browse Pizzerias
            </Link>
            <Link
              href="/pizza-bank"
              className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Points Breakdown */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <PointsBreakdown referralCode={data.user.referralCode} />
        </div>

        {/* Referral List */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>

          {data.referrals.list.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No referrals yet</p>
              <p className="text-sm">Share your link to start earning points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.referrals.list.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-gray-950 rounded border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold">
                      L{referral.level}
                    </div>
                    <div>
                      <div className="font-mono text-sm">{referral.email}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(referral.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Score</div>
                      <div className="font-bold">
                        {referral.quickQuizScore + referral.fullAssessmentScore} / 225
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">You Earned</div>
                      <div className="font-bold text-green-400">+{referral.pointsEarned}</div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs ${
                      referral.fullAssessmentCompleted
                        ? 'bg-green-900 text-green-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {referral.fullAssessmentCompleted ? '✓ Full' : 'Quick Only'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points History */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <PointsHistory referralCode={data.user.referralCode} />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false
}: {
  title: string
  value: string | number
  subtitle: string
  icon: string
  highlight?: boolean
}) {
  return (
    <div className={`p-6 rounded-lg border ${
      highlight
        ? 'bg-gradient-to-br from-bitcoin/20 to-transparent border-bitcoin'
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className={`text-3xl font-bold ${
          highlight ? 'text-bitcoin' : 'text-white'
        }`}>{value}</span>
      </div>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  )
}
