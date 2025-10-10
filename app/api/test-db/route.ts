import { NextResponse } from 'next/server'
import db, { surveyResponses } from '@/lib/db'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Test 1: Basic connection
    const timeResult = await sql`SELECT NOW() as current_time`

    // Test 2: Count submissions
    const count = await db.select().from(surveyResponses)

    // Test 3: Check schema
    const schemaCheck = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'survey_responses'
      ORDER BY ordinal_position
    `

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        currentTime: timeResult[0].current_time,
        submissionCount: count.length,
        tableExists: schemaCheck.length > 0,
        columns: schemaCheck.map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES'
        }))
      },
      message: 'Database connection successful'
    })
  } catch (error: any) {
    console.error('Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}
