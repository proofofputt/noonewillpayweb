'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Event {
  id: string
  creatorId: string
  pizzeriaId: string | null
  title: string
  description: string | null
  eventType: string
  imageUrl: string | null
  locationName: string | null
  address: string | null
  startTime: string
  endTime: string | null
  maxAttendees: number | null
  currentAttendees: number
  requiresRsvp: boolean
  status: string
  createdAt: string
}

interface EventWithPizzeria {
  event: Event
  pizzeria: {
    id: string
    name: string
    address: string
    city: string
    state: string
    imageUrl?: string
  } | null
  rsvpCount: number
}

const eventTypeIcons: Record<string, string> = {
  tasting: '🍕',
  party: '🎉',
  meetup: '👥',
  competition: '🏆',
  workshop: '👨‍🍳'
}

const eventTypeColors: Record<string, string> = {
  tasting: 'from-purple-600 to-purple-800',
  party: 'from-pink-600 to-pink-800',
  meetup: 'from-blue-600 to-blue-800',
  competition: 'from-orange to-red-600',
  workshop: 'from-green-600 to-green-800'
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithPizzeria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('upcoming')

  useEffect(() => {
    fetchEvents()
  }, [filterType, filterStatus])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      let url = `/api/pizza-bank/events?status=${filterStatus}`

      if (filterType !== 'all') {
        url += `&eventType=${filterType}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
      } else {
        setError(data.error || 'Failed to load events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const isEventFull = (event: Event) => {
    return event.maxAttendees !== null && event.currentAttendees >= event.maxAttendees
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <Link
                href="/pizza-bank"
                className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
              >
                ← Back to Pizza Bank
              </Link>

              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
                Pizza Events
              </h1>
              <p className="text-gray-400">Tastings, parties, meetups, and more</p>
            </div>

            <Link
              href="/pizza-bank/events/new"
              className="px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
            >
              + Create Event
            </Link>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Status Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  filterStatus === 'upcoming'
                    ? 'bg-gradient-to-r from-orange to-bitcoin'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus('ongoing')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  filterStatus === 'ongoing'
                    ? 'bg-gradient-to-r from-orange to-bitcoin'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-gradient-to-r from-orange to-bitcoin'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('tasting')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'tasting'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🍕 Tastings
            </button>
            <button
              onClick={() => setFilterType('party')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'party'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🎉 Parties
            </button>
            <button
              onClick={() => setFilterType('meetup')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'meetup'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              👥 Meetups
            </button>
            <button
              onClick={() => setFilterType('competition')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'competition'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              🏆 Competitions
            </button>
            <button
              onClick={() => setFilterType('workshop')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                filterType === 'workshop'
                  ? 'bg-gradient-to-r from-orange to-bitcoin'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              👨‍🍳 Workshops
            </button>
          </div>
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">No Events Found</h2>
            <p className="text-gray-400 mb-6">
              {filterStatus === 'upcoming'
                ? "There are no upcoming events yet."
                : `No ${filterStatus} events found.`}
            </p>
            <Link
              href="/pizza-bank/events/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
            >
              Create First Event
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item, index) => (
              <motion.div
                key={item.event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/pizza-bank/events/${item.event.id}`}>
                  <div className={`bg-gradient-to-br ${eventTypeColors[item.event.eventType] || 'from-gray-900 to-gray-800'} p-6 rounded-lg border-2 border-gray-700 hover:border-orange transition-all cursor-pointer h-full flex flex-col`}>
                    {/* Event Type Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{eventTypeIcons[item.event.eventType]}</span>
                        <span className="text-xs font-bold uppercase text-white/80 capitalize">
                          {item.event.eventType}
                        </span>
                      </div>
                      {isEventFull(item.event) && (
                        <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">
                          FULL
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.event.title}</h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-white/90 mb-3">
                      <span>📅</span>
                      <span>{formatDate(item.event.startTime)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-sm text-white/80 mb-4 flex-1">
                      <span>📍</span>
                      <div className="line-clamp-2">
                        {item.pizzeria ? (
                          <>
                            <div className="font-bold">{item.pizzeria.name}</div>
                            <div className="text-xs">{item.pizzeria.city}, {item.pizzeria.state}</div>
                          </>
                        ) : (
                          <div>{item.event.locationName || item.event.address}</div>
                        )}
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="text-sm">
                        <span className="font-bold">{item.rsvpCount}</span> attending
                        {item.event.maxAttendees && (
                          <span className="text-white/70"> / {item.event.maxAttendees} max</span>
                        )}
                      </div>
                      <div className="text-bitcoin font-bold">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* My Events Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/pizza-bank/events/my-events"
            className="inline-block px-6 py-3 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-all"
          >
            View My Events →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
