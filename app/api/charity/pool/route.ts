import { NextRequest, NextResponse } from 'next/server'
import db, { charityPool } from '@/lib/db'
import { eq, desc, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get all unclaimed charity items
    const items = await db.select()
      .from(charityPool)
      .where(eq(charityPool.claimed, false))
      .orderBy(desc(charityPool.createdAt))

    // Get stats
    const stats = await db.select({
      totalAvailable: count(charityPool.id),
    })
      .from(charityPool)
      .where(eq(charityPool.claimed, false))

    return NextResponse.json({
      success: true,
      charityItems: items,
      stats: {
        totalAvailable: stats[0]?.totalAvailable || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching charity pool:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch charity pool' },
      { status: 500 }
    )
  }
}
