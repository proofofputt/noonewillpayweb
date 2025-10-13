'use client'

import { useEffect, useState } from 'react'
import { POINT_TYPE_DESCRIPTIONS } from '@/lib/points/point-types'

interface HistoryRecord {
  id: string
  points: string
  pointType: string
  description: string
  createdAt: string
  metadata?: string
}

export function PointsHistory({ referralCode }: { referralCode: string }) {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/points/history?referralCode=${referralCode}&limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.history)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [referralCode])

  if (loading) {
    return <div className="text-white">Loading history...</div>
  }

  if (history.length === 0) {
    return (
      <div className="bg-black/20 rounded-lg p-6 text-center">
        <p className="text-white">No point transactions yet. Complete the quiz to earn points!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Points History</h2>
      <div className="space-y-3">
        {history.map(record => {
          const points = parseFloat(record.points)
          const isPositive = points > 0
          return (
            <div key={record.id} className="bg-black/20 rounded-lg p-4 border border-white/20 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-bold text-white">
                  {POINT_TYPE_DESCRIPTIONS[record.pointType as keyof typeof POINT_TYPE_DESCRIPTIONS] || record.pointType}
                </div>
                <div className="text-sm text-gray-300">{record.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(record.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{points}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
