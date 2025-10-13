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

export default function CreateEventPage() {
  const router = useRouter()

  // User pizzerias (for selection)
  const [pizzerias, setPizzerias] = useState<Pizzeria[]>([])
  const [loadingPizzerias, setLoadingPizzerias] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    pizzeriaId: '',
    eventType: 'tasting' as 'tasting' | 'party' | 'meetup' | 'competition' | 'workshop',
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    maxAttendees: '',
    entryFee: '',
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.pizzeriaId || !formData.title || !formData.description || !formData.eventDate || !formData.startTime) {
        throw new Error('Please fill in all required fields')
      }

      // Build request body
      const requestBody: any = {
        pizzeriaId: formData.pizzeriaId,
        eventType: formData.eventType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        location: formData.location.trim() || undefined,
      }

      // Optional fields
      if (formData.endTime) requestBody.endTime = formData.endTime
      if (formData.maxAttendees) requestBody.maxAttendees = parseInt(formData.maxAttendees)
      if (formData.entryFee) requestBody.entryFee = parseFloat(formData.entryFee)

      const response = await fetch('/api/pizza-bank/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }

      const { event } = await response.json()

      // Redirect to the new event
      router.push(`/pizza-bank/events/${event.id}`)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const eventTypeOptions = [
    { value: 'tasting', label: '👅 Tasting', description: 'Sample new flavors and recipes' },
    { value: 'party', label: '🎉 Party', description: 'Celebrate with pizza and community' },
    { value: 'meetup', label: '🤝 Meetup', description: 'Connect with other pizza lovers' },
    { value: 'competition', label: '🏆 Competition', description: 'Test your pizza skills' },
    { value: 'workshop', label: '👨‍🍳 Workshop', description: 'Learn pizza-making techniques' },
  ]

  const getTodayString = () => {
    const today = new Date()
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
            You need to register a pizzeria before you can create events.
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
            href="/pizza-bank/events"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Events
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-gray-400">
            Host a pizza event at your pizzeria and bring the community together!
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

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Event Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eventTypeOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.eventType === option.value
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="eventType"
                    value={option.value}
                    checked={formData.eventType === option.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-300 mb-2">
              Event Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="e.g., Neapolitan Pizza Tasting Night"
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
              placeholder="Tell people what to expect at your event..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
            />
            <div className="text-sm text-gray-400 mt-1">
              {formData.description.length}/2000 characters
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                min={getTodayString()}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-gray-300 mb-2">
                Start Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-semibold text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-300 mb-2">
              Location Details
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Defaults to pizzeria address if left blank"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
            <div className="text-sm text-gray-400 mt-1">
              Optional: Add specific location details (e.g., "Back patio", "Private dining room")
            </div>
          </div>

          {/* Capacity and Entry Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-semibold text-gray-300 mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min="1"
                max="1000"
                placeholder="Optional"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="entryFee" className="block text-sm font-semibold text-gray-300 mb-2">
                Entry Fee ($)
              </label>
              <input
                type="number"
                id="entryFee"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
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
              {submitting ? 'Creating Event...' : 'Create Event'}
            </motion.button>

            <Link
              href="/pizza-bank/events"
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
