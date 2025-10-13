import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaEvents, pizzerias, eventRsvps } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql, desc } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/events/my-events - Get events created by or RSVPd to by current user
 * Query params: type (hosting | attending)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'attending'

    if (type === 'hosting') {
      // Get events created by this user
      const events = await db
        .select({
          event: pizzaEvents,
          pizzeria: pizzerias,
          rsvpCount: sql<number>`CAST(COUNT(DISTINCT ${eventRsvps.userId}) AS INTEGER)`,
        })
        .from(pizzaEvents)
        .leftJoin(pizzerias, eq(pizzaEvents.pizzeriaId, pizzerias.id))
        .leftJoin(eventRsvps, eq(pizzaEvents.id, eventRsvps.eventId))
        .where(eq(pizzaEvents.creatorId, user.id))
        .groupBy(pizzaEvents.id, pizzerias.id)
        .orderBy(desc(pizzaEvents.startTime))

      const formattedEvents = events.map(({ event, pizzeria, rsvpCount }) => ({
        ...event,
        pizzeria: pizzeria
          ? {
              name: pizzeria.name,
              city: pizzeria.city,
              state: pizzeria.state,
              imageUrl: pizzeria.imageUrl,
            }
          : null,
        rsvpCount: rsvpCount || 0,
      }))

      return NextResponse.json({
        events: formattedEvents,
        count: formattedEvents.length,
      })
    } else {
      // Get events the user has RSVP'd to
      const events = await db
        .select({
          event: pizzaEvents,
          pizzeria: pizzerias,
          rsvpCount: sql<number>`CAST(COUNT(DISTINCT ${eventRsvps.userId}) AS INTEGER)`,
          userRsvp: eventRsvps,
        })
        .from(eventRsvps)
        .innerJoin(pizzaEvents, eq(eventRsvps.eventId, pizzaEvents.id))
        .leftJoin(pizzerias, eq(pizzaEvents.pizzeriaId, pizzerias.id))
        .leftJoin(
          sql`${eventRsvps} AS all_rsvps`,
          sql`${pizzaEvents.id} = all_rsvps.event_id`
        )
        .where(eq(eventRsvps.userId, user.id))
        .groupBy(pizzaEvents.id, pizzerias.id, eventRsvps.id)
        .orderBy(desc(pizzaEvents.startTime))

      const formattedEvents = events.map(({ event, pizzeria, rsvpCount, userRsvp }) => ({
        ...event,
        pizzeria: pizzeria
          ? {
              name: pizzeria.name,
              city: pizzeria.city,
              state: pizzeria.state,
              imageUrl: pizzeria.imageUrl,
            }
          : null,
        rsvpCount: rsvpCount || 0,
        userCheckedIn: userRsvp?.checkedIn || false,
      }))

      return NextResponse.json({
        events: formattedEvents,
        count: formattedEvents.length,
      })
    }
  } catch (error: any) {
    console.error('Error fetching my events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    )
  }
}
