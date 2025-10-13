'use client'

interface ConversionData {
  referred: number
  completedQuickQuiz: number
  completedFullAssessment: number
  conversionRate: number
}

interface ReferralConversionChartProps {
  data: ConversionData
}

export function ReferralConversionChart({ data }: ReferralConversionChartProps) {
  const stages = [
    {
      name: 'Referred',
      count: data.referred,
      color: 'bg-blue-500',
      percentage: 100,
      icon: '👋',
    },
    {
      name: 'Started Quiz',
      count: data.completedQuickQuiz,
      color: 'bg-purple-500',
      percentage: data.referred > 0 ? (data.completedQuickQuiz / data.referred) * 100 : 0,
      icon: '📝',
    },
    {
      name: 'Full Assessment',
      count: data.completedFullAssessment,
      color: 'bg-green-500',
      percentage: data.referred > 0 ? (data.completedFullAssessment / data.referred) * 100 : 0,
      icon: '🎓',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Funnel Visualization */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const width = stage.percentage
          const dropoff = index > 0 ? stages[index - 1].count - stage.count : 0
          const dropoffRate = index > 0 && stages[index - 1].count > 0
            ? ((dropoff / stages[index - 1].count) * 100).toFixed(1)
            : '0'

          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stage.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{stage.name}</div>
                    <div className="text-xs text-gray-400">
                      {stage.count} participants ({stage.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                {index > 0 && dropoff > 0 && (
                  <div className="text-right">
                    <div className="text-xs text-red-400">-{dropoff} drop-off</div>
                    <div className="text-xs text-gray-500">({dropoffRate}% loss)</div>
                  </div>
                )}
              </div>

              <div className="relative h-16 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className={`${stage.color} h-full flex items-center justify-between px-4 transition-all duration-500`}
                  style={{ width: `${width}%`, minWidth: width > 0 ? '15%' : '0%' }}
                >
                  <span className="text-white font-bold text-lg">{stage.count}</span>
                  <span className="text-white font-bold">{stage.percentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
          <div className="text-sm text-green-300 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-green-400">{data.conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400 mt-1">Completed full assessment</div>
        </div>

        <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
          <div className="text-sm text-purple-300 mb-1">Engagement Rate</div>
          <div className="text-3xl font-bold text-purple-400">
            {data.referred > 0 ? ((data.completedQuickQuiz / data.referred) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Started the quiz</div>
        </div>

        <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
          <div className="text-sm text-orange-300 mb-1">Completion Quality</div>
          <div className="text-3xl font-bold text-orange-400">
            {data.completedQuickQuiz > 0
              ? ((data.completedFullAssessment / data.completedQuickQuiz) * 100).toFixed(1)
              : 0}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Of starters finish</div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-white font-bold mb-2">💡 Insights</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          {data.conversionRate < 50 && (
            <li>• Consider following up with referrals who haven't completed the full assessment</li>
          )}
          {data.completedQuickQuiz < data.referred * 0.7 && (
            <li>• {((1 - data.completedQuickQuiz / data.referred) * 100).toFixed(0)}% of referrals haven't started - try sending a reminder</li>
          )}
          {data.conversionRate >= 70 && (
            <li>• Excellent conversion rate! Your referrals are highly engaged</li>
          )}
          {data.completedFullAssessment > 0 && (
            <li>• {data.completedFullAssessment} referrals completed the full assessment - great engagement!</li>
          )}
        </ul>
      </div>
    </div>
  )
}
