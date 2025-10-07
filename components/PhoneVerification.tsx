'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PhoneVerificationProps {
  phone: string
  onVerified: () => void
}

export default function PhoneVerification({ phone, onVerified }: PhoneVerificationProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const sendCode = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (response.ok) {
        setSent(true)
      } else {
        setError('Failed to send code. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })

      if (response.ok) {
        onVerified()
      } else {
        setError('Invalid code. Please try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg border border-gray-800"
    >
      <h3 className="text-xl font-bold mb-4 text-bitcoin">Verify Your Phone Number</h3>

      <p className="text-gray-400 mb-4">
        To confirm you're in the DMV area, we'll send a verification code to:
      </p>

      <p className="text-lg font-mono mb-6">{phone}</p>

      {!sent ? (
        <button
          onClick={sendCode}
          disabled={loading}
          className="w-full py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter 6-digit code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none text-center text-2xl tracking-widest font-mono"
              maxLength={6}
            />
          </div>

          <button
            onClick={verifyCode}
            disabled={code.length !== 6 || loading}
            className="w-full py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            onClick={sendCode}
            disabled={loading}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Resend Code
          </button>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}

      <div className="mt-6 p-4 bg-gray-950 rounded border border-gray-800">
        <p className="text-xs text-gray-500">
          📍 <strong>Why verify?</strong> This helps us track DMV participation and ensure fair distribution of resources to local community members.
        </p>
      </div>
    </motion.div>
  )
}
