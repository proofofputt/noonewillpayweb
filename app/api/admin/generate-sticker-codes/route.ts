import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import db, { stickerCodes } from '@/lib/db'
import { verifyAdminRequest } from '@/lib/admin-auth'

const GenerateSchema = z.object({
  count: z.number().min(1).max(1000), // Max 1000 codes per batch
  batchId: z.string().optional(),
  notes: z.string().optional(),
})

/**
 * Generate a unique sticker code
 * Format: STIK-XXXX (e.g., STIK-A3F9)
 */
function generateStickerCode(): string {
  const bytes = crypto.randomBytes(2)
  const code = bytes.toString('hex').toUpperCase()
  return `STIK-${code}`
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = GenerateSchema.parse(body)

    // Generate batch ID if not provided
    const batchId = data.batchId || `BATCH-${Date.now()}`

    const generatedCodes: string[] = []
    const failedCodes: string[] = []

    // Generate the requested number of codes
    for (let i = 0; i < data.count; i++) {
      let attempts = 0
      let codeGenerated = false

      while (!codeGenerated && attempts < 10) {
        const code = generateStickerCode()

        try {
          // Try to insert the code
          await db.insert(stickerCodes).values({
            code,
            batchId,
            notes: data.notes || `Generated batch ${batchId}`,
            claimed: false,
            active: true,
          })

          generatedCodes.push(code)
          codeGenerated = true
        } catch (error: any) {
          // Code might already exist, try again
          if (error?.code === '23505') { // Unique violation
            attempts++
          } else {
            throw error
          }
        }
      }

      if (!codeGenerated) {
        failedCodes.push(`Failed after 10 attempts`)
      }
    }

    return NextResponse.json({
      success: true,
      batchId,
      generated: generatedCodes.length,
      failed: failedCodes.length,
      codes: generatedCodes,
      failedCodes: failedCodes.length > 0 ? failedCodes : undefined,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error generating sticker codes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate codes' },
      { status: 500 }
    )
  }
}

/**
 * Get all sticker codes or filter by batch
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get('batchId')
    const onlyClaimed = searchParams.get('claimed') === 'true'
    const onlyUnclaimed = searchParams.get('unclaimed') === 'true'

    let query = db.select().from(stickerCodes)

    // Apply filters (would need to use .where() with drizzle ORM properly)
    // For now, fetch all and filter in memory for simplicity
    const allCodes = await query

    let filteredCodes = allCodes

    if (batchId) {
      filteredCodes = filteredCodes.filter(c => c.batchId === batchId)
    }

    if (onlyClaimed) {
      filteredCodes = filteredCodes.filter(c => c.claimed === true)
    }

    if (onlyUnclaimed) {
      filteredCodes = filteredCodes.filter(c => c.claimed === false)
    }

    // Get batch statistics
    const batches = [...new Set(allCodes.map(c => c.batchId))]
    const batchStats = batches.map(batch => {
      const batchCodes = allCodes.filter(c => c.batchId === batch)
      return {
        batchId: batch,
        total: batchCodes.length,
        claimed: batchCodes.filter(c => c.claimed).length,
        unclaimed: batchCodes.filter(c => !c.claimed).length,
        totalUsage: batchCodes.reduce((sum, c) => sum + c.usageCount, 0),
      }
    })

    return NextResponse.json({
      success: true,
      codes: filteredCodes,
      total: filteredCodes.length,
      batches: batchStats,
      stats: {
        totalCodes: allCodes.length,
        claimed: allCodes.filter(c => c.claimed).length,
        unclaimed: allCodes.filter(c => !c.claimed).length,
        active: allCodes.filter(c => c.active).length,
      }
    })
  } catch (error) {
    console.error('Error fetching sticker codes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch codes' },
      { status: 500 }
    )
  }
}
