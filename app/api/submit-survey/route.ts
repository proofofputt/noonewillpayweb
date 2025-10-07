import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { surveyResponses, users, allocationPointsHistory } from '@/lib/db'
import { eq } from 'drizzle-orm'

// Validation schema
const SurveySchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  region: z.enum(['DC', 'MD', 'VA', 'OTHER']),
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

    // Calculate score (simple scoring for now)
    const score = validated.questions.length * 100 // 100 points per question

    // Store survey response
    const [survey] = await db.insert(surveyResponses).values({
      email: validated.email,
      phone: validated.phone || null,
      region: validated.region,
      onCamera: validated.onCamera,
      newsletter: validated.newsletter,
      answers: JSON.stringify(validated.questions),
      score,
    }).returning()

    // If user exists, update their points
    const [existingUser] = await db.select().from(users).where(eq(users.email, validated.email)).limit(1)

    if (existingUser) {
      await db.update(users)
        .set({ allocationPoints: existingUser.allocationPoints + score })
        .where(eq(users.id, existingUser.id))

      // Record points history
      await db.insert(allocationPointsHistory).values({
        userId: existingUser.id,
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
