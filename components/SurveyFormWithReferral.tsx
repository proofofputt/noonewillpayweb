'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getRandomQuestions } from '@/lib/questions'
import { useSearchParams } from 'next/navigation'

const surveySchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  region: z.enum(['DC', 'MD', 'VA', 'OTHER'], {
    required_error: 'Please select your region'
  }),
  onCamera: z.boolean(),
  answers: z.object({
    question1: z.string().min(1, 'Answer is required'),
    question2: z.string().min(1, 'Answer is required'),
    question3: z.string().min(1, 'Answer is required'),
  }),
  newsletter: z.boolean(),
  createAccount: z.boolean(),
  username: z.string().optional(),
  password: z.string().optional(),
})

type SurveyFormData = z.infer<typeof surveySchema>

export default function SurveyFormWithReferral() {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref')

  const [questions, setQuestions] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [userReferralCode, setUserReferralCode] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      onCamera: false,
      newsletter: true,
      createAccount: true,
    }
  })

  const createAccount = watch('createAccount')

  useEffect(() => {
    setQuestions(getRandomQuestions())
  }, [])

  const onSubmit = async (data: SurveyFormData) => {
    try {
      // Calculate score
      const score = questions.reduce((total, q, i) => {
        const answer = data.answers[`question${i + 1}` as keyof typeof data.answers]
        // Simplified - in production, validate against correct answer
        return total + 100
      }, 0)

      const submission = {
        ...data,
        questions: questions.map((q, i) => ({
          id: q.id,
          question: q.question,
          answer: data.answers[`question${i + 1}` as keyof typeof data.answers],
          difficulty: q.difficulty,
        })),
        score,
        referredByCode: referralCode,
        timestamp: new Date().toISOString(),
      }

      // Submit survey
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })

      if (response.ok) {
        const result = await response.json()

        // If creating account, sign up
        if (data.createAccount && data.username && data.password) {
          const signupResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              username: data.username,
              password: data.password,
              referredByCode: referralCode,
            }),
          })

          if (signupResponse.ok) {
            const signupResult = await signupResponse.json()
            setUserReferralCode(signupResult.user.referralCode)
          }
        }

        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 max-w-2xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-6 text-bitcoin">Thank You!</h2>
        <p className="text-xl text-gray-300 mb-4">
          Your survey has been submitted successfully.
        </p>

        {referralCode && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-green-400">
              ✓ You were referred by code: <span className="font-mono font-bold">{referralCode}</span>
            </p>
            <p className="text-sm text-green-600 mt-1">
              Your referrer will receive bonus points!
            </p>
          </div>
        )}

        {userReferralCode && (
          <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-bitcoin">
            <h3 className="text-xl font-bold mb-3 text-bitcoin">Your Referral Code</h3>
            <div className="text-3xl font-bold font-mono mb-3">{userReferralCode}</div>
            <p className="text-sm text-gray-400 mb-4">
              Share this code to earn 50 points for each referral!
            </p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors"
            >
              Go to Dashboard →
            </a>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 max-w-md mx-auto">
            <h3 className="font-bold mb-2">Next Steps:</h3>
            <ul className="text-left text-sm text-gray-400 space-y-2">
              <li>✓ Check your email for welcome message</li>
              <li>✓ Set up your Xverse wallet</li>
              <li>✓ Access the GitBook education platform</li>
              <li>✓ Join the DMV Bitcoin community</li>
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Bitcoin Knowledge Survey</h2>
        <p className="text-gray-400">
          Answer 3 questions to join the DMV Bitcoin education community
        </p>
        {referralCode && (
          <div className="mt-4 p-3 bg-ordinal/20 border border-ordinal rounded-lg inline-block">
            <span className="text-sm text-ordinal">
              🎁 Referred by: <span className="font-mono font-bold">{referralCode}</span>
            </span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-6 p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h3 className="text-xl font-bold text-bitcoin">Contact Information</h3>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none"
            placeholder="satoshi@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number (for DMV verification)</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none"
            placeholder="(202) 555-0123"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Region</label>
          <select
            {...register('region')}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none"
          >
            <option value="">Select your region</option>
            <option value="DC">Washington, DC</option>
            <option value="MD">Maryland</option>
            <option value="VA">Virginia</option>
            <option value="OTHER">Tourist/Transplant</option>
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-ordinal">Your Questions</h3>

        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="p-6 bg-gray-900 rounded-lg border border-gray-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className={`text-xs px-2 py-1 rounded ${
                  q.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                  q.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {q.difficulty.toUpperCase()}
                </span>
                <p className="mt-2 font-medium">{q.question}</p>
                {q.hint && (
                  <p className="text-sm text-gray-500 mt-1">💡 {q.hint}</p>
                )}
              </div>
            </div>
            <input
              {...register(`answers.question${index + 1}` as 'answers.question1' | 'answers.question2' | 'answers.question3')}
              type="text"
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-ordinal focus:outline-none"
              placeholder="Your answer (numbers only)"
            />
            {errors.answers?.['question1'] && index === 0 && (
              <p className="text-red-500 text-sm mt-1">{errors.answers.question1.message}</p>
            )}
            {errors.answers?.['question2'] && index === 1 && (
              <p className="text-red-500 text-sm mt-1">{errors.answers.question2.message}</p>
            )}
            {errors.answers?.['question3'] && index === 2 && (
              <p className="text-red-500 text-sm mt-1">{errors.answers.question3.message}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Account Creation */}
      <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center mb-4">
          <input
            {...register('createAccount')}
            type="checkbox"
            className="mr-2 w-4 h-4"
          />
          <label className="text-sm font-medium">
            Create an account to track referrals and earn allocation points
          </label>
        </div>

        {createAccount && (
          <div className="space-y-4 mt-4 pl-6 border-l-2 border-bitcoin">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                {...register('username')}
                type="text"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none"
                placeholder="Create a password"
              />
            </div>
            <div className="text-xs text-gray-500">
              Get your unique referral code and earn 50 points for each person who completes the survey!
            </div>
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-start gap-3">
          <input
            {...register('newsletter')}
            type="checkbox"
            className="mt-1 w-4 h-4"
          />
          <div>
            <label className="text-sm font-medium">
              Subscribe to our newsletter for Bitcoin education updates and circular economy offers
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Learn about Ordinals, Runes, and local Bitcoin events
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-bitcoin text-black font-bold text-lg rounded-lg hover:bg-orange-500 transition-colors"
      >
        Submit Survey & {createAccount ? 'Create Account' : 'Continue'}
      </button>
    </motion.form>
  )
}
