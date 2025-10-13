import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaEvents, pizzerias, eventRsvps } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/events - Browse events
 * Query params:
 * - eventType: Filter by type (tasting, party, meetup, competition, workshop)
 * - pizzeriaId: Filter by pizzeria
 * - startDate: Filter events starting after this date
 * - endDate: Filter events starting before this date
 * - status: Filter by status (upcoming, ongoing, completed, cancelled)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('eventType')
    const pizzeriaId = searchParams.get('pizzeriaId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status') || 'upcoming'

    let query = db
      .select({
        event: pizzaEvents,
        pizzeria: {
          id: pizzerias.id,
          name: pizzerias.name,
          address: pizzerias.address,
          city: pizzerias.city,
          state: pizzerias.state,
          imageUrl: pizzerias.imageUrl,
        },
      })
      .from(pizzaEvents)
      .leftJoin(pizzerias, eq(pizzaEvents.pizzeriaId, pizzerias.id))
      .$dynamic()

    // Build WHERE conditions
    const conditions: any[] = []

    if (status) {
      conditions.push(eq(pizzaEvents.status, status))
    }

    if (eventType) {
      conditions.push(eq(pizzaEvents.eventType, eventType))
    }

    if (pizzeriaId) {
      conditions.push(eq(pizzaEvents.pizzeriaId, pizzeriaId))
    }

    if (startDate) {
      conditions.push(gte(pizzaEvents.startTime, new Date(startDate)))
    }

    if (endDate) {
      conditions.push(lte(pizzaEvents.startTime, new Date(endDate)))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const events = await query.orderBy(pizzaEvents.startTime)

    // Get RSVP counts for each event
    const eventsWithRsvps = await Promise.all(
      events.map(async (item) => {
        const [rsvpCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(eventRsvps)
          .where(
            and(
              eq(eventRsvps.eventId, item.event.id),
              eq(eventRsvps.status, 'attending')
            )
          )

        return {
          ...item,
          rsvpCount: rsvpCount?.count || 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      events: eventsWithRsvps,
    })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pizza-bank/events - Create new event
 * Body: {
 *   title, description, eventType,
 *   pizzeriaId?, locationName?, address?, latitude?, longitude?,
 *   startTime, endTime?, maxAttendees?, requiresRsvp?, imageUrl?
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.eventType || !data.startTime) {
      return NextResponse.json(
        { success: false, error: 'Title, event type, and start time are required' },
        { status: 400 }
      )
    }

    // Validate event type
    const validTypes = ['tasting', 'party', 'meetup', 'competition', 'workshop']
    if (!validTypes.includes(data.eventType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type' },
        { status: 400 }
      )
    }

    // Validate location (either pizzeria OR custom address)
    if (!data.pizzeriaId && !data.address) {
      return NextResponse.json(
        { success: false, error: 'Either pizzeria or custom address is required' },
        { status: 400 }
      )
    }

    // If pizzeriaId provided, verify it exists
    if (data.pizzeriaId) {
      const [pizzeria] = await db
        .select()
        .from(pizzerias)
        .where(eq(pizzerias.id, data.pizzeriaId))
        .limit(1)

      if (!pizzeria) {
        return NextResponse.json(
          { success: false, error: 'Pizzeria not found' },
          { status: 404 }
        )
      }

      // Auto-populate location from pizzeria if not provided
      if (!data.locationName) data.locationName = pizzeria.name
      if (!data.address) data.address = pizzeria.address
      if (!data.latitude && pizzeria.latitude) data.latitude = pizzeria.latitude
      if (!data.longitude && pizzeria.longitude) data.longitude = pizzeria.longitude
    }

    // Create event
    const [newEvent] = await db
      .insert(pizzaEvents)
      .values({
        creatorId: user.id,
        pizzeriaId: data.pizzeriaId || null,
        title: data.title,
        description: data.description || null,
        eventType: data.eventType,
        imageUrl: data.imageUrl || null,
        locationName: data.locationName || null,
        address: data.address || null,
        latitude: data.latitude ? data.latitude.toString() : null,
        longitude: data.longitude ? data.longitude.toString() : null,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        maxAttendees: data.maxAttendees || null,
        requiresRsvp: data.requiresRsvp !== false, // Default true
        status: 'upcoming',
      })
      .returning()

    // Auto-RSVP creator as attending
    await db.insert(eventRsvps).values({
      eventId: newEvent.id,
      userId: user.id,
      status: 'attending',
    })

    // Update attendee count
    await db
      .update(pizzaEvents)
      .set({ currentAttendees: sql`current_attendees + 1` })
      .where(eq(pizzaEvents.id, newEvent.id))

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: 'Event created successfully',
    })
  } catch (error: any) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
