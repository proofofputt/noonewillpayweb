'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getRandomQuestions, type ScoredQuestion } from '@/lib/questions'
import { detectRegionFromPhone, getRegionName, type RegionCode } from '@/lib/phone-validation'

const answersSchema = z.object({
  answers: z.object({
    question1: z.string().min(1, 'Answer is required'),
    question2: z.string().min(1, 'Answer is required'),
    question3: z.string().min(1, 'Answer is required'),
  }),
})

const contactSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  onCamera: z.boolean(),
  newsletter: z.boolean(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy to continue'
  }),
})

type AnswersFormData = z.infer<typeof answersSchema>
type ContactFormData = z.infer<typeof contactSchema>

export default function SurveyForm() {
  const searchParams = useSearchParams()
  const referralCode = searchParams?.get('ref')

  const [questions, setQuestions] = useState<any[]>([])
  const [answersSubmitted, setAnswersSubmitted] = useState(false)
  const [surveyAnswers, setSurveyAnswers] = useState<AnswersFormData | null>(null)
  const [finalSubmitted, setFinalSubmitted] = useState(false)
  const [noThanks, setNoThanks] = useState(false)
  const [detectedRegion, setDetectedRegion] = useState<RegionCode | null>(null)
  const [results, setResults] = useState<{
    score: number
    maxScore: number
    percentage: number
    referralCode: string
    scoredQuestions: ScoredQuestion[]
  } | null>(null)

  const answersForm = useForm<AnswersFormData>({
    resolver: zodResolver(answersSchema),
  })

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      onCamera: false,
      newsletter: true,
      agreeToTerms: false,
    }
  })

  useEffect(() => {
    // Get 3 random questions (1 from each difficulty level)
    setQuestions(getRandomQuestions())
  }, [])

  const onAnswersSubmit = (data: AnswersFormData) => {
    setSurveyAnswers(data)
    setAnswersSubmitted(true)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value
    const region = detectRegionFromPhone(phone)
    setDetectedRegion(region)
  }

  const onContactSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          answers: surveyAnswers?.answers,
          questions: questions.map((q, i) => ({
            id: q.id,
            question: q.question,
            answer: surveyAnswers?.answers[`question${i + 1}` as keyof typeof surveyAnswers.answers]
          })),
          referredBy: referralCode || undefined,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const resultData = await response.json()
        setResults({
          score: resultData.score,
          maxScore: resultData.maxScore,
          percentage: resultData.percentage,
          referralCode: resultData.referralCode,
          scoredQuestions: resultData.scoredQuestions
        })
        setFinalSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
    }
  }

  const handleNoThanks = () => {
    setNoThanks(true)
  }

  if (noThanks) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-6 text-black">Thanks for helping us measure common knowledge</h2>
      </motion.div>
    )
  }

  if (finalSubmitted && results) {
    const referralUrl = `${window.location.origin}/?ref=${results.referralCode}`

    const copyReferralLink = () => {
      navigator.clipboard.writeText(referralUrl)
      alert('Referral link copied! Share it to earn 50 points per signup.')
    }

    const shareViaSMS = () => {
      const message = encodeURIComponent(`I just took this Bitcoin Common Knowledge quiz! Take it yourself: ${referralUrl}`)
      window.location.href = `sms:?&body=${message}`
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-8 container-card p-8 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-4xl mx-auto space-y-6"
      >
        {/* Score Display */}
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-2 text-black">Your Score</h2>
          <div className="text-7xl font-black text-white mb-2">
            {results.score} / {results.maxScore}
          </div>
          <div className="text-3xl font-bold text-black">
            {results.percentage}%
          </div>
        </div>

        {/* Answer Explanations */}
        <div className="bg-black/30 rounded-lg p-6 border border-white/40">
          <h3 className="text-2xl font-bold mb-4 text-white">Answer Breakdown</h3>
          <p className="text-sm text-orange-light mb-4">
            ⚠️ Please don't share these answers online to preserve the longevity of this Common Knowledge Research project.
          </p>
          <div className="space-y-4">
            {results.scoredQuestions.map((q, idx) => (
              <div key={q.id} className={`p-4 rounded-lg border-2 ${
                q.isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-white flex-1">Q{idx + 1}: {q.question}</p>
                  <span className={`px-3 py-1 rounded font-bold ${
                    q.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {q.isCorrect ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  Your answer: <strong>{q.userAnswer}</strong>
                  {!q.isCorrect && q.correctOption && (
                    <span className="ml-2 text-green-400">
                      (Correct: {q.correctOption})
                    </span>
                  )}
                </p>
                {(q as any).explanation && (
                  <p className="text-sm text-white bg-black/30 p-3 rounded mt-2">
                    💡 {(q as any).explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Full Assessment CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-center border-2 border-purple-400">
          <div className="text-4xl mb-2">🎓</div>
          <h3 className="text-3xl font-bold text-white mb-3">Unlock Full Assessment</h3>
          <p className="text-white text-lg mb-2">You've completed 3 of 21 questions!</p>
          <div className="bg-white/20 rounded-lg p-4 mb-4 inline-block">
            <div className="text-sm text-purple-200 mb-1">Potential Earnings</div>
            <div className="text-4xl font-black text-white">195 Points</div>
            <div className="text-sm text-purple-200 mt-1">From 18 remaining questions</div>
          </div>
          <p className="text-white mb-4">
            Complete the full assessment to earn maximum allocation points and deepen your Bitcoin knowledge!
          </p>
          <Link
            href={`/full-assessment?ref=${results.referralCode}`}
            className="inline-block px-8 py-4 bg-white text-purple-700 font-bold text-xl rounded-lg hover:bg-gray-100 transition-colors shadow-lg border-2 border-purple-300"
          >
            Start Full Assessment →
          </Link>
        </div>

        {/* Referral Section */}
        <div className="bg-black/40 rounded-lg p-6 border-2 border-orange">
          <h3 className="text-2xl font-bold text-white mb-3 text-center">
            🎁 Share & Earn 50 Points Per Signup
          </h3>
          <p className="text-white text-center mb-4">
            Your unique referral link:
          </p>
          <div className="bg-white rounded-lg p-4 mb-4 break-all text-center">
            <code className="text-sm font-mono text-black">{referralUrl}</code>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors border-2 border-orange-darker"
            >
              📋 Copy Link
            </button>
            <button
              onClick={shareViaSMS}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors border-2 border-green-800"
            >
              💬 Text to Friend
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-black/20 rounded-lg p-6 border border-white/30">
          <h3 className="font-bold mb-3 text-white text-xl">Next Steps:</h3>
          <ul className="text-left text-sm text-white space-y-2">
            <li>✓ Check your email for welcome message</li>
            <li>✓ Complete the Full Assessment to earn 195 more points</li>
            <li>✓ Share your referral link to earn 21 points per signup</li>
            <li>✓ Set up your Xverse wallet</li>
            <li>✓ Access the GitBook education platform</li>
            <li>✓ Join the Bitcoin community</li>
          </ul>
        </div>
      </motion.div>
    )
  }

  // Show contact form after answers are submitted
  if (answersSubmitted) {
    return (
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={contactForm.handleSubmit(onContactSubmit)}
        className="max-w-3xl mx-auto space-y-8 container-card p-8 bg-gradient-to-br from-orange via-orange-dark to-steel-800"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-black">Sign Up For Score and Resources</h2>
        </div>

        {/* Contact Information */}
        <div className="space-y-6 p-6 bg-black/20 rounded-lg border border-white/30">

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              {...contactForm.register('phone', {
                onChange: handlePhoneChange
              })}
              type="tel"
              className="w-full px-4 py-2 bg-white/90 text-black border border-white rounded-lg focus:border-orange focus:outline-none"
              placeholder="(202) 555-0123"
            />
            {contactForm.formState.errors.phone && (
              <p className="text-red-300 text-sm mt-1">{contactForm.formState.errors.phone.message}</p>
            )}
            {detectedRegion && (
              <p className="text-sm mt-2 text-orange-light">
                📍 Detected Region: <strong>{getRegionName(detectedRegion)}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Email <span className="text-gray-400 text-xs">(Optional - subscribe to newsletter)</span>
            </label>
            <input
              {...contactForm.register('email')}
              type="email"
              className="w-full px-4 py-2 bg-white/90 text-black border border-white rounded-lg focus:border-orange focus:outline-none"
              placeholder="satoshi@example.com"
            />
            {contactForm.formState.errors.email && (
              <p className="text-red-300 text-sm mt-1">{contactForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...contactForm.register('onCamera')}
              type="checkbox"
              className="mr-2 w-4 h-4"
            />
            <label className="text-sm text-white">I consent to being recorded on camera (Photo / Video Release Waiver)</label>
          </div>
        </div>

        {/* Terms and Privacy Policy Consent */}
        <div className="p-6 bg-black/30 rounded-lg border border-white/40">
          <div className="flex items-start mb-2">
            <input
              {...contactForm.register('agreeToTerms')}
              type="checkbox"
              className="mr-3 w-5 h-5 mt-1 flex-shrink-0"
            />
            <label className="text-sm text-white leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" target="_blank" className="text-orange hover:text-orange-light underline font-semibold">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" target="_blank" className="text-orange hover:text-orange-light underline font-semibold">
                Privacy Policy
              </Link>
              , including the collection of my IP address for fraud prevention and the use of my data as described.
            </label>
          </div>
          {contactForm.formState.errors.agreeToTerms && (
            <p className="text-red-300 text-sm mt-2 ml-8">{contactForm.formState.errors.agreeToTerms.message}</p>
          )}
          <div className="mt-4 text-xs text-gray-300 ml-8">
            <p className="mb-1">By submitting this survey:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your IP address will be collected to prevent duplicate submissions</li>
              <li>Your responses and contact info will be used for research and education</li>
              <li>You may receive allocation points based on your performance</li>
              <li>If you consent to camera recording, your image may be used publicly</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleNoThanks}
            className="w-1/4 py-4 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-colors shadow-lg border-2 border-red-800"
          >
            No thanks
          </button>
          <button
            type="submit"
            className="flex-1 py-4 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors shadow-lg border-2 border-green-800"
          >
            Complete Sign Up
          </button>
        </div>
      </motion.form>
    )
  }

  // Show questions form first
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={answersForm.handleSubmit(onAnswersSubmit)}
      className="max-w-3xl mx-auto space-y-8 container-card p-8 bg-gradient-to-br from-orange via-orange-dark to-steel-800"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-black">Common Knowledge Survey</h2>
        <p className="text-white">
          Three things that aught to be, but often are not known.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-6 bg-black/20 rounded-lg border border-white/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  q.difficulty === 'easy' ? 'bg-green-500 text-black' :
                  q.difficulty === 'medium' ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                }`}>
                  {q.difficulty.toUpperCase()}
                </span>
                <p className="mt-2 font-medium text-white">{q.question}</p>
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
                      {...answersForm.register(`answers.question${index + 1}` as 'answers.question1' | 'answers.question2' | 'answers.question3')}
                      type="radio"
                      value={optionLetter}
                      className="mr-3 w-5 h-5 accent-orange"
                    />
                    <span className="font-medium">{option}</span>
                  </label>
                )
              })}
            </div>

            {answersForm.formState.errors.answers?.['question1'] && index === 0 && (
              <p className="text-red-500 text-sm mt-1">{answersForm.formState.errors.answers.question1.message}</p>
            )}
            {answersForm.formState.errors.answers?.['question2'] && index === 1 && (
              <p className="text-red-500 text-sm mt-1">{answersForm.formState.errors.answers.question2.message}</p>
            )}
            {answersForm.formState.errors.answers?.['question3'] && index === 2 && (
              <p className="text-red-500 text-sm mt-1">{answersForm.formState.errors.answers.question3.message}</p>
            )}
          </motion.div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-orange text-white font-bold text-lg rounded-lg hover:bg-orange-dark transition-colors shadow-lg border-2 border-orange-darker"
      >
        Submit Survey
      </button>
    </motion.form>
  )
}
