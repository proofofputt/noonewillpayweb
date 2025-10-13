'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Pizzeria {
  id: string
  name: string
  city: string
  state: string
}

export default function NewPostPage() {
  const router = useRouter()

  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([])
  const [loadingPizzerias, setLoadingPizzerias] = useState(false)

  const [formData, setFormData] = useState({
    content: '',
    pizzeriaId: '',
    rating: 0,
    imageUrls: [] as string[],
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [showPizzeriaSearch, setShowPizzeriaSearch] = useState(false)
  const [pizzeriaSearch, setPizzeriaSearch] = useState('')

  useEffect(() => {
    if (showPizzeriaSearch && pizzerias.length === 0) {
      fetchPizzerias()
    }
  }, [showPizzeriaSearch])

  async function fetchPizzerias() {
    try {
      setLoadingPizzerias(true)
      const response = await fetch('/api/pizza-bank/pizzerias?limit=100')
      if (response.ok) {
        const data = await response.json()
        setPizzerias(data.pizzerias || [])
      }
    } catch (err) {
      console.error('Failed to fetch pizzerias:', err)
    } finally {
      setLoadingPizzerias(false)
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleRatingClick(rating: number) {
    setFormData(prev => ({ ...prev, rating: prev.rating === rating ? 0 : rating }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!formData.content.trim()) {
        throw new Error('Please write something to share!')
      }

      if (formData.content.length > 5000) {
        throw new Error('Post must be 5000 characters or less')
      }

      const requestBody: any = {
        content: formData.content.trim(),
      }

      if (formData.pizzeriaId) {
        requestBody.pizzeriaId = formData.pizzeriaId
      }

      if (formData.rating > 0) {
        requestBody.rating = formData.rating
      }

      if (formData.imageUrls.length > 0) {
        requestBody.imageUrls = formData.imageUrls
      }

      const response = await fetch('/api/pizza-bank/culture-club/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      // Redirect to feed
      router.push('/pizza-bank/culture-club')
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const filteredPizzerias = pizzerias.filter(p =>
    p.name.toLowerCase().includes(pizzeriaSearch.toLowerCase()) ||
    p.city.toLowerCase().includes(pizzeriaSearch.toLowerCase())
  )

  const selectedPizzeria = pizzerias.find(p => p.id === formData.pizzeriaId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pizza-bank/culture-club"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Feed
          </Link>
          <h1 className="text-4xl font-bold mb-2">Share Your Pizza Story</h1>
          <p className="text-gray-400">
            Tell the community about your pizza experience
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 space-y-6"
        >
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-300 mb-2">
              What's on your mind? <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              maxLength={5000}
              placeholder="Share your pizza experience, review, or thoughts..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
            />
            <div className="text-sm text-gray-400 mt-1">
              {formData.content.length}/5000 characters
            </div>
          </div>

          {/* Tag Pizzeria */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Tag a Pizzeria (Optional)
            </label>
            {selectedPizzeria ? (
              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                <div>
                  <div className="font-semibold">{selectedPizzeria.name}</div>
                  <div className="text-sm text-gray-400">
                    {selectedPizzeria.city}, {selectedPizzeria.state}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pizzeriaId: '' }))}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPizzeriaSearch(!showPizzeriaSearch)}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                {showPizzeriaSearch ? 'Hide Search' : '+ Tag Pizzeria'}
              </button>
            )}

            {/* Pizzeria Search */}
            {showPizzeriaSearch && !selectedPizzeria && (
              <div className="mt-3 bg-gray-700 rounded-lg p-4">
                <input
                  type="text"
                  value={pizzeriaSearch}
                  onChange={e => setPizzeriaSearch(e.target.value)}
                  placeholder="Search pizzerias..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 mb-3"
                />

                {loadingPizzerias ? (
                  <div className="text-center py-4 text-gray-400">Loading...</div>
                ) : filteredPizzerias.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    No pizzerias found
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredPizzerias.map(pizzeria => (
                      <button
                        key={pizzeria.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, pizzeriaId: pizzeria.id }))
                          setShowPizzeriaSearch(false)
                        }}
                        className="w-full text-left p-3 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <div className="font-semibold">{pizzeria.name}</div>
                        <div className="text-sm text-gray-400">
                          {pizzeria.city}, {pizzeria.state}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rating */}
          {formData.pizzeriaId && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Rate Your Experience (Optional)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`text-4xl transition-all ${
                      star <= formData.rating
                        ? 'text-yellow-400 scale-110'
                        : 'text-gray-600 hover:text-yellow-400'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <div className="text-sm text-gray-400 mt-2">
                  {formData.rating === 1 && 'Not great'}
                  {formData.rating === 2 && 'Could be better'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Great!'}
                  {formData.rating === 5 && 'Outstanding!'}
                </div>
              )}
            </div>
          )}

          {/* Image Upload Note */}
          <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📷</span>
              <div>
                <div className="font-semibold text-blue-400 mb-1">
                  Photo Upload Coming Soon
                </div>
                <div className="text-sm text-gray-400">
                  Image upload functionality will be added in the next update. For now, share your pizza stories with words!
                </div>
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
              {submitting ? 'Posting...' : 'Share Post'}
            </motion.button>

            <Link
              href="/pizza-bank/culture-club"
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
