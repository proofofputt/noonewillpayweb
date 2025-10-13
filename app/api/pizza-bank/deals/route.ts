import { NextRequest, NextResponse } from 'next/server'
import db, { groupBuys, pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/deals - Browse promotional deals
 * Query params: pizzeriaId, status (active, expired)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pizzeriaId = searchParams.get('pizzeriaId')
    const status = searchParams.get('status') || 'active'

    // Build where conditions
    const whereConditions: any[] = []

    // Filter by pizzeria if specified
    if (pizzeriaId) {
      whereConditions.push(eq(groupBuys.pizzeriaId, pizzeriaId))
    }

    // Filter by status
    const now = new Date()
    if (status === 'active') {
      whereConditions.push(eq(groupBuys.status, 'active'))
      whereConditions.push(gte(groupBuys.deadline, now))
    } else if (status === 'expired') {
      whereConditions.push(lte(groupBuys.deadline, now))
    }

    // Build the query
    const baseQuery = db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))

    // Apply where conditions if any exist, then order
    const results = whereConditions.length > 0
      ? await baseQuery
          .where(and(...whereConditions))
          .orderBy(desc(groupBuys.createdAt))
      : await baseQuery.orderBy(desc(groupBuys.createdAt))

    const deals = results.map(({ deal, pizzeria }) => ({
      ...deal,
      pizzeria: pizzeria
        ? {
            id: pizzeria.id,
            name: pizzeria.name,
            city: pizzeria.city,
            state: pizzeria.state,
            imageUrl: pizzeria.imageUrl,
          }
        : null,
    }))

    return NextResponse.json({
      deals,
      count: deals.length,
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/pizza-bank/deals - Create new promotional deal
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      pizzeriaId,
      title,
      description,
      discountPercent,
      deadline,
      targetAmount,
      maxParticipants,
    } = body

    // Validate required fields
    if (!pizzeriaId || !title || !description || !discountPercent || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify pizzeria ownership
    const pizzeria = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.id, pizzeriaId))
      .limit(1)

    if (pizzeria.length === 0) {
      return NextResponse.json(
        { error: 'Pizzeria not found' },
        { status: 404 }
      )
    }

    if (pizzeria[0].ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only create deals for your own pizzerias.' },
        { status: 403 }
      )
    }

    // Validate discount
    if (discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 0 and 100%' },
        { status: 400 }
      )
    }

    // Validate deadline
    const deadlineDate = new Date(deadline)
    if (deadlineDate <= new Date()) {
      return NextResponse.json(
        { error: 'Deadline must be in the future' },
        { status: 400 }
      )
    }

    // Create deal
    const newDeal = await db
      .insert(groupBuys)
      .values({
        pizzeriaId,
        creatorId: user.id,
        title: title.trim(),
        description: description.trim(),
        targetAmount: targetAmount || '0',
        currentAmount: '0',
        participantCount: 0,
        maxParticipants: maxParticipants || null,
        discountPercent: discountPercent.toString(),
        deadline: deadlineDate,
        pickupTime: null,
        status: 'active',
      })
      .returning()

    // Fetch deal with pizzeria data
    const dealWithPizzeria = await db
      .select({
        deal: groupBuys,
        pizzeria: pizzerias,
      })
      .from(groupBuys)
      .leftJoin(pizzerias, eq(groupBuys.pizzeriaId, pizzerias.id))
      .where(eq(groupBuys.id, newDeal[0].id))
      .limit(1)

    const result = dealWithPizzeria[0]

    return NextResponse.json(
      {
        message: 'Deal created successfully',
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
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal', details: error.message },
      { status: 500 }
    )
  }
}
