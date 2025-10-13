'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface LevelData {
  level: string
  count: number
  points: number
  color: string
}

interface ReferralLevelChartProps {
  data: LevelData[]
}

export function ReferralLevelChart({ data }: ReferralLevelChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 border-2 border-orange p-4 rounded-lg shadow-lg">
          <p className="text-white font-bold mb-2">{data.level}</p>
          <p className="text-orange text-sm">Referrals: {data.count}</p>
          <p className="text-green-400 text-sm">Points per referral: {data.points}</p>
          <p className="text-gray-400 text-sm">Total points: {(data.count * data.points).toFixed(1)}</p>
        </div>
      )
    }
    return null
  }

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="category"
            dataKey="level"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            type="number"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Referrals" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Statistics below chart */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.map((level, index) => {
          const percentage = total > 0 ? (level.count / total) * 100 : 0
          return (
            <div key={index} className="text-center">
              <div
                className="h-2 rounded-full mb-1"
                style={{
                  backgroundColor: level.color,
                  width: `${percentage}%`,
                  minWidth: percentage > 0 ? '20%' : '0%',
                  margin: '0 auto'
                }}
              />
              <div className="text-xs text-gray-400">L{index + 1}</div>
              <div className="text-sm font-bold text-white">{level.count}</div>
              <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
