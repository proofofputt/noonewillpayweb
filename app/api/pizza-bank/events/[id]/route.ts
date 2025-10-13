import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaEvents, pizzerias, eventRsvps, users } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/events/:id - Get event details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [eventData] = await db
      .select({
        event: pizzaEvents,
        pizzeria: pizzerias,
      })
      .from(pizzaEvents)
      .leftJoin(pizzerias, eq(pizzaEvents.pizzeriaId, pizzerias.id))
      .where(eq(pizzaEvents.id, params.id))
      .limit(1)

    if (!eventData) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get RSVPs with user details
    const rsvps = await db
      .select({
        rsvp: eventRsvps,
        user: {
          id: users.id,
          username: users.username,
        },
      })
      .from(eventRsvps)
      .leftJoin(users, eq(eventRsvps.userId, users.id))
      .where(eq(eventRsvps.eventId, params.id))
      .orderBy(eventRsvps.createdAt)

    // Check if current user has RSVP'd
    const user = await getCurrentUser()
    const userRsvp = user
      ? rsvps.find((r) => r.rsvp.userId === user.id)?.rsvp
      : null

    return NextResponse.json({
      success: true,
      event: eventData.event,
      pizzeria: eventData.pizzeria,
      rsvps,
      userRsvp,
    })
  } catch (error: any) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/pizza-bank/events/:id - Update event
 * Authorization: Event creator or admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [event] = await db
      .select()
      .from(pizzaEvents)
      .where(eq(pizzaEvents.id, params.id))
      .limit(1)

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check authorization
    if (event.creatorId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const updates: any = {
      updatedAt: new Date(),
    }

    // Update allowed fields
    if (data.title) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.eventType) updates.eventType = data.eventType
    if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl
    if (data.locationName !== undefined) updates.locationName = data.locationName
    if (data.address !== undefined) updates.address = data.address
    if (data.latitude !== undefined) updates.latitude = data.latitude.toString()
    if (data.longitude !== undefined) updates.longitude = data.longitude.toString()
    if (data.startTime) updates.startTime = new Date(data.startTime)
    if (data.endTime !== undefined)
      updates.endTime = data.endTime ? new Date(data.endTime) : null
    if (data.maxAttendees !== undefined) updates.maxAttendees = data.maxAttendees
    if (data.requiresRsvp !== undefined) updates.requiresRsvp = data.requiresRsvp
    if (data.status) updates.status = data.status

    const [updated] = await db
      .update(pizzaEvents)
      .set(updates)
      .where(eq(pizzaEvents.id, params.id))
      .returning()

    return NextResponse.json({
      success: true,
      event: updated,
    })
  } catch (error: any) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pizza-bank/events/:id - Delete event
 * Authorization: Event creator or admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const [event] = await db
      .select()
      .from(pizzaEvents)
      .where(eq(pizzaEvents.id, params.id))
      .limit(1)

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check authorization
    if (event.creatorId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Soft delete by setting status to cancelled
    await db
      .update(pizzaEvents)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(pizzaEvents.id, params.id))

    return NextResponse.json({
      success: true,
      message: 'Event cancelled successfully',
    })
  } catch (error: any) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
