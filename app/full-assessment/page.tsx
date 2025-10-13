'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getAllQuestions, type Question } from '@/lib/questions'

// Build dynamic schema based on number of questions
const createAnswersSchema = (questionCount: number) => {
  const shape: Record<string, z.ZodString> = {}
  for (let i = 1; i <= questionCount; i++) {
    shape[`question${i}`] = z.string().min(1, 'Answer is required')
  }
  return z.object({ answers: z.object(shape) })
}

function FullAssessmentContent() {
  const searchParams = useSearchParams()
  const referralCode = searchParams?.get('ref')

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const answersForm = useForm<any>({
    resolver: zodResolver(createAnswersSchema(18)),
  })

  useEffect(() => {
    async function loadQuestions() {
      if (!referralCode) {
        setError('Referral code missing. Please return to dashboard.')
        setLoading(false)
        return
      }

      try {
        // Fetch quiz status to get Quick Quiz question IDs
        const statusRes = await fetch(`/api/quiz/status?referralCode=${referralCode}`)
        const statusData = await statusRes.json()

        if (!statusData.success) {
          setError(statusData.error || 'Failed to load quiz status')
          setLoading(false)
          return
        }

        if (!statusData.quickQuizCompleted) {
          setError('Please complete the Quick Quiz first')
          setLoading(false)
          return
        }

        if (statusData.fullAssessmentCompleted) {
          setError('You have already completed the Full Assessment')
          setLoading(false)
          return
        }

        // Get all questions and filter out Quick Quiz ones
        const allQuestions = getAllQuestions()
        const quickQuizQuestionIds = statusData.quickQuizQuestionIds || []
        const remainingQuestions = allQuestions.filter(
          q => !quickQuizQuestionIds.includes(q.id)
        )

        setQuestions(remainingQuestions)
        setLoading(false)
      } catch (err) {
        console.error('Error loading questions:', err)
        setError('Failed to load questions')
        setLoading(false)
      }
    }

    loadQuestions()
  }, [referralCode])

  const onSubmit = async (data: any) => {
    if (!referralCode) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/full-assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: data.answers,
          referralCode,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResults(result)
        setCompleted(true)
      } else {
        setError(result.error || 'Failed to submit assessment')
      }
    } catch (err) {
      console.error('Error submitting assessment:', err)
      setError('Failed to submit assessment')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center">
        <div className="text-white text-2xl">Loading Full Assessment...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center p-8">
        <div className="container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Cannot Load Assessment</h1>
          <p className="text-white mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (completed && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-4xl"
        >
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Full Assessment Complete! 🎓
          </h1>

          <div className="bg-black/40 rounded-lg p-8 mb-6 text-center">
            <div className="text-white mb-2">Your Total Score</div>
            <div className="text-6xl font-black text-white mb-2">
              {results.combinedScore} / {results.combinedMaxScore}
            </div>
            <div className="text-2xl font-bold text-orange">
              {results.combinedPercentage}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-sm text-orange-light mb-1">Quick Quiz</div>
              <div className="text-2xl font-bold text-white">{results.quickQuizScore} / 30</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center">
              <div className="text-sm text-orange-light mb-1">Full Assessment</div>
              <div className="text-2xl font-bold text-white">{results.fullAssessmentScore} / 195</div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg border-2 border-green-800"
            >
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker py-12 px-4">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={answersForm.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto space-y-8 container-card p-8 bg-gradient-to-br from-orange via-orange-dark to-steel-800"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">Full Bitcoin Assessment</h1>
          <p className="text-white text-lg">
            18 questions remaining. Maximum {195} points available.
          </p>
          <div className="mt-4 bg-black/30 rounded-lg p-4 inline-block">
            <div className="text-sm text-orange-light mb-1">Progress</div>
            <div className="text-2xl font-bold text-white">3 / 21 Questions Complete</div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 bg-black/20 rounded-lg border border-white/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      q.difficulty === 'easy' ? 'bg-green-500 text-black' :
                      q.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
                      'bg-red-500 text-white'
                    }`}>
                      {q.difficulty.toUpperCase()} • {(q as any).pointValue || 1} PTS
                    </span>
                    <span className="text-xs text-orange-light">
                      Question {index + 4} of 21
                    </span>
                  </div>
                  <p className="font-medium text-white">{q.question}</p>
                </div>
              </div>

              <div className="space-y-3">
                {q.options?.map((option: string) => {
                  const optionLetter = option.charAt(0)
                  return (
                    <label
                      key={option}
                      className="flex items-center p-3 bg-white/90 text-black border-2 border-white rounded-lg cursor-pointer hover:border-orange hover:bg-white transition-all"
                    >
                      <input
                        {...answersForm.register(`answers.question${index + 1}`)}
                        type="radio"
                        value={optionLetter}
                        className="mr-3 w-5 h-5 accent-orange"
                      />
                      <span className="font-medium">{option}</span>
                    </label>
                  )
                })}
              </div>

              {answersForm.formState.errors.answers?.['question' + (index + 1) as keyof typeof answersForm.formState.errors.answers] && (
                <p className="text-red-300 text-sm mt-2">
                  {(answersForm.formState.errors.answers as any)['question' + (index + 1)]?.message}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg border-2 border-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Complete Full Assessment'}
        </button>
      </motion.form>
    </div>
  )
}

export default function FullAssessmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center">
        <div className="text-white text-2xl">Loading Full Assessment...</div>
      </div>
    }>
      <FullAssessmentContent />
    </Suspense>
  )
}
