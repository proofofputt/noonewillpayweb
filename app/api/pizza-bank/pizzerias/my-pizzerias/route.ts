import { NextResponse } from 'next/server'
import db, { pizzerias } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, desc } from 'drizzle-orm'

/**
 * GET /api/pizza-bank/pizzerias/my-pizzerias - Get pizzerias owned by current user
 */
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const userPizzerias = await db
      .select()
      .from(pizzerias)
      .where(eq(pizzerias.ownerId, user.id))
      .orderBy(desc(pizzerias.createdAt))

    return NextResponse.json({
      pizzerias: userPizzerias,
      count: userPizzerias.length,
    })
  } catch (error: any) {
    console.error('Error fetching user pizzerias:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pizzerias', details: error.message },
      { status: 500 }
    )
  }
}
