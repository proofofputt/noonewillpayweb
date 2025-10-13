'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Pizzeria {
  id: string
  name: string
  address: string
  city: string
  state: string
}

export default function CreateDealPage() {
  const router = useRouter()

  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([])
  const [loadingPizzerias, setLoadingPizzerias] = useState(true)

  const [formData, setFormData] = useState({
    pizzeriaId: '',
    title: '',
    description: '',
    discountPercent: '',
    deadline: '',
    maxParticipants: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserPizzerias()
  }, [])

  async function fetchUserPizzerias() {
    try {
      const response = await fetch('/api/pizza-bank/pizzerias/my-pizzerias')
      if (!response.ok) {
        throw new Error('Failed to load your pizzerias')
      }
      const data = await response.json()
      setPizzerias(data.pizzerias || [])

      // Auto-select if only one pizzeria
      if (data.pizzerias && data.pizzerias.length === 1) {
        setFormData(prev => ({ ...prev, pizzeriaId: data.pizzerias[0].id }))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingPizzerias(false)
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.pizzeriaId || !formData.title || !formData.description || !formData.discountPercent || !formData.deadline) {
        throw new Error('Please fill in all required fields')
      }

      // Validate discount
      const discount = parseFloat(formData.discountPercent)
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        throw new Error('Discount must be between 1 and 100%')
      }

      // Validate deadline
      const deadlineDate = new Date(formData.deadline)
      if (deadlineDate <= new Date()) {
        throw new Error('Deadline must be in the future')
      }

      // Build request body
      const requestBody: any = {
        pizzeriaId: formData.pizzeriaId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        discountPercent: discount,
        deadline: formData.deadline,
        targetAmount: 0, // Not used for promotional deals
      }

      if (formData.maxParticipants) {
        requestBody.maxParticipants = parseInt(formData.maxParticipants)
      }

      const response = await fetch('/api/pizza-bank/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create deal')
      }

      const { deal } = await response.json()

      // Redirect to the new deal
      router.push(`/pizza-bank/deals/${deal.id}`)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const getTodayString = () => {
    const today = new Date()
    today.setDate(today.getDate() + 1) // Minimum deadline is tomorrow
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (loadingPizzerias) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (pizzerias.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🍕</div>
          <h1 className="text-2xl font-bold mb-4">No Pizzerias Found</h1>
          <p className="text-gray-400 mb-6">
            You need to register a pizzeria before you can create deals.
          </p>
          <Link
            href="/pizza-bank/pizzerias/new"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
          >
            Register Pizzeria
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pizza-bank/deals"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Deals
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create Promotional Deal</h1>
          <p className="text-gray-400">
            Offer special discounts to attract more customers!
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 space-y-6"
        >
          {/* Pizzeria Selection */}
          <div>
            <label htmlFor="pizzeriaId" className="block text-sm font-semibold text-gray-300 mb-2">
              Pizzeria <span className="text-red-400">*</span>
            </label>
            <select
              id="pizzeriaId"
              name="pizzeriaId"
              value={formData.pizzeriaId}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Select a pizzeria</option>
              {pizzerias.map(pizzeria => (
                <option key={pizzeria.id} value={pizzeria.id}>
                  {pizzeria.name} - {pizzeria.city}, {pizzeria.state}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
              Deal Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="e.g., Weekend Special - Save 25%!"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              maxLength={2000}
              placeholder="Describe your deal, terms & conditions, and any restrictions..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
            />
            <div className="text-sm text-gray-400 mt-1">
              {formData.description.length}/2000 characters
            </div>
          </div>

          {/* Discount and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountPercent" className="block text-sm font-semibold text-gray-300 mb-2">
                Discount % <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="discountPercent"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                required
                min="1"
                max="100"
                step="1"
                placeholder="e.g., 25"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              <div className="text-sm text-gray-400 mt-1">
                How much to discount (1-100%)
              </div>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-semibold text-gray-300 mb-2">
                Valid Until <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                min={getTodayString()}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-semibold text-gray-300 mb-2">
              Maximum Redemptions (Optional)
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              max="10000"
              placeholder="Leave blank for unlimited"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <div className="text-sm text-gray-400 mt-1">
              Limit how many customers can use this deal
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-semibold text-blue-400 mb-1">
                  Deal Best Practices
                </div>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Clear titles attract more customers</li>
                  <li>• Include any restrictions in the description</li>
                  <li>• Limit redemptions to create urgency</li>
                  <li>• Weekend/evening deals tend to perform best</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Deal...' : 'Create Deal'}
            </motion.button>

            <Link
              href="/pizza-bank/deals"
              className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
