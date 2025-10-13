'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PizzaEvent {
  id: string
  pizzeriaId: string
  pizzeria?: {
    name: string
    address: string
    city: string
    state: string
    logo?: string
  }
  eventType: 'tasting' | 'party' | 'meetup' | 'competition' | 'workshop'
  title: string
  description: string
  eventDate: string
  startTime: string
  endTime?: string
  location: string
  maxAttendees?: number
  rsvpCount: number
  entryFee?: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: string
  createdBy: string
  userRsvp?: boolean
  userCheckedIn?: boolean
}

export default function EventDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<PizzaEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  async function fetchEventDetails() {
    try {
      const response = await fetch(`/api/pizza-bank/events/${eventId}`)
      if (!response.ok) {
        throw new Error('Failed to load event')
      }
      const data = await response.json()
      setEvent(data.event)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRsvp() {
    if (!event) return

    setRsvpLoading(true)
    setError('')

    try {
      const method = event.userRsvp ? 'DELETE' : 'POST'
      const response = await fetch(`/api/pizza-bank/events/${eventId}/rsvp`, {
        method,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update RSVP')
      }

      // Refresh event details
      await fetchEventDetails()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRsvpLoading(false)
    }
  }

  const getEventTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      tasting: '👅',
      party: '🎉',
      meetup: '🤝',
      competition: '🏆',
      workshop: '👨‍🍳',
    }
    return emojis[type] || '🍕'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'text-blue-400',
      ongoing: 'text-green-400',
      completed: 'text-gray-400',
      cancelled: 'text-red-400',
    }
    return colors[status] || 'text-gray-400'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const isEventFull = event && event.maxAttendees && event.rsvpCount >= event.maxAttendees
  const canRsvp = event && event.status === 'upcoming' && !isEventFull

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading event...</div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This event does not exist.'}</p>
          <Link
            href="/pizza-bank/events"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/pizza-bank/events"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Events
          </Link>
        </div>

        {/* Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
        >
          {/* Event Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getEventTypeEmoji(event.eventType)}</span>
                  <span className={`text-sm font-semibold uppercase ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="text-orange-100 capitalize">
                  {event.eventType.replace(/([A-Z])/g, ' $1').trim()} Event
                </p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 space-y-6">
            {/* Date & Time */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                📅 Date & Time
              </h3>
              <p className="text-lg">{formatDate(event.eventDate)}</p>
              <p className="text-gray-400">
                {formatTime(event.startTime)}
                {event.endTime && ` - ${formatTime(event.endTime)}`}
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                📍 Location
              </h3>
              <p className="text-lg">{event.location}</p>
              {event.pizzeria && (
                <Link
                  href={`/pizza-bank/pizzerias/${event.pizzeriaId}`}
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {event.pizzeria.name}
                </Link>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                ℹ️ About This Event
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Attendance Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">RSVPs</div>
                <div className="text-2xl font-bold">
                  {event.rsvpCount}
                  {event.maxAttendees && ` / ${event.maxAttendees}`}
                </div>
              </div>

              {event.entryFee && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Entry Fee</div>
                  <div className="text-2xl font-bold">${event.entryFee}</div>
                </div>
              )}

              {event.userCheckedIn && (
                <div className="bg-green-700/30 border border-green-600 rounded-lg p-4">
                  <div className="text-sm text-green-400 mb-1">Status</div>
                  <div className="text-2xl">✓ Checked In</div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* RSVP Button */}
            {canRsvp && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRsvp}
                disabled={rsvpLoading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                  event.userRsvp
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {rsvpLoading ? (
                  'Processing...'
                ) : event.userRsvp ? (
                  '✓ You\'re Going - Click to Cancel'
                ) : (
                  'RSVP to Event'
                )}
              </motion.button>
            )}

            {isEventFull && !event.userRsvp && (
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 text-center">
                <p className="text-yellow-400 font-semibold">
                  This event is full. Check back for cancellations!
                </p>
              </div>
            )}

            {event.status !== 'upcoming' && (
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 text-center">
                <p className="text-gray-400">
                  {event.status === 'completed' && 'This event has ended.'}
                  {event.status === 'cancelled' && 'This event has been cancelled.'}
                  {event.status === 'ongoing' && 'This event is currently in progress!'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hosted By */}
        {event.pizzeria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-gray-800/50 rounded-lg border border-gray-700 p-6"
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">
              Hosted By
            </h3>
            <div className="flex items-center gap-4">
              {event.pizzeria.logo && (
                <img
                  src={event.pizzeria.logo}
                  alt={event.pizzeria.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-1">{event.pizzeria.name}</h4>
                <p className="text-gray-400">
                  {event.pizzeria.city}, {event.pizzeria.state}
                </p>
              </div>
              <Link
                href={`/pizza-bank/pizzerias/${event.pizzeriaId}`}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                View Pizzeria
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
