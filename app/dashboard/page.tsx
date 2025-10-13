'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useSearchParams } from 'next/navigation'
import { PointsHistory } from '@/components/PointsHistory'
import { PointsBreakdown } from '@/components/PointsBreakdown'

interface UserStats {
  referralCode: string
  referralCount: number
  totalScore: number
  allocationPoints: number
  rank: number
  referrals: Array<{
    email: string
    score: number
    completed: boolean
    date: string
  }>
}

interface StickerInfo {
  stickers: Array<{
    code: string
    claimedAt: string | null
    usageCount: number
    batchId: string | null
  }>
  totalStickerReferrals: number
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const referralCodeParam = searchParams?.get('code')
  const phoneParam = searchParams?.get('phone')
  const emailParam = searchParams?.get('email')

  const [stats, setStats] = useState<UserStats | null>(null)
  const [stickerInfo, setStickerInfo] = useState<StickerInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [referralUrl, setReferralUrl] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Build query params
        const params = new URLSearchParams()
        if (referralCodeParam) params.append('referralCode', referralCodeParam)
        if (phoneParam) params.append('phone', phoneParam)
        if (emailParam) params.append('email', emailParam)

        const response = await fetch(`/api/profile/stats?${params}`)

        if (!response.ok) {
          throw new Error('Failed to load profile data')
        }

        const data = await response.json()

        if (data.success) {
          setStats(data.stats)
          setStickerInfo(data.stickerCodes)
          setError(null)
        } else {
          setError(data.error || 'Unknown error')
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Could not load dashboard data. Please check your URL parameters.')
      } finally {
        setLoading(false)
      }
    }

    if (referralCodeParam || phoneParam || emailParam) {
      fetchStats()
    } else {
      setError('Please provide a referral code, phone, or email in the URL. Example: /dashboard?code=ABCD-1234')
      setLoading(false)
    }
  }, [referralCodeParam, phoneParam, emailParam])

  useEffect(() => {
    if (stats) {
      setReferralUrl(`${window.location.origin}/?ref=${stats.referralCode}`)
    }
  }, [stats])

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

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error || 'Unknown error occurred'}</p>
          <p className="text-sm text-gray-500">
            Please make sure you have a valid referral code, phone number, or email in the URL.
          </p>
        </div>
      </div>
    )
  }

  const allocationBreakdown = {
    basePoints: stats.totalScore,
    referralBonus: stats.referralCount * 50,
    scoreBonus: Math.floor(stats.referrals.reduce((sum, r) => sum + (r.score || 0), 0) * 0.1)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-bitcoin mb-2">Your Dashboard</h1>
          <p className="text-gray-400">Track your referrals and allocation points</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Allocation Points"
            value={stats.allocationPoints.toLocaleString()}
            subtitle={`Rank #${stats.rank}`}
            icon="🏆"
            highlight
          />
          <StatCard
            title="Referrals"
            value={stats.referralCount}
            subtitle="+50 pts each"
            icon="👥"
          />
          <StatCard
            title="Your Score"
            value={stats.totalScore}
            subtitle="From survey"
            icon="📊"
          />
          <StatCard
            title="Bonus Points"
            value={allocationBreakdown.scoreBonus}
            subtitle="From referrals"
            icon="⭐"
          />
        </div>

        {/* Referral Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Referral Link */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-ordinal">Your Referral Link</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Referral Code</label>
              <div className="text-3xl font-bold text-bitcoin font-mono">
                {stats.referralCode}
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
              <h3 className="font-bold mb-2 text-sm">How it works:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ Share your link with friends</li>
                <li>✓ They complete the 3-question survey</li>
                <li>✓ You get 50 points per referral</li>
                <li>✓ Plus 10% of their scores as bonus</li>
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
                  // Download QR code
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
                      downloadLink.download = `referral-${stats.referralCode}.png`
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

        {/* Sticker Codes Section */}
        {stickerInfo && stickerInfo.stickers.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-lg border border-purple-500 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">🎫 Your Claimed Sticker Codes</h2>
            <p className="text-sm text-gray-300 mb-4">
              You claimed {stickerInfo.stickers.length} sticker code(s) which generated {stickerInfo.totalStickerReferrals} referral(s)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stickerInfo.stickers.map((sticker, idx) => (
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

        {/* Detailed Points Breakdown */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <PointsBreakdown referralCode={stats.referralCode} />
        </div>

        {/* Referral List */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>

          {stats.referrals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No referrals yet</p>
              <p className="text-sm">Share your link to start earning points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.referrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-950 rounded border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold">
                      {referral.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono text-sm">{referral.email}</div>
                      <div className="text-xs text-gray-500">{referral.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Score</div>
                      <div className="font-bold">{referral.score || '—'}</div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs ${
                      referral.completed
                        ? 'bg-green-900 text-green-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {referral.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points Transaction History */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <PointsHistory referralCode={stats.referralCode} />
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

function AllocationBar({
  label,
  points,
  total,
  color,
  subtitle
}: {
  label: string
  points: number
  total: number
  color: 'bitcoin' | 'ordinal' | 'runes'
  subtitle?: string
}) {
  const colorMap = {
    bitcoin: 'bg-bitcoin',
    ordinal: 'bg-ordinal',
    runes: 'bg-runes'
  }

  const percentage = (points / total) * 100

  return (
    <div>
      <div className="flex justify-between mb-2">
        <div>
          <span className="text-sm font-medium">{label}</span>
          {subtitle && <span className="text-xs text-gray-500 ml-2">{subtitle}</span>}
        </div>
        <span className="text-sm font-mono">{points} pts</span>
      </div>
      <div className="bg-gray-800 rounded-full h-3">
        <div
          className={`${colorMap[color]} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Loading...</div>
          <p className="text-gray-400">Fetching your dashboard data</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
