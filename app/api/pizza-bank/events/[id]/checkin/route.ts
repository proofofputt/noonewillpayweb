import { NextRequest, NextResponse } from 'next/server'
import db, { pizzaEvents, eventRsvps, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and } from 'drizzle-orm'

/**
 * POST /api/pizza-bank/events/:id/checkin - Check in attendee
 * Body: { userId? } - If provided, check in that user (creator/pizzeria owner only)
 *                     If not provided, check in self
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
    const targetUserId = data.userId || user.id

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

    // If checking in someone else, verify authorization
    if (targetUserId !== user.id) {
      // Must be event creator, pizzeria owner (if event at pizzeria), or admin
      let authorized = event.creatorId === user.id || user.isAdmin

      if (!authorized && event.pizzeriaId) {
        const [pizzeria] = await db
          .select()
          .from(pizzerias)
          .where(eq(pizzerias.id, event.pizzeriaId))
          .limit(1)

        if (pizzeria && pizzeria.ownerId === user.id) {
          authorized = true
        }
      }

      if (!authorized) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to check in other attendees' },
          { status: 403 }
        )
      }
    }

    // Find RSVP
    const [rsvp] = await db
      .select()
      .from(eventRsvps)
      .where(
        and(
          eq(eventRsvps.eventId, params.id),
          eq(eventRsvps.userId, targetUserId)
        )
      )
      .limit(1)

    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: 'No RSVP found for this user' },
        { status: 404 }
      )
    }

    if (rsvp.checkedIn) {
      return NextResponse.json(
        { success: false, error: 'User is already checked in' },
        { status: 400 }
      )
    }

    // Check in
    const [updated] = await db
      .update(eventRsvps)
      .set({
        checkedIn: true,
        checkedInAt: new Date(),
      })
      .where(eq(eventRsvps.id, rsvp.id))
      .returning()

    return NextResponse.json({
      success: true,
      rsvp: updated,
      message: `Successfully checked in${targetUserId !== user.id ? ' attendee' : ''}`,
    })
  } catch (error: any) {
    console.error('Error checking in:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check in' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pizza-bank/events/:id/checkin - Get check-in stats
 * Authorization: Event creator, pizzeria owner, or admin
 */
export async function GET(
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

    // Verify authorization
    let authorized = event.creatorId === user.id || user.isAdmin

    if (!authorized && event.pizzeriaId) {
      const [pizzeria] = await db
        .select()
        .from(pizzerias)
        .where(eq(pizzerias.id, event.pizzeriaId))
        .limit(1)

      if (pizzeria && pizzeria.ownerId === user.id) {
        authorized = true
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all RSVPs with check-in status
    const rsvps = await db
      .select()
      .from(eventRsvps)
      .where(eq(eventRsvps.eventId, params.id))

    const stats = {
      totalRsvps: rsvps.length,
      attending: rsvps.filter((r) => r.status === 'attending').length,
      maybe: rsvps.filter((r) => r.status === 'maybe').length,
      checkedIn: rsvps.filter((r) => r.checkedIn).length,
      notCheckedIn: rsvps.filter((r) => !r.checkedIn).length,
    }

    return NextResponse.json({
      success: true,
      stats,
      rsvps,
    })
  } catch (error: any) {
    console.error('Error fetching check-in stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-in stats' },
      { status: 500 }
    )
  }
}
