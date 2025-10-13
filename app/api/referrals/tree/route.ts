import { NextRequest, NextResponse } from 'next/server'
import { getReferralChain, getReferralStats, validateReferralChain } from '@/lib/multi-level-referrals'

/**
 * Get the full referral tree for a given referral code
 *
 * Query params:
 * - code: Referral code to get tree for (required)
 * - validate: If 'true', also run validation checks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const shouldValidate = searchParams.get('validate') === 'true'

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // Get basic stats
    const stats = await getReferralStats(code)

    // Get the upward chain (ancestors)
    const upwardChain = await getReferralChain(code)

    // Optionally validate the chain
    let validation = null
    if (shouldValidate) {
      validation = await validateReferralChain(code)
    }

    return NextResponse.json({
      success: true,
      referralCode: code,
      stats,
      upwardChain,
      validation,
    })
  } catch (error) {
    console.error('Error fetching referral tree:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch referral tree' },
      { status: 500 }
    )
  }
}
