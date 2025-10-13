import { NextRequest, NextResponse } from 'next/server'
import db, { pizzerias, users, pizzeriaAffiliates } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-helpers'
import { eq, and, sql } from 'drizzle-orm'

// GET /api/pizza-bank/pizzerias - List all pizzerias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bitcoin = searchParams.get('bitcoin') === 'true'
    const active = searchParams.get('active') !== 'false'
    const city = searchParams.get('city')

    let query = db.select().from(pizzerias).$dynamic()

    // Apply filters
    const conditions = []

    if (active) {
      conditions.push(eq(pizzerias.active, true))
    }

    if (bitcoin) {
      conditions.push(sql`(${pizzerias.acceptsBitcoin} = true OR ${pizzerias.acceptsLightning} = true)`)
    }

    if (city) {
      conditions.push(eq(pizzerias.city, city))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query

    return NextResponse.json({
      success: true,
      pizzerias: results,
      count: results.length,
    })
  } catch (error: any) {
    console.error('Error fetching pizzerias:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pizzerias' },
      { status: 500 }
    )
  }
}

// POST /api/pizza-bank/pizzerias - Create new pizzeria (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.address || !data.city) {
      return NextResponse.json(
        { success: false, error: 'Name, address, and city are required' },
        { status: 400 }
      )
    }

    // Handle referral code if provided
    let referredByUserId = null
    let referredByCode = null

    if (data.referralCode) {
      // Look up the user by referral code
      const [referrer] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, data.referralCode))
        .limit(1)

      if (referrer) {
        referredByUserId = referrer.id
        referredByCode = data.referralCode
      }
    }

    // Create pizzeria
    const [newPizzeria] = await db
      .insert(pizzerias)
      .values({
        name: data.name,
        description: data.description || null,
        address: data.address,
        city: data.city,
        state: data.state || null,
        zipCode: data.zipCode || null,
        country: data.country || 'USA',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        hours: data.hours ? JSON.stringify(data.hours) : null,
        acceptsBitcoin: data.acceptsBitcoin || false,
        acceptsLightning: data.acceptsLightning || false,
        lightningAddress: data.lightningAddress || null,
        bitcoinAddress: data.bitcoinAddress || null,
        imageUrl: data.imageUrl || null,
        posSystem: data.posSystem || null,
        referredByCode: referredByCode,
        referredByUserId: referredByUserId,
        onboardingStatus: 'payment_setup',
        paymentSetupCompleted: data.acceptsBitcoin || data.acceptsLightning || data.acceptsFiat || false,
        ownerId: user.id,
        verified: false, // Admin must verify
        active: true,
      })
      .returning()

    // Create affiliate record if there was a referrer
    if (referredByUserId) {
      await db.insert(pizzeriaAffiliates).values({
        userId: referredByUserId,
        pizzeriaId: newPizzeria.id,
        referralCode: referredByCode!,
        commissionPercent: '10.00', // 10% commission
        active: true,
      })
    }

    return NextResponse.json({
      success: true,
      pizzeria: newPizzeria,
      message: 'Pizzeria created successfully. Pending admin verification.',
      referredBy: referredByUserId ? 'Referral tracked!' : null,
    })
  } catch (error: any) {
    console.error('Error creating pizzeria:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pizzeria' },
      { status: 500 }
    )
  }
}
