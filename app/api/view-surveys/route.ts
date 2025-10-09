import { NextRequest, NextResponse } from 'next/server'
import db, { surveyResponses, users } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdminRequest(request)
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - admin access required' },
        { status: 401 }
      )
    }

    // Get all survey responses, ordered by most recent first
    const surveys = await db
      .select()
      .from(surveyResponses)
      .orderBy(desc(surveyResponses.timestamp))
      .limit(100) // Increased limit for admin view

    // Get submitter info for admin submissions
    const surveyIds = surveys.filter(s => s.submittedBy).map(s => s.submittedBy!)
    const submitters = surveyIds.length > 0
      ? await db.select().from(users).where(eq(users.id, surveyIds[0])) // Simplified for now
      : []

    // Parse answers JSON and add metadata for each survey
    const formattedSurveys = surveys.map(survey => ({
      id: survey.id,
      email: survey.email,
      phone: survey.phone,
      region: survey.region,
      onCamera: survey.onCamera,
      newsletter: survey.newsletter,
      score: survey.score,
      answers: JSON.parse(survey.answers),
      timestamp: survey.timestamp,
      // Metadata
      ipAddress: survey.ipAddress,
      userAgent: survey.userAgent,
      isAdminSubmission: survey.isAdminSubmission,
      submittedBy: survey.submittedBy,
    }))

    return NextResponse.json({
      success: true,
      count: formattedSurveys.length,
      surveys: formattedSurveys,
    })
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surveys' },
      { status: 500 }
    )
  }
}
