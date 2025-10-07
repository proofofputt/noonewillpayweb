'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  email: string
  referralCode: string
  allocationPoints: number
  referralCount: number
  totalScore: number
  isCurrentUser?: boolean
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, email: 'alice@***', referralCode: 'ALIC******', allocationPoints: 2850, referralCount: 23, totalScore: 300 },
    { rank: 2, email: 'bob@***', referralCode: 'BOB1******', allocationPoints: 2150, referralCount: 18, totalScore: 250 },
    { rank: 3, email: 'carol@***', referralCode: 'CARO******', allocationPoints: 1920, referralCount: 15, totalScore: 270 },
    { rank: 4, email: 'david@***', referralCode: 'DAVI******', allocationPoints: 1680, referralCount: 12, totalScore: 280 },
    { rank: 5, email: 'eve@***', referralCode: 'EVE2******', allocationPoints: 1450, referralCount: 10, totalScore: 250 },
  ])

  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all')

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-bitcoin mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top performers by allocation points</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              timeframe === 'all'
                ? 'bg-bitcoin text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              timeframe === 'month'
                ? 'bg-bitcoin text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
              timeframe === 'week'
                ? 'bg-bitcoin text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            This Week
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-700 to-gray-900 p-6 rounded-lg border border-gray-600 text-center pt-12"
          >
            <div className="text-5xl mb-2">🥈</div>
            <div className="text-xl font-bold mb-1">{leaderboard[1]?.email}</div>
            <div className="text-3xl font-bold text-gray-300 mb-2">
              {leaderboard[1]?.allocationPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              {leaderboard[1]?.referralCount} referrals
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-600 to-yellow-900 p-6 rounded-lg border-2 border-yellow-500 text-center"
          >
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-xl font-bold mb-1">{leaderboard[0]?.email}</div>
            <div className="text-4xl font-bold text-yellow-300 mb-2">
              {leaderboard[0]?.allocationPoints.toLocaleString()}
            </div>
            <div className="text-sm text-yellow-200">
              {leaderboard[0]?.referralCount} referrals
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-800 to-orange-950 p-6 rounded-lg border border-orange-700 text-center pt-16"
          >
            <div className="text-5xl mb-2">🥉</div>
            <div className="text-xl font-bold mb-1">{leaderboard[2]?.email}</div>
            <div className="text-3xl font-bold text-orange-300 mb-2">
              {leaderboard[2]?.allocationPoints.toLocaleString()}
            </div>
            <div className="text-sm text-orange-400">
              {leaderboard[2]?.referralCount} referrals
            </div>
          </motion.div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-950 border-b border-gray-800 font-bold text-sm text-gray-400">
            <div>Rank</div>
            <div className="col-span-2">User</div>
            <div className="text-right">Points</div>
            <div className="text-right">Referrals</div>
            <div className="text-right">Score</div>
          </div>

          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-6 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                entry.isCurrentUser ? 'bg-bitcoin/10 border-bitcoin' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-bitcoin">#{entry.rank}</span>
              </div>

              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-bitcoin rounded-full flex items-center justify-center text-black font-bold">
                  {entry.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{entry.email}</div>
                  <div className="text-xs text-gray-500 font-mono">{entry.referralCode}</div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <span className="font-bold text-lg">{entry.allocationPoints.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-gray-400">{entry.referralCount}</span>
              </div>

              <div className="flex items-center justify-end">
                <span className="text-gray-400">{entry.totalScore}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Participants</div>
            <div className="text-3xl font-bold text-bitcoin">247</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Allocation Pool</div>
            <div className="text-3xl font-bold text-ordinal">142,850</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="text-sm text-gray-400 mb-2">Avg Points per User</div>
            <div className="text-3xl font-bold text-runes">578</div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-950 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-4">How Points are Calculated:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-900 rounded">
              <div className="text-bitcoin font-bold mb-2">Personal Score</div>
              <div className="text-gray-400">
                100 points for each correct answer (max 300)
              </div>
            </div>
            <div className="p-4 bg-gray-900 rounded">
              <div className="text-ordinal font-bold mb-2">Referral Bonus</div>
              <div className="text-gray-400">
                50 points for each successful referral
              </div>
            </div>
            <div className="p-4 bg-gray-900 rounded">
              <div className="text-runes font-bold mb-2">Quality Bonus</div>
              <div className="text-gray-400">
                10% of your referrals' total scores
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
