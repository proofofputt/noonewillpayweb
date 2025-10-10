import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { surveyResponses, users, allocationPointsHistory } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getClientIP } from '@/lib/ip'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { detectRegionFromPhone } from '@/lib/phone-validation'

// Validation schema
const SurveySchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10, 'Phone number is required'),
  onCamera: z.boolean(),
  newsletter: z.boolean(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  })),
  timestamp: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate input
    const validated = SurveySchema.parse(data)

    // Auto-detect region from phone number
    const region = detectRegionFromPhone(validated.phone)

    // Get client IP address
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

    // Check if request is from admin
    const adminUser = await verifyAdminRequest(request)
    const isAdminSubmission = !!adminUser

    // For non-admin submissions, check for duplicates by IP
    if (!isAdminSubmission && ipAddress) {
      const [existingSubmission] = await db
        .select()
        .from(surveyResponses)
        .where(eq(surveyResponses.ipAddress, ipAddress))
        .limit(1)

      if (existingSubmission) {
        return NextResponse.json(
          {
            success: false,
            error: 'Survey already submitted from this device',
            alreadySubmitted: true
          },
          { status: 409 }
        )
      }
    }

    // Calculate score (simple scoring for now)
    const score = validated.questions.length * 100 // 100 points per question

    // Store survey response
    const [survey] = await db.insert(surveyResponses).values({
      email: validated.email || null,
      phone: validated.phone,
      region,
      onCamera: validated.onCamera,
      newsletter: validated.newsletter,
      answers: JSON.stringify(validated.questions),
      score,
      ipAddress,
      userAgent,
      submittedBy: adminUser?.userId || null,
      isAdminSubmission,
    }).returning()

    // If user exists, update their points (only if email provided)
    const existingUser = validated.email
      ? await db.select().from(users).where(eq(users.email, validated.email)).limit(1)
      : []
    const [userRecord] = existingUser

    if (userRecord) {
      await db.update(users)
        .set({ allocationPoints: userRecord.allocationPoints + score })
        .where(eq(users.id, userRecord.id))

      // Record points history
      await db.insert(allocationPointsHistory).values({
        userId: userRecord.id,
        points: score,
        source: 'survey',
        sourceId: survey.id,
        description: `Survey completed with score: ${score}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully',
      surveyId: survey.id,
      score,
      region,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid survey data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing survey:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}
