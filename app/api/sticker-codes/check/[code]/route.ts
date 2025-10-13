import { NextRequest, NextResponse } from 'next/server'
import db, { stickerCodes } from '@/lib/db'
import { eq } from 'drizzle-orm'

/**
 * Check the status of a sticker code
 * Public endpoint - can be called without authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code

    // Find the sticker code
    const [stickerCode] = await db
      .select()
      .from(stickerCodes)
      .where(eq(stickerCodes.code, code))
      .limit(1)

    if (!stickerCode) {
      return NextResponse.json({
        success: false,
        exists: false,
        message: 'Sticker code not found',
      }, { status: 404 })
    }

    // Don't expose sensitive information
    return NextResponse.json({
      success: true,
      exists: true,
      code: stickerCode.code,
      claimed: stickerCode.claimed,
      claimedAt: stickerCode.claimedAt,
      usageCount: stickerCode.usageCount,
      active: stickerCode.active,
      message: stickerCode.claimed
        ? 'This sticker has been claimed and is now a referral code'
        : 'This sticker is available to claim'
    })
  } catch (error) {
    console.error('Error checking sticker code:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check code' },
      { status: 500 }
    )
  }
}
