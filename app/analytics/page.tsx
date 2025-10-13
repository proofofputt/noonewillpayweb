'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ReferralGrowthChart } from '@/components/ReferralGrowthChart'
import { ReferralLevelChart } from '@/components/ReferralLevelChart'
import { ReferralConversionChart } from '@/components/ReferralConversionChart'

interface AnalyticsData {
  timeSeries: Array<{
    date: string
    count: number
    level1: number
    level2: number
    level3: number
    level4: number
    level5: number
    cumulativeCount: number
  }>
  byLevel: Array<{
    level: string
    count: number
    points: number
    color: string
  }>
  conversionFunnel: {
    referred: number
    completedQuickQuiz: number
    completedFullAssessment: number
    conversionRate: number
  }
  growthMetrics: {
    today: number
    yesterday: number
    last7Days: number
    last30Days: number
    dailyAverage: number
    weeklyAverage: number
  }
  insights: {
    totalReferrals: number
    averageScore: number
    peakDay: {
      date: string
      count: number
    } | null
    mostActiveLevel: string
  }
  dateRange: {
    start: string
    end: string
    days: number
  }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)
  const [chartView, setChartView] = useState<'daily' | 'cumulative' | 'byLevel'>('daily')

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/referrals?days=${days}`)

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to load analytics')
      }

      const result = await response.json()

      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Unknown error')
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err)
      setError('Could not load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange mb-4"></div>
          <div className="text-2xl">Loading Analytics...</div>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Analytics</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-bitcoin mb-2">📊 Referral Analytics</h1>
            <p className="text-gray-400">Track your outreach and onboarding engagement</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/my-dashboard"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {[7, 14, 30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                days === d
                  ? 'bg-orange text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {d} Days
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Today"
            value={data.growthMetrics.today}
            subtitle="New referrals"
            icon="📅"
            trend={data.growthMetrics.today >= data.growthMetrics.yesterday ? 'up' : 'down'}
            trendValue={data.growthMetrics.yesterday > 0
              ? `${(((data.growthMetrics.today - data.growthMetrics.yesterday) / data.growthMetrics.yesterday) * 100).toFixed(0)}%`
              : '+100%'
            }
            highlight
          />
          <MetricCard
            title="This Week"
            value={data.growthMetrics.last7Days}
            subtitle={`Avg ${data.growthMetrics.dailyAverage.toFixed(1)}/day`}
            icon="📈"
          />
          <MetricCard
            title={`${days} Days`}
            value={data.growthMetrics.last30Days}
            subtitle={`${data.growthMetrics.weeklyAverage.toFixed(1)}/week avg`}
            icon="🎯"
          />
          <MetricCard
            title="Total Referrals"
            value={data.insights.totalReferrals}
            subtitle={`${data.conversionFunnel.conversionRate.toFixed(0)}% conversion`}
            icon="👥"
          />
        </div>

        {/* Peak Performance */}
        {data.insights.peakDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 rounded-lg border-2 border-yellow-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">🔥 Peak Performance Day</h3>
                <p className="text-white">
                  <span className="font-bold text-2xl">{data.insights.peakDay.count} referrals</span>
                  {' '}on{' '}
                  <span className="font-bold">{new Date(data.insights.peakDay.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300 mb-1">Most Active Level</div>
                <div className="text-2xl font-bold text-orange">{data.insights.mostActiveLevel}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Referral Growth Over Time</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartView('daily')}
                className={`px-3 py-1 rounded text-sm font-bold ${
                  chartView === 'daily' ? 'bg-orange text-black' : 'bg-gray-800 text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setChartView('cumulative')}
                className={`px-3 py-1 rounded text-sm font-bold ${
                  chartView === 'cumulative' ? 'bg-orange text-black' : 'bg-gray-800 text-white'
                }`}
              >
                Cumulative
              </button>
              <button
                onClick={() => setChartView('byLevel')}
                className={`px-3 py-1 rounded text-sm font-bold ${
                  chartView === 'byLevel' ? 'bg-orange text-black' : 'bg-gray-800 text-white'
                }`}
              >
                By Level
              </button>
            </div>
          </div>

          <ReferralGrowthChart
            data={data.timeSeries}
            showCumulative={chartView === 'cumulative'}
            showByLevel={chartView === 'byLevel'}
          />

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-black/40 p-3 rounded">
              <div className="text-sm text-gray-400">Peak Day</div>
              <div className="text-xl font-bold text-white">
                {Math.max(...data.timeSeries.map(d => d.count))}
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded">
              <div className="text-sm text-gray-400">Average/Day</div>
              <div className="text-xl font-bold text-white">
                {data.growthMetrics.dailyAverage.toFixed(1)}
              </div>
            </div>
            <div className="bg-black/40 p-3 rounded">
              <div className="text-sm text-gray-400">Total Period</div>
              <div className="text-xl font-bold text-white">
                {data.growthMetrics.last30Days}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Level Distribution and Conversion Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-6 rounded-lg border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Referral Depth Distribution</h2>
            <ReferralLevelChart data={data.byLevel} />

            <div className="mt-6 p-4 bg-black/40 rounded border border-gray-700">
              <h4 className="text-white font-bold mb-2">💰 Points Breakdown</h4>
              <div className="space-y-2 text-sm">
                {data.byLevel.map((level, idx) => {
                  const totalPoints = level.count * level.points
                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-300">{level.level}:</span>
                      <span className="text-white font-bold">
                        {level.count} × {level.points} = {totalPoints.toFixed(1)} pts
                      </span>
                    </div>
                  )
                })}
                <div className="pt-2 border-t border-gray-700 flex justify-between font-bold">
                  <span className="text-orange">Total:</span>
                  <span className="text-orange">
                    {data.byLevel.reduce((sum, l) => sum + (l.count * l.points), 0).toFixed(1)} pts
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 p-6 rounded-lg border border-gray-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Conversion Funnel</h2>
            <ReferralConversionChart data={data.conversionFunnel} />
          </motion.div>
        </div>

        {/* Insights and Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-lg border border-blue-700"
        >
          <h2 className="text-2xl font-bold text-blue-300 mb-4">📌 Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 p-4 rounded">
              <h3 className="text-white font-bold mb-2">Network Effect</h3>
              <p className="text-sm text-gray-300">
                You have {data.insights.totalReferrals} total referrals across {data.byLevel.filter(l => l.count > 0).length} levels.
                {data.byLevel[1].count > 0 && ` Your network is growing organically with ${data.byLevel[1].count} 2nd-degree referrals!`}
              </p>
            </div>

            <div className="bg-black/40 p-4 rounded">
              <h3 className="text-white font-bold mb-2">Engagement Quality</h3>
              <p className="text-sm text-gray-300">
                Average quiz score: <span className="font-bold text-orange">{data.insights.averageScore}</span>/30.
                {data.conversionFunnel.conversionRate > 50
                  ? ' Excellent! Your referrals are highly engaged.'
                  : ' Consider following up with incomplete assessments.'
                }
              </p>
            </div>

            <div className="bg-black/40 p-4 rounded">
              <h3 className="text-white font-bold mb-2">Growth Momentum</h3>
              <p className="text-sm text-gray-300">
                {data.growthMetrics.last7Days} referrals in the last week
                ({data.growthMetrics.dailyAverage.toFixed(1)}/day average).
                {data.growthMetrics.today > data.growthMetrics.dailyAverage
                  ? ' You\'re above average today! 🚀'
                  : ' Keep sharing your link to maintain momentum.'
                }
              </p>
            </div>

            <div className="bg-black/40 p-4 rounded">
              <h3 className="text-white font-bold mb-2">Next Milestone</h3>
              <p className="text-sm text-gray-300">
                {data.insights.totalReferrals < 10 && 'Get to 10 total referrals to build momentum.'}
                {data.insights.totalReferrals >= 10 && data.insights.totalReferrals < 50 && 'Get to 50 referrals for significant network effect.'}
                {data.insights.totalReferrals >= 50 && data.insights.totalReferrals < 100 && 'Get to 100 referrals for exponential growth!'}
                {data.insights.totalReferrals >= 100 && 'Amazing! You\'re a top referrer! 🎉'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  highlight = false,
  trend,
  trendValue
}: {
  title: string
  value: number
  subtitle: string
  icon: string
  highlight?: boolean
  trend?: 'up' | 'down'
  trendValue?: string
}) {
  return (
    <div className={`p-6 rounded-lg border ${
      highlight
        ? 'bg-gradient-to-br from-bitcoin/20 to-transparent border-bitcoin'
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <div className={`text-3xl font-bold ${highlight ? 'text-bitcoin' : 'text-white'}`}>
            {value}
          </div>
          {trend && trendValue && (
            <div className={`text-sm font-bold ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </div>
  )
}
