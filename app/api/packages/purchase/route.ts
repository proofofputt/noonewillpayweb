import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import db, { marketplacePackages, packagePurchases, users, charityPool, allocationPointsHistory } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'

const PurchaseSchema = z.object({
  packageId: z.string().uuid(),
  paymentMethod: z.enum(['bitcoin', 'lightning', 'card']),
  paymentTxId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = PurchaseSchema.parse(body)

    // Get package details
    const [pkg] = await db.select().from(marketplacePackages)
      .where(eq(marketplacePackages.id, data.packageId))
      .limit(1)

    if (!pkg || !pkg.active) {
      return NextResponse.json(
        { success: false, message: 'Package not found or inactive' },
        { status: 404 }
      )
    }

    // Check if max redemptions reached
    if (pkg.maxRedemptions && pkg.currentRedemptions >= pkg.maxRedemptions) {
      return NextResponse.json(
        { success: false, message: 'Package sold out' },
        { status: 400 }
      )
    }

    // TODO: Verify payment based on payment method
    // For now, we'll assume payment is verified

    // Generate unique redemption code
    const redemptionCode = randomBytes(8).toString('hex').toUpperCase()

    // Create purchase record
    const [purchase] = await db.insert(packagePurchases).values({
      packageId: data.packageId,
      businessId: pkg.businessId,
      userId: session.id,
      purchasePrice: pkg.matesPrice,
      paymentMethod: data.paymentMethod,
      paymentTxId: data.paymentTxId || null,
      redemptionCode,
      contributesToCharity: true,
      allocationPointsEarned: 25,
    }).returning()

    // Get user and award allocation points
    const [user] = await db.select().from(users).where(eq(users.id, session.id)).limit(1)

    if (user) {
      await db.update(users)
        .set({ allocationPoints: user.allocationPoints + 25 })
        .where(eq(users.id, session.id))

      // Record points history
      await db.insert(allocationPointsHistory).values({
        userId: session.id,
        points: 25,
        source: 'purchase',
        sourceId: purchase.id,
        description: `Package purchase: ${pkg.packageName}`,
      })
    }

    // Update package redemption counter
    await db.update(marketplacePackages)
      .set({ currentRedemptions: pkg.currentRedemptions + 1 })
      .where(eq(marketplacePackages.id, data.packageId))

    // Check if charity should be generated
    const newCharityCounter = (pkg.charityCounter + 1) % pkg.charityThreshold
    let charityGenerated = false

    if (newCharityCounter === 0 && pkg.generatesCharity) {
      // Generate charity item
      const claimCode = randomBytes(8).toString('hex').toUpperCase()

      await db.insert(charityPool).values({
        packageId: pkg.id,
        businessId: pkg.businessId,
        claimCode,
      })

      charityGenerated = true
    }

    // Update charity counter
    await db.update(marketplacePackages)
      .set({ charityCounter: newCharityCounter })
      .where(eq(marketplacePackages.id, data.packageId))

    return NextResponse.json({
      success: true,
      purchase: {
        id: purchase.id,
        redemptionCode: purchase.redemptionCode,
        packageName: pkg.packageName,
        price: purchase.purchasePrice,
        charityGenerated,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Purchase error:', error)
    return NextResponse.json(
      { success: false, message: 'Purchase failed' },
      { status: 500 }
    )
  }
}
