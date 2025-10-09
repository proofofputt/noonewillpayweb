import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { surveyResponses } from '@/lib/db'
import { getClientIP } from '@/lib/ip'
import { verifyAdminRequest } from '@/lib/admin-auth'

const InterviewSchema = z.object({
  sessionId: z.string(),
  participantInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    region: z.enum(['DC', 'MD', 'VA', 'OTHER']).optional(),
  }).optional(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    difficulty: z.string(),
  })),
  onCamera: z.boolean(),
  timestamp: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const validated = InterviewSchema.parse(data)

    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - admin access required' },
        { status: 401 }
      )
    }

    // Get client IP and user agent
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

    // Calculate score
    const score = validated.questions.length * 100

    // Store interview submission
    const [survey] = await db.insert(surveyResponses).values({
      email: validated.participantInfo?.email || 'anonymous@survey.local',
      phone: validated.participantInfo?.phone || null,
      region: validated.participantInfo?.region || 'OTHER',
      onCamera: validated.onCamera,
      newsletter: false, // Street interviews don't opt into newsletter by default
      answers: JSON.stringify(validated.questions),
      score,
      ipAddress,
      userAgent,
      submittedBy: adminUser.userId,
      isAdminSubmission: true,
    }).returning()

    return NextResponse.json({
      success: true,
      message: 'Interview submitted successfully',
      surveyId: survey.id,
      score,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid interview data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing interview:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit interview' },
      { status: 500 }
    )
  }
}
