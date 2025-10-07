'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const PartnerSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  businessType: z.string().min(2, 'Business type required'),
  description: z.string().optional(),
  contactName: z.string().min(2, 'Contact name required'),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  region: z.enum(['DC', 'MD', 'VA', 'OTHER']),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  charityRatio: z.number().min(2).max(100),
  bitcoinAddress: z.string().optional(),
  lightningAddress: z.string().optional(),
})

type PartnerFormData = z.infer<typeof PartnerSchema>

export default function PartnerSignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PartnerFormData>({
    resolver: zodResolver(PartnerSchema),
    defaultValues: {
      charityRatio: 5,
      region: 'DC',
    },
  })

  const onSubmit = async (data: PartnerFormData) => {
    setSubmitting(true)

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        alert('Registration failed: ' + result.message)
      }
    } catch (error) {
      alert('Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/20 to-gray-900 text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in joining the No One Will Pay circular economy.
            We will review your application and contact you within 48 hours.
          </p>
          <div className="bg-gray-900/50 border border-gray-700 rounded p-4 mb-6">
            <h3 className="font-bold mb-2">What Happens Next:</h3>
            <ol className="text-left text-sm text-gray-300 space-y-2">
              <li>1. Our team reviews your business details</li>
              <li>2. We verify your information and location</li>
              <li>3. You receive approval email with dashboard access</li>
              <li>4. Create your first mates rates package</li>
              <li>5. Start generating charity items for the community!</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.href = '/marketplace'}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg"
          >
            Browse Marketplace
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#F7931A] via-[#8B5CF6] to-[#10B981] text-transparent bg-clip-text">
            Become a Business Partner
          </h1>
          <p className="text-xl text-gray-300">
            Join the circular economy. Offer mates rates, help the community.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="font-bold mb-2">Increased Sales</h3>
            <p className="text-sm text-gray-300">Reach engaged community members looking for local deals</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold mb-2">Give Back</h3>
            <p className="text-sm text-gray-300">Automatically generate free items for people in need</p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Bitcoin Integration</h3>
            <p className="text-sm text-gray-300">Accept Bitcoin and Lightning payments</p>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Business Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Business Name *</label>
                  <input
                    {...register('businessName')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    placeholder="e.g., Mario's Pizza"
                  />
                  {errors.businessName && <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">Business Type *</label>
                  <select
                    {...register('businessType')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                  >
                    <option value="">Select type...</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Cafe</option>
                    <option value="retail">Retail</option>
                    <option value="service">Service</option>
                    <option value="fitness">Fitness/Wellness</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && <p className="text-red-400 text-sm mt-1">{errors.businessType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    rows={3}
                    placeholder="Tell us about your business..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Region *</label>
                    <select
                      {...register('region')}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                    >
                      <option value="DC">Washington, DC</option>
                      <option value="MD">Maryland</option>
                      <option value="VA">Virginia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Website (optional)</label>
                    <input
                      {...register('websiteUrl')}
                      type="url"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Address *</label>
                  <input
                    {...register('address')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    placeholder="Full business address"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Contact Name *</label>
                  <input
                    {...register('contactName')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    placeholder="Your full name"
                  />
                  {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Email *</label>
                    <input
                      {...register('contactEmail')}
                      type="email"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                      placeholder="email@business.com"
                    />
                    {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Phone *</label>
                    <input
                      {...register('contactPhone')}
                      type="tel"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                      placeholder="(202) 555-0100"
                    />
                    {errors.contactPhone && <p className="text-red-400 text-sm mt-1">{errors.contactPhone.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Charity Settings */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Charity Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Charity Ratio (e.g., 5 = Give 1 free for every 5 sold) *
                  </label>
                  <input
                    {...register('charityRatio', { valueAsNumber: true })}
                    type="number"
                    min="2"
                    max="100"
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lower = more charity generated</p>
                  {errors.charityRatio && <p className="text-red-400 text-sm mt-1">{errors.charityRatio.message}</p>}
                </div>

                <div className="bg-green-900/20 border border-green-700 rounded p-4">
                  <p className="text-sm text-green-300">
                    💚 With a 5:1 ratio, every 5 packages sold automatically generates 1 free item for someone in need.
                    This helps the community while increasing your visibility!
                  </p>
                </div>
              </div>
            </div>

            {/* Bitcoin Payment (Optional) */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Bitcoin Payment (Optional)</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Bitcoin Address</label>
                  <input
                    {...register('bitcoinAddress')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    placeholder="bc1p..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Lightning Address</label>
                  <input
                    {...register('lightningAddress')}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 focus:border-orange-500 outline-none"
                    placeholder="you@getalby.com"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Accept Bitcoin payments directly. Leave blank to use platform defaults.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg text-lg transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to participate in the circular economy and generate charity items based on your ratio.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
