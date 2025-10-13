import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaEvents, eventRsvps } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/events/:id/rsvp - RSVP to event
 * Body: { status: 'attending' | 'maybe' }
 */
export async function POST(
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

    const data = await request.json()

    // Validate status
    if (!data.status || !['attending', 'maybe'].includes(data.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid RSVP status' },
        { status: 400 }
      )
    }

    // Get event
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

    // Check if event is cancelled or completed
    if (event.status === 'cancelled' || event.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot RSVP to cancelled or completed event' },
        { status: 400 }
      )
    }

    // Check if event is full (only if attending)
    if (
      data.status === 'attending' &&
      event.maxAttendees &&
      event.currentAttendees >= event.maxAttendees
    ) {
      return NextResponse.json(
        { success: false, error: 'Event is at capacity' },
        { status: 400 }
      )
    }

    // Check if user already has RSVP
    const [existingRsvp] = await db
      .select()
      .from(eventRsvps)
      .where(
        and(eq(eventRsvps.eventId, params.id), eq(eventRsvps.userId, user.id))
      )
      .limit(1)

    if (existingRsvp) {
      // Update existing RSVP
      const wasAttending = existingRsvp.status === 'attending'
      const nowAttending = data.status === 'attending'

      const [updated] = await db
        .update(eventRsvps)
        .set({ status: data.status })
        .where(eq(eventRsvps.id, existingRsvp.id))
        .returning()

      // Update attendee count if status changed from/to attending
      if (wasAttending && !nowAttending) {
        // Changed from attending to maybe
        await db
          .update(pizzaEvents)
          .set({
            currentAttendees: sql`GREATEST(0, current_attendees - 1)`,
          })
          .where(eq(pizzaEvents.id, params.id))
      } else if (!wasAttending && nowAttending) {
        // Changed from maybe to attending
        await db
          .update(pizzaEvents)
          .set({
            currentAttendees: sql`current_attendees + 1`,
          })
          .where(eq(pizzaEvents.id, params.id))
      }

      return NextResponse.json({
        success: true,
        rsvp: updated,
        message: 'RSVP updated successfully',
      })
    }

    // Create new RSVP
    const [newRsvp] = await db
      .insert(eventRsvps)
      .values({
        eventId: params.id,
        userId: user.id,
        status: data.status,
      })
      .returning()

    // Update attendee count if attending
    if (data.status === 'attending') {
      await db
        .update(pizzaEvents)
        .set({
          currentAttendees: sql`current_attendees + 1`,
        })
        .where(eq(pizzaEvents.id, params.id))
    }

    return NextResponse.json({
      success: true,
      rsvp: newRsvp,
      message: 'RSVP created successfully',
    })
  } catch (error: any) {
    console.error('Error creating RSVP:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create RSVP' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pizza-bank/events/:id/rsvp - Cancel RSVP
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

    // Find user's RSVP
    const [rsvp] = await db
      .select()
      .from(eventRsvps)
      .where(
        and(eq(eventRsvps.eventId, params.id), eq(eventRsvps.userId, user.id))
      )
      .limit(1)

    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: 'RSVP not found' },
        { status: 404 }
      )
    }

    // Delete RSVP
    await db.delete(eventRsvps).where(eq(eventRsvps.id, rsvp.id))

    // Update attendee count if was attending
    if (rsvp.status === 'attending') {
      await db
        .update(pizzaEvents)
        .set({
          currentAttendees: sql`GREATEST(0, current_attendees - 1)`,
        })
        .where(eq(pizzaEvents.id, params.id))
    }

    return NextResponse.json({
      success: true,
      message: 'RSVP cancelled successfully',
    })
  } catch (error: any) {
    console.error('Error cancelling RSVP:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel RSVP' },
      { status: 500 }
    )
  }
}
