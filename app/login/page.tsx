'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setDevMagicLink(null)

    try {
      const response = await fetch('/api/auth/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSent(true)
        // In development, show the magic link for easy testing
        if (data.devMagicLink) {
          setDevMagicLink(data.devMagicLink)
        }
      } else {
        setErrorMessage(data.error || 'Failed to send magic link')
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show error messages from URL params
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'missing_token':
        return 'Invalid magic link. Please request a new one.'
      case 'invalid_or_expired':
        return 'Magic link has expired or already been used. Please request a new one.'
      case 'user_not_found':
        return 'Account not found. Please complete the survey first.'
      case 'verification_failed':
        return 'Verification failed. Please try again.'
      default:
        return null
    }
  }

  const urlErrorMessage = getErrorMessage(error)

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-orange via-orange-dark to-steel-800 p-6 md:p-8 rounded-lg border-2 border-orange"
        >
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl mb-4">📱</div>
            <h2 className="text-xl md:text-2xl font-bold text-black mb-2">Check Your Phone!</h2>
            <p className="text-sm md:text-base text-white">
              We've sent a magic link to your phone number. Click the link to log in.
            </p>
          </div>

          {devMagicLink && (
            <div className="bg-black/40 rounded-lg p-4 mb-6 border border-orange">
              <p className="text-sm text-orange-light mb-2 font-bold">
                Development Mode - Click to Login:
              </p>
              <a
                href={devMagicLink}
                className="text-sm text-white break-all underline hover:text-orange-light"
              >
                {devMagicLink}
              </a>
            </div>
          )}

          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-white mb-2">Next Steps:</h3>
            <ul className="text-sm text-white space-y-1">
              <li>1. Check your text messages</li>
              <li>2. Click the magic link we sent</li>
              <li>3. You'll be logged in automatically</li>
            </ul>
          </div>

          <p className="text-sm text-center text-gray-300 mb-4">
            The link expires in 10 minutes
          </p>

          <button
            onClick={() => {
              setSent(false)
              setPhone('')
            }}
            className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Send Another Link
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-orange mb-2">Welcome Back</h1>
          <p className="text-sm md:text-base text-gray-400">Log in to access your dashboard</p>
        </div>

        {(urlErrorMessage || errorMessage) && (
          <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm">
              {urlErrorMessage || errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 md:p-8 rounded-lg border border-gray-800">
          <div className="mb-6">
            <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(202) 555-0123"
              required
              minLength={10}
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-black text-white border border-gray-700 rounded-lg focus:border-orange focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the phone number you used to complete the survey
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 md:py-3 text-sm md:text-base bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs md:text-sm text-gray-400 mb-2">
              Don't have an account yet?
            </p>
            <Link
              href="/"
              className="text-sm md:text-base text-orange hover:text-orange-light underline font-semibold"
            >
              Complete the Survey
            </Link>
          </div>
        </form>

        <div className="mt-6 md:mt-8 bg-gray-900 rounded-lg border border-gray-800 p-4 md:p-6">
          <h3 className="text-sm md:text-base font-bold text-white mb-3">How it works:</h3>
          <ol className="text-xs md:text-sm text-gray-400 space-y-2">
            <li>1. Enter your phone number</li>
            <li>2. We'll send you a magic link via SMS</li>
            <li>3. Click the link to log in instantly</li>
            <li>4. No password needed!</li>
          </ol>
        </div>
      </motion.div>
    </div>
  )
}
