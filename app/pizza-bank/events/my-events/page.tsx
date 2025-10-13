'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface PizzaEvent {
  id: string
  pizzeriaId: string
  pizzeria?: {
    name: string
    city: string
    state: string
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
  userCheckedIn?: boolean
}

export default function MyEventsPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'hosting' | 'attending'>('attending')
  const [hostingEvents, setHostingEvents] = useState<PizzaEvent[]>([])
  const [attendingEvents, setAttendingEvents] = useState<PizzaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyEvents()
  }, [])

  async function fetchMyEvents() {
    try {
      setLoading(true)

      // Fetch events I'm hosting
      const hostingResponse = await fetch('/api/pizza-bank/events/my-events?type=hosting')
      if (hostingResponse.ok) {
        const hostingData = await hostingResponse.json()
        setHostingEvents(hostingData.events || [])
      }

      // Fetch events I'm attending
      const attendingResponse = await fetch('/api/pizza-bank/events/my-events?type=attending')
      if (attendingResponse.ok) {
        const attendingData = await attendingResponse.json()
        setAttendingEvents(attendingData.events || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelRsvp(eventId: string) {
    try {
      const response = await fetch(`/api/pizza-bank/events/${eventId}/rsvp`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel RSVP')
      }

      // Refresh events
      await fetchMyEvents()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  async function handleCancelEvent(eventId: string) {
    if (!confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/pizza-bank/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel event')
      }

      // Refresh events
      await fetchMyEvents()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const EventCard = ({ event, isHosting }: { event: PizzaEvent; isHosting: boolean }) => {
    const isEventFull = event.maxAttendees && event.rsvpCount >= event.maxAttendees

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getEventTypeEmoji(event.eventType)}</span>
              <div>
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm text-gray-400 capitalize">
                  {event.eventType.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold uppercase ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">📅</span>
              <span>{formatDate(event.eventDate)} at {formatTime(event.startTime)}</span>
            </div>

            {event.pizzeria && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">🍕</span>
                <span>
                  {event.pizzeria.name} - {event.pizzeria.city}, {event.pizzeria.state}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">👥</span>
              <span>
                {event.rsvpCount} {event.maxAttendees && `/ ${event.maxAttendees}`} attending
                {isEventFull && <span className="text-red-400 ml-2">FULL</span>}
              </span>
            </div>

            {event.userCheckedIn && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <span>✓</span>
                <span>Checked In</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/pizza-bank/events/${event.id}`}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-center transition-colors text-sm"
            >
              View Details
            </Link>

            {isHosting ? (
              <>
                <Link
                  href={`/pizza-bank/events/${event.id}/manage`}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-sm"
                >
                  Manage
                </Link>
                {event.status === 'upcoming' && (
                  <button
                    onClick={() => handleCancelEvent(event.id)}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              event.status === 'upcoming' && (
                <button
                  onClick={() => handleCancelRsvp(event.id)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-sm"
                >
                  Cancel RSVP
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const currentEvents = activeTab === 'hosting' ? hostingEvents : attendingEvents

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading your events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">My Events</h1>
            <Link
              href="/pizza-bank/events/new"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              + Create Event
            </Link>
          </div>
          <p className="text-gray-400">
            Manage events you're hosting and track events you're attending
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('attending')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === 'attending'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Attending ({attendingEvents.length})
            {activeTab === 'attending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === 'hosting'
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Hosting ({hostingEvents.length})
            {activeTab === 'hosting' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400" />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {currentEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {activeTab === 'hosting' ? '🍕' : '😴'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'hosting'
                ? 'No Events Hosted Yet'
                : 'No Events Attended Yet'
              }
            </h2>
            <p className="text-gray-400 mb-6">
              {activeTab === 'hosting'
                ? 'Create your first event and bring the pizza community together!'
                : 'Browse events and RSVP to start connecting with pizza lovers!'}
            </p>
            {activeTab === 'hosting' ? (
              <Link
                href="/pizza-bank/events/new"
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                Create Your First Event
              </Link>
            ) : (
              <Link
                href="/pizza-bank/events"
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                Browse Events
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isHosting={activeTab === 'hosting'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
