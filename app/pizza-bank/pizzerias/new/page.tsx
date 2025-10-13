'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

type OnboardingStep = 'info' | 'payment' | 'api' | 'complete'

interface FormData {
  name: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  acceptsBitcoin: boolean
  acceptsLightning: boolean
  lightningAddress: string
  bitcoinAddress: string
  acceptsFiat: boolean
  posSystem: string
}

function NewPizzeriaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [referrerName, setReferrerName] = useState('')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    acceptsBitcoin: false,
    acceptsLightning: false,
    lightningAddress: '',
    bitcoinAddress: '',
    acceptsFiat: false,
    posSystem: '',
  })

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setReferralCode(ref)
      // Optionally fetch referrer name to personalize
      fetchReferrerInfo(ref)
    }
  }, [searchParams])

  const fetchReferrerInfo = async (code: string) => {
    try {
      const response = await fetch(`/api/referral-info?code=${code}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setReferrerName(data.username)
        }
      }
    } catch (err) {
      console.error('Error fetching referrer:', err)
    }
  }

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!formData.name || !formData.address || !formData.city) {
        setError('Name, address, and city are required')
        return
      }

      if (!formData.acceptsBitcoin && !formData.acceptsLightning && !formData.acceptsFiat) {
        setError('Please select at least one payment method')
        return
      }

      const response = await fetch('/api/pizza-bank/pizzerias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep('complete')
      } else {
        setError(data.error || 'Failed to register pizzeria')
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'info':
        return <BusinessInfoStep formData={formData} updateField={updateField} onNext={() => setStep('payment')} />
      case 'payment':
        return <PaymentSetupStep formData={formData} updateField={updateField} onBack={() => setStep('info')} onNext={() => setStep('api')} />
      case 'api':
        return <APIIntegrationStep formData={formData} updateField={updateField} onBack={() => setStep('payment')} onSubmit={handleSubmit} loading={loading} />
      case 'complete':
        return <CompleteStep />
    }
  }

  const stepProgress = {
    info: 33,
    payment: 66,
    api: 100,
    complete: 100,
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pizza-bank/pizzerias"
            className="text-orange hover:text-orange-light transition-colors mb-4 inline-block"
          >
            ← Back to Directory
          </Link>

          <h1 className="text-5xl font-bold text-bitcoin mb-2">
            Register Your Pizzeria
          </h1>
          <p className="text-xl text-gray-400">
            Join the Pizza Bank network and start accepting orders
          </p>

          {referrerName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg"
            >
              <p className="text-green-300">
                🎉 Referred by <span className="font-bold">{referrerName}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        {step !== 'complete' && (
          <div className="mb-8">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress[step]}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-orange to-bitcoin"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step === 'info' ? 'text-orange font-bold' : 'text-gray-500'}>
                1. Business Info
              </span>
              <span className={step === 'payment' ? 'text-orange font-bold' : 'text-gray-500'}>
                2. Payment Setup
              </span>
              <span className={step === 'api' ? 'text-orange font-bold' : 'text-gray-500'}>
                3. API Integration
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Step 1: Business Info
function BusinessInfoStep({
  formData,
  updateField,
  onNext,
}: {
  formData: FormData
  updateField: (field: keyof FormData, value: any) => void
  onNext: () => void
}) {
  return (
    <motion.div
      key="info"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-900 rounded-lg border border-gray-800 p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-white">Business Information</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Pizzeria Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
            placeholder="Joe's Pizza"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
            placeholder="Family-owned pizzeria serving authentic New York-style pizza..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => updateField('state', e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => updateField('zipCode', e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
              placeholder="info@joespizza.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateField('website', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
            placeholder="https://joespizza.com"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!formData.name || !formData.address || !formData.city}
          className="px-8 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Payment Setup →
        </button>
      </div>
    </motion.div>
  )
}

// Step 2: Payment Setup
function PaymentSetupStep({
  formData,
  updateField,
  onBack,
  onNext,
}: {
  formData: FormData
  updateField: (field: keyof FormData, value: any) => void
  onBack: () => void
  onNext: () => void
}) {
  const hasPaymentMethod = formData.acceptsBitcoin || formData.acceptsLightning || formData.acceptsFiat

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-900 rounded-lg border border-gray-800 p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-white">Payment Setup</h2>
      <p className="text-gray-400 mb-8">
        Choose which payment methods your pizzeria will accept. We recommend Bitcoin & Lightning for instant, low-fee transactions.
      </p>

      <div className="space-y-6">
        {/* Bitcoin */}
        <div className="border border-gray-700 rounded-lg p-6 hover:border-orange transition-colors">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={formData.acceptsBitcoin}
              onChange={(e) => updateField('acceptsBitcoin', e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange mb-2">₿ Bitcoin (On-chain)</h3>
              <p className="text-sm text-gray-400 mb-4">
                Accept Bitcoin payments directly to your wallet. Best for larger orders. ~10 minute confirmation.
              </p>
              {formData.acceptsBitcoin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Bitcoin Address
                  </label>
                  <input
                    type="text"
                    value={formData.bitcoinAddress}
                    onChange={(e) => updateField('bitcoinAddress', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-orange focus:outline-none"
                    placeholder="bc1q..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Use a watch-only wallet or BTCPay Server for automatic order confirmation
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Lightning */}
        <div className="border border-gray-700 rounded-lg p-6 hover:border-yellow-600 transition-colors">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={formData.acceptsLightning}
              onChange={(e) => updateField('acceptsLightning', e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">⚡ Lightning Network</h3>
              <p className="text-sm text-gray-400 mb-4">
                Instant Bitcoin payments with near-zero fees. Recommended for all order sizes.
              </p>
              {formData.acceptsLightning && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Lightning Address
                  </label>
                  <input
                    type="text"
                    value={formData.lightningAddress}
                    onChange={(e) => updateField('lightningAddress', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-yellow-600 focus:outline-none"
                    placeholder="you@getalby.com or LNURL"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Get a free Lightning address from Alby, Strike, or Wallet of Satoshi
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Fiat */}
        <div className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={formData.acceptsFiat}
              onChange={(e) => updateField('acceptsFiat', e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">💳 Fiat (Credit/Debit Cards)</h3>
              <p className="text-sm text-gray-400 mb-4">
                Traditional payment processing via Stripe, Square, or your existing processor.
              </p>
              {formData.acceptsFiat && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <p className="text-sm text-gray-400">
                    Fiat payments will be processed through the Pizza Bank payment gateway. API integration required (next step).
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!hasPaymentMethod}
          className="px-8 py-3 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: API Integration →
        </button>
      </div>
    </motion.div>
  )
}

// Step 3: API Integration
function APIIntegrationStep({
  formData,
  updateField,
  onBack,
  onSubmit,
  loading,
}: {
  formData: FormData
  updateField: (field: keyof FormData, value: any) => void
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <motion.div
      key="api"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-gray-900 rounded-lg border border-gray-800 p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-white">API Integration (Optional)</h2>
      <p className="text-gray-400 mb-8">
        Connect your POS system for automated order fulfillment. You can skip this and set it up later from your dashboard.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            POS System
          </label>
          <select
            value={formData.posSystem}
            onChange={(e) => updateField('posSystem', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-orange focus:outline-none"
          >
            <option value="">Select your POS system (optional)</option>
            <option value="Toast">Toast</option>
            <option value="Square">Square</option>
            <option value="Clover">Clover</option>
            <option value="Lightspeed">Lightspeed</option>
            <option value="Revel">Revel</option>
            <option value="Custom">Custom / Other</option>
            <option value="None">None (Manual fulfillment)</option>
          </select>
        </div>

        {formData.posSystem && formData.posSystem !== 'None' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-900/20 border border-blue-700 rounded-lg p-6"
          >
            <h4 className="text-lg font-bold text-blue-300 mb-3">📘 Integration Guide</h4>
            <p className="text-sm text-gray-300 mb-4">
              After registration, you'll receive detailed API documentation for integrating with {formData.posSystem}.
              This includes:
            </p>
            <ul className="text-sm text-gray-300 space-y-2 ml-6">
              <li>• API key and webhook setup</li>
              <li>• Order payload structure</li>
              <li>• Status update callbacks</li>
              <li>• Testing environment access</li>
            </ul>
          </motion.div>
        )}

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-bold text-white mb-3">What happens next?</h4>
          <ol className="text-sm text-gray-300 space-y-2">
            <li className="flex gap-3">
              <span className="font-bold text-orange">1.</span>
              <span>Your pizzeria will be submitted for review</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange">2.</span>
              <span>Admin will verify your business (usually within 24 hours)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange">3.</span>
              <span>You'll receive API credentials and integration docs via email</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange">4.</span>
              <span>Your pizzeria will appear on the Pizza Radar map!</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            '✓ Complete Registration'
          )}
        </button>
      </div>
    </motion.div>
  )
}

// Step 4: Complete
function CompleteStep() {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg border-2 border-green-600 p-12 text-center"
    >
      <div className="text-7xl mb-6">🎉</div>
      <h2 className="text-4xl font-bold mb-4 text-white">Registration Complete!</h2>
      <p className="text-xl text-gray-300 mb-8">
        Your pizzeria has been submitted for review. You'll receive a confirmation email within 24 hours.
      </p>

      <div className="bg-black/40 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-4">Next Steps:</h3>
        <ol className="text-left text-gray-300 space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-green-400">1.</span>
            <span>Check your email for verification link</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-400">2.</span>
            <span>Complete payment processor setup</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-400">3.</span>
            <span>Review API documentation</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-green-400">4.</span>
            <span>Start accepting orders!</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/pizza-bank/pizzerias"
          className="px-8 py-4 bg-orange text-black font-bold rounded-lg hover:bg-orange-dark transition-colors"
        >
          Browse Pizzerias
        </Link>
        <Link
          href="/pizza-bank"
          className="px-8 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Pizza Bank
        </Link>
      </div>
    </motion.div>
  )
}

export default function NewPizzeriaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading registration...</div>
        </div>
      </div>
    }>
      <NewPizzeriaContent />
    </Suspense>
  )
}
