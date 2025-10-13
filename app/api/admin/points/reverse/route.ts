import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { PointsService } from '@/lib/points/points-service'

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, reason } = await request.json()

    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: 'Transaction ID and reason required' },
        { status: 400 }
      )
    }

    await PointsService.reversePoints(transactionId, admin.userId, reason)

    return NextResponse.json({
      success: true,
      message: 'Transaction reversed successfully'
    })
  } catch (error: any) {
    console.error('Error reversing transaction:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reverse transaction' },
      { status: 500 }
    )
  }
}
