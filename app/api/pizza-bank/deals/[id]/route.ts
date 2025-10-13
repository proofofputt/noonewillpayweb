import { NextRequest, NextResponse } from 'next/server'
import db, { groupBuys, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/deals/[id] - Get single deal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id

    const results = await db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))
      .where(eq(groupBuys.id, dealId))
      .limit(1)

    if (results.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const { deal, pizzeria } = results[0]

    return NextResponse.json({
      deal: {
        ...deal,
        pizzeria: pizzeria
          ? {
              id: pizzeria.id,
              name: pizzeria.name,
              city: pizzeria.city,
              state: pizzeria.state,
              imageUrl: pizzeria.imageUrl,
              address: pizzeria.address,
              phone: pizzeria.phone,
            }
          : null,
      },
    })
  } catch (error: any) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/pizza-bank/deals/[id] - Update deal
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const dealId = params.id
    const body = await request.json()
    const { title, description, discountPercent, deadline, maxParticipants, status } = body

    // Check if deal exists and user owns it
    const existingDeal = await db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))
      .where(eq(groupBuys.id, dealId))
      .limit(1)

    if (existingDeal.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const pizzeria = existingDeal[0].pizzeria

    if (!pizzeria || (pizzeria.ownerId !== user.id && !user.isAdmin)) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only edit your own deals.' },
        { status: 403 }
      )
    }

    // Build update object
    const updateData: any = {}

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      updateData.description = description.trim()
    }

    if (discountPercent !== undefined) {
      if (discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json(
          { error: 'Discount must be between 0 and 100%' },
          { status: 400 }
        )
      }
      updateData.discountPercent = discountPercent.toString()
    }

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline)
      if (deadlineDate <= new Date()) {
        return NextResponse.json(
          { error: 'Deadline must be in the future' },
          { status: 400 }
        )
      }
      updateData.deadline = deadlineDate
    }

    if (maxParticipants !== undefined) {
      updateData.maxParticipants = maxParticipants || null
    }

    if (status !== undefined) {
      const validStatuses = ['active', 'funded', 'fulfilled', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Status must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    // Update deal
    await db
      .update(groupBuys)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(groupBuys.id, dealId))

    // Fetch updated deal with pizzeria data
    const updatedDeal = await db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))
      .where(eq(groupBuys.id, dealId))
      .limit(1)

    const result = updatedDeal[0]

    return NextResponse.json({
      message: 'Deal updated successfully',
      deal: {
        ...result.deal,
        pizzeria: result.pizzeria
          ? {
              id: result.pizzeria.id,
              name: result.pizzeria.name,
              city: result.pizzeria.city,
              state: result.pizzeria.state,
              imageUrl: result.pizzeria.imageUrl,
            }
          : null,
      },
    })
  } catch (error: any) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Failed to update deal', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pizza-bank/deals/[id] - Cancel/delete deal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const dealId = params.id

    // Check if deal exists and user owns it
    const existingDeal = await db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))
      .where(eq(groupBuys.id, dealId))
      .limit(1)

    if (existingDeal.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const pizzeria = existingDeal[0].pizzeria

    if (!pizzeria || (pizzeria.ownerId !== user.id && !user.isAdmin)) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own deals.' },
        { status: 403 }
      )
    }

    // Cancel deal (soft delete by setting status to 'cancelled')
    await db
      .update(groupBuys)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(groupBuys.id, dealId))

    return NextResponse.json({
      message: 'Deal cancelled successfully',
    })
  } catch (error: any) {
    console.error('Error cancelling deal:', error)
    return NextResponse.json(
      { error: 'Failed to cancel deal', details: error.message },
      { status: 500 }
    )
  }
}
