'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ResultsFilter, type ResultsFilters } from '@/components/ResultsFilter'
import { BIRTH_DECADES } from '@/lib/auth-helpers'

interface AggregateResults {
  totalResponses: number
  averageScores: {
    quickQuiz: number
    fullAssessment: number
    combined: number
  } | null
  completionStats: {
    quickQuizOnly: number
    fullAssessmentCompleted: number
    completionRate: number
  }
  questionStats: Array<{
    id: string
    question: string
    difficulty: string
    correctAnswer: string
    totalAnswers: number
    correctAnswers: number
    correctPercentage: number
    answerDistribution: Record<string, number>
  }>
  demographicBreakdown: Record<string, {
    count: number
    averageScore: number
    fullAssessmentCompletionRate: number
  }>
  filters: {
    quizType: string
    birthDecade?: string
  }
}

export default function ResultsPage() {
  const [data, setData] = useState<AggregateResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResultsFilters>({
    quizType: 'both',
    birthDecade: '',
  })

  useEffect(() => {
    fetchResults()
  }, [filters])

  const fetchResults = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.quizType) params.append('quizType', filters.quizType)
      if (filters.birthDecade) params.append('birthDecade', filters.birthDecade)

      const response = await fetch(`/api/results/aggregate?${params}`)

      if (!response.ok) {
        throw new Error('Failed to load results')
      }

      const result = await response.json()

      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Unknown error')
      }
    } catch (err: any) {
      console.error('Error fetching results:', err)
      setError('Could not load results data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Loading...</div>
          <p className="text-gray-400">Aggregating survey results</p>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Results</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const hardestQuestions = data.questionStats.slice(0, 5)
  const easiestQuestions = data.questionStats.slice(-5).reverse()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-bitcoin mb-2">Survey Results Analytics</h1>
            <p className="text-gray-400">Explore aggregated Bitcoin knowledge assessment data</p>
          </div>
          <Link
            href="/my-dashboard"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <ResultsFilter
          filters={filters}
          onFiltersChange={setFilters}
          disabled={loading}
        />

        {loading && (
          <div className="my-8 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
            <p className="mt-2">Updating results...</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
          <StatCard
            title="Total Responses"
            value={data.totalResponses}
            subtitle="Participants"
            icon="👥"
            highlight
          />
          <StatCard
            title="Average Score"
            value={data.averageScores?.combined.toFixed(1) || '0'}
            subtitle="Out of 225"
            icon="📊"
          />
          <StatCard
            title="Full Assessment Rate"
            value={`${data.completionStats?.completionRate.toFixed(0) || 0}%`}
            subtitle={`${data.completionStats?.fullAssessmentCompleted || 0} completed`}
            icon="✅"
          />
          <StatCard
            title="Quick Quiz Avg"
            value={data.averageScores?.quickQuiz.toFixed(1) || '0'}
            subtitle="Out of 30"
            icon="⚡"
          />
        </div>

        {/* Demographic Breakdown */}
        {Object.keys(data.demographicBreakdown).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">📊 Demographic Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.demographicBreakdown)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([decade, stats]) => (
                  <div key={decade} className="bg-black/40 p-4 rounded-lg border border-gray-700">
                    <div className="text-lg font-bold text-orange mb-2">
                      {decade === 'Not specified'
                        ? 'Not Specified'
                        : BIRTH_DECADES.find(d => d.value === decade)?.label.replace('Born ', '') || decade
                      }
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white font-bold">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Score:</span>
                        <span className="text-white font-bold">{stats.averageScore.toFixed(1)} / 225</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Full Assessment:</span>
                        <span className="text-white font-bold">{stats.fullAssessmentCompletionRate.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Hardest Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-6">🔥 Hardest Questions</h2>
          <p className="text-gray-400 mb-4">Questions with the lowest correct answer rates</p>
          <div className="space-y-4">
            {hardestQuestions.map((q, index) => (
              <QuestionStat key={q.id} question={q} rank={index + 1} />
            ))}
          </div>
        </motion.div>

        {/* Easiest Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-lg border border-gray-800"
        >
          <h2 className="text-2xl font-bold text-green-400 mb-6">✅ Easiest Questions</h2>
          <p className="text-gray-400 mb-4">Questions with the highest correct answer rates</p>
          <div className="space-y-4">
            {easiestQuestions.map((q, index) => (
              <QuestionStat key={q.id} question={q} rank={data.questionStats.length - 4 + index} isEasy />
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/20 text-center">
          <p className="text-sm text-gray-400">
            Results are updated in real-time as new participants complete the assessment.
            All data is anonymized and aggregated for privacy.
          </p>
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

function QuestionStat({
  question,
  rank,
  isEasy = false
}: {
  question: AggregateResults['questionStats'][0]
  rank: number
  isEasy?: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border-2 ${
      isEasy ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-500">#{rank}</span>
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              question.difficulty === 'easy' ? 'bg-green-500 text-black' :
              question.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-red-500 text-white'
            }`}>
              {question.difficulty.toUpperCase()}
            </span>
          </div>
          <p className="text-white font-medium mb-2">{question.question}</p>
          <p className="text-sm text-gray-400">
            Correct Answer: <span className="text-white font-bold">{question.correctAnswer}</span>
          </p>
        </div>
        <div className="text-right ml-4">
          <div className={`text-4xl font-black ${
            isEasy ? 'text-green-400' : 'text-red-400'
          }`}>
            {question.correctPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {question.correctAnswers} / {question.totalAnswers}
          </div>
        </div>
      </div>

      {/* Answer Distribution */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Answer Distribution:</div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(question.answerDistribution).map(([answer, count]) => (
            <div key={answer} className="text-center">
              <div className={`text-sm font-bold ${
                answer === question.correctAnswer ? 'text-green-400' : 'text-gray-400'
              }`}>
                {answer}
              </div>
              <div className="text-xs text-gray-500">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
