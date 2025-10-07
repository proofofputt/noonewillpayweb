import { NextRequest, NextResponse } from 'next/server'
import db, { marketplacePackages } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const businessId = searchParams.get('businessId')

    // Build query conditions
    const conditions = []

    if (category) {
      conditions.push(eq(marketplacePackages.category, category))
    }

    if (businessId) {
      conditions.push(eq(marketplacePackages.businessId, businessId))
    }

    // Always show only active packages
    conditions.push(eq(marketplacePackages.active, true))

    // Fetch packages
    const packages = conditions.length > 0
      ? await db.select().from(marketplacePackages).where(and(...conditions))
      : await db.select().from(marketplacePackages).where(eq(marketplacePackages.active, true))

    return NextResponse.json({
      success: true,
      packages,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check - only verified partners can create packages
    const body = await request.json()

    const [newPackage] = await db.insert(marketplacePackages).values({
      businessId: body.businessId,
      packageName: body.packageName,
      description: body.description,
      category: body.category,
      regularPrice: body.regularPrice,
      matesPrice: body.matesPrice,
      generatesCharity: body.generatesCharity ?? true,
      charityThreshold: body.charityThreshold ?? 5,
      maxRedemptions: body.maxRedemptions || null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      active: true,
    }).returning()

    return NextResponse.json({
      success: true,
      package: newPackage,
    })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 }
    )
  }
}
