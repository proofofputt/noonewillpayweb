'use client'

import { useEffect, useState } from 'react'

interface BreakdownItem {
  type: string
  description: string
  count: number
  total: number
}

interface BreakdownData {
  categories: {
    quiz: BreakdownItem[]
    referrals: BreakdownItem[]
    community: BreakdownItem[]
    bonuses: BreakdownItem[]
    admin: BreakdownItem[]
  }
  categoryTotals: {
    quiz: number
    referrals: number
    community: number
    bonuses: number
    admin: number
  }
  grandTotal: number
}

export function PointsBreakdown({ referralCode }: { referralCode: string }) {
  const [breakdown, setBreakdown] = useState<BreakdownData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/points/breakdown?referralCode=${referralCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBreakdown(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [referralCode])

  if (loading) {
    return <div className="text-white">Loading breakdown...</div>
  }

  if (!breakdown) {
    return <div className="text-white">No breakdown data available</div>
  }

  const CategorySection = ({ title, items, total }: { title: string; items: BreakdownItem[]; total: number }) => {
    if (items.length === 0) return null

    return (
      <div className="bg-black/20 rounded-lg p-4 border border-white/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="text-2xl font-bold text-orange">{total.toFixed(1)} pts</div>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.type} className="flex justify-between items-center text-sm">
              <span className="text-gray-300">
                {item.description}
                <span className="text-gray-500 ml-2">×{item.count}</span>
              </span>
              <span className="text-white font-semibold">{item.total.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Points Breakdown</h2>
        <div className="text-3xl font-black text-orange">
          {breakdown.grandTotal.toFixed(1)} Total
        </div>
      </div>

      <div className="space-y-4">
        <CategorySection
          title="📚 Quiz Points"
          items={breakdown.categories.quiz}
          total={breakdown.categoryTotals.quiz}
        />
        <CategorySection
          title="🤝 Referral Points"
          items={breakdown.categories.referrals}
          total={breakdown.categoryTotals.referrals}
        />
        <CategorySection
          title="🎁 Bonus Points"
          items={breakdown.categories.bonuses}
          total={breakdown.categoryTotals.bonuses}
        />
        <CategorySection
          title="🏘️ Community Points"
          items={breakdown.categories.community}
          total={breakdown.categoryTotals.community}
        />
        {breakdown.categories.admin.length > 0 && (
          <CategorySection
            title="⚙️ Admin Points"
            items={breakdown.categories.admin}
            total={breakdown.categoryTotals.admin}
          />
        )}
      </div>
    </div>
  )
}
