'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getRandomQuestions } from '@/lib/questions'

const answersSchema = z.object({
  answers: z.object({
    question1: z.string().min(1, 'Answer is required'),
    question2: z.string().min(1, 'Answer is required'),
    question3: z.string().min(1, 'Answer is required'),
  }),
})

const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  region: z.enum(['DC', 'MD', 'VA', 'OTHER'], {
    required_error: 'Please select your region'
  }),
  onCamera: z.boolean(),
  newsletter: z.boolean(),
})

type AnswersFormData = z.infer<typeof answersSchema>
type ContactFormData = z.infer<typeof contactSchema>

export default function SurveyForm() {
  const [questions, setQuestions] = useState<any[]>([])
  const [answersSubmitted, setAnswersSubmitted] = useState(false)
  const [surveyAnswers, setSurveyAnswers] = useState<AnswersFormData | null>(null)
  const [finalSubmitted, setFinalSubmitted] = useState(false)
  const [noThanks, setNoThanks] = useState(false)

  const answersForm = useForm<AnswersFormData>({
    resolver: zodResolver(answersSchema),
  })

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      onCamera: false,
      newsletter: true,
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
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
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

  if (finalSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-6 text-black">Thank You!</h2>
        <p className="text-xl text-white mb-4">
          Your survey has been submitted successfully.
        </p>
        <p className="text-gray-200 mb-8">
          Check your email for the welcome sequence and GitBook access.
        </p>
        <div className="space-y-4">
          <div className="p-6 bg-black/20 rounded-lg border border-orange max-w-md mx-auto">
            <h3 className="font-bold mb-3 text-white">Next Steps:</h3>
            <ul className="text-left text-sm text-white space-y-2">
              <li>✓ Check your email for welcome message</li>
              <li>✓ Set up your Xverse wallet</li>
              <li>✓ Access the GitBook education platform</li>
              <li>✓ Join the Bitcoin community</li>
            </ul>
          </div>
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
            <label className="block text-sm font-medium mb-2 text-white">Email</label>
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

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Phone Number</label>
            <input
              {...contactForm.register('phone')}
              type="tel"
              className="w-full px-4 py-2 bg-white/90 text-black border border-white rounded-lg focus:border-orange focus:outline-none"
              placeholder="(202) 555-0123"
            />
            {contactForm.formState.errors.phone && (
              <p className="text-red-300 text-sm mt-1">{contactForm.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Region</label>
            <select
              {...contactForm.register('region')}
              className="w-full px-4 py-2 bg-white/90 text-black border border-white rounded-lg focus:border-orange focus:outline-none"
            >
              <option value="">Select your region</option>
              <option value="DC">Washington, DC</option>
              <option value="MD">Maryland</option>
              <option value="VA">Virginia</option>
              <option value="OTHER">Tourist/Transplant</option>
            </select>
            {contactForm.formState.errors.region && (
              <p className="text-red-300 text-sm mt-1">{contactForm.formState.errors.region.message}</p>
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
