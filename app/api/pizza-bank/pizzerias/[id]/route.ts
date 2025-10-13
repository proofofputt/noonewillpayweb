import { NextRequest, NextResponse } from 'next/server'
import db, { pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq } from 'drizzle-orm'

// GET /api/pizza-bank/pizzerias/[id] - Get single pizzeria
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [pizzeria] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, params.id))
      .limit(1)

    if (!pizzeria) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      pizzeria,
    })
  } catch (error: any) {
    console.error('Error fetching pizzeria:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pizzeria' },
      { status: 500 }
    )
  }
}

// PATCH /api/pizza-bank/pizzerias/[id] - Update pizzeria
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

    // Get existing pizzeria
    const [existing] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, params.id))
      .limit(1)

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria not found' },
        { status: 404 }
      )
    }

    // Check authorization (owner or admin)
    if (existing.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updates.name = data.name
    if (data.description !== undefined) updates.description = data.description
    if (data.address !== undefined) updates.address = data.address
    if (data.city !== undefined) updates.city = data.city
    if (data.state !== undefined) updates.state = data.state
    if (data.zipCode !== undefined) updates.zipCode = data.zipCode
    if (data.latitude !== undefined) updates.latitude = data.latitude
    if (data.longitude !== undefined) updates.longitude = data.longitude
    if (data.phone !== undefined) updates.phone = data.phone
    if (data.email !== undefined) updates.email = data.email
    if (data.website !== undefined) updates.website = data.website
    if (data.hours !== undefined) updates.hours = JSON.stringify(data.hours)
    if (data.acceptsBitcoin !== undefined) updates.acceptsBitcoin = data.acceptsBitcoin
    if (data.acceptsLightning !== undefined) updates.acceptsLightning = data.acceptsLightning
    if (data.lightningAddress !== undefined) updates.lightningAddress = data.lightningAddress
    if (data.bitcoinAddress !== undefined) updates.bitcoinAddress = data.bitcoinAddress
    if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl

    // Admin-only fields
    if (user.isAdmin) {
      if (data.verified !== undefined) updates.verified = data.verified
      if (data.active !== undefined) updates.active = data.active
    }

    const [updated] = await db
      .update(pizzerias)
      .set(updates)
      .where(eq(pizzerias.id, params.id))
      .returning()

    return NextResponse.json({
      success: true,
      pizzeria: updated,
    })
  } catch (error: any) {
    console.error('Error updating pizzeria:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update pizzeria' },
      { status: 500 }
    )
  }
}

// DELETE /api/pizza-bank/pizzerias/[id] - Delete pizzeria (admin or owner)
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

    // Get existing pizzeria
    const [existing] = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, params.id))
      .limit(1)

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Pizzeria not found' },
        { status: 404 }
      )
    }

    // Check authorization (owner or admin)
    if (existing.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Soft delete (set active to false)
    await db
      .update(pizzerias)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(pizzerias.id, params.id))

    return NextResponse.json({
      success: true,
      message: 'Pizzeria deactivated successfully',
    })
  } catch (error: any) {
    console.error('Error deleting pizzeria:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete pizzeria' },
      { status: 500 }
    )
  }
}
