import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db, { surveyResponses, users, allocationPointsHistory, stickerCodes } from '@/lib/db'
import { eq, or } from 'drizzle-orm'
import { getClientIP } from '@/lib/ip'
import { verifyAdminRequest } from '@/lib/admin-auth'
import { detectRegionFromPhone } from '@/lib/phone-validation'
import { generateReferralCode, isValidReferralCode } from '@/lib/referral'
import { generateUsernameFromPhone, createToken } from '@/lib/auth'
import { getAllQuestions, scoreQuestions, type Question } from '@/lib/questions'
import { awardMultiLevelReferralPoints } from '@/lib/multi-level-referrals'
import { recordQuickQuizPoints } from '@/lib/points/quiz-points'

// Validation schema
const SurveySchema = z.object({
  email: z.string().email().or(z.literal('')).optional(),
  phone: z.string().min(10, 'Phone number is required'),
  onCamera: z.boolean(),
  newsletter: z.boolean(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  })),
  answers: z.object({
    question1: z.string(),
    question2: z.string(),
    question3: z.string(),
  }),
  referredBy: z.string().optional(), // Referral code from URL
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

    // Check if IP blocking is disabled (for testing)
    const ipBlockingDisabled = process.env.DISABLE_IP_BLOCKING === 'true'

    // Exempt test phone numbers from duplicate checks
    const exemptPhones = (process.env.EXEMPT_PHONE_NUMBERS || '').split(',').map(p => p.trim())
    const isExemptPhone = exemptPhones.includes(validated.phone)

    // For non-admin submissions, check for duplicates by IP OR phone number
    if (!isAdminSubmission && !ipBlockingDisabled && !isExemptPhone) {
      const conditions = []

      // Add IP check if available
      if (ipAddress) {
        conditions.push(eq(surveyResponses.ipAddress, ipAddress))
      }

      // Always check phone number (required field)
      conditions.push(eq(surveyResponses.phone, validated.phone))

      // Query for existing submission with same IP or phone
      const [existingSubmission] = await db
        .select()
        .from(surveyResponses)
        .where(or(...conditions))
        .limit(1)

      if (existingSubmission) {
        // Determine which field matched
        const matchedByIP = existingSubmission.ipAddress === ipAddress
        const matchedByPhone = existingSubmission.phone === validated.phone

        let errorMessage = 'Survey already submitted'
        if (matchedByPhone && matchedByIP) {
          errorMessage = 'Survey already submitted from this device and phone number'
        } else if (matchedByPhone) {
          errorMessage = 'Survey already submitted with this phone number'
        } else if (matchedByIP) {
          errorMessage = 'Survey already submitted from this device'
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
            alreadySubmitted: true,
            matchedByIP,
            matchedByPhone
          },
          { status: 409 }
        )
      }
    }

    // Calculate proper score based on correct answers
    const allQuestions = getAllQuestions()
    const userQuestions = validated.questions.map(q =>
      allQuestions.find(aq => aq.id === q.id)
    ).filter(Boolean) as Question[]

    const scoringResult = scoreQuestions(userQuestions, validated.answers)
    const { totalScore, maxScore, percentage, scoredQuestions } = scoringResult

    // Generate unique referral code for this survey response
    const referralCode = await generateReferralCode()

    // Check if user account exists by phone or email
    let userRecord = null

    try {
      console.log(`[Survey Submit] Checking for existing user with phone: ${validated.phone}`)

      // First try to find by phone (primary identifier)
      const [existingUserByPhone] = await db
        .select()
        .from(users)
        .where(eq(users.phone, validated.phone))
        .limit(1)

      if (existingUserByPhone) {
        userRecord = existingUserByPhone
        console.log(`[Survey Submit] Found existing user by phone: ${existingUserByPhone.id}`)
      } else if (validated.email) {
        // Fallback: try to find by email
        const [existingUserByEmail] = await db
          .select()
          .from(users)
          .where(eq(users.email, validated.email))
          .limit(1)

        if (existingUserByEmail) {
          userRecord = existingUserByEmail
          console.log(`[Survey Submit] Found existing user by email: ${existingUserByEmail.id}`)
          // Update phone on existing email-based account
          await db
            .update(users)
            .set({ phone: validated.phone })
            .where(eq(users.id, existingUserByEmail.id))
        }
      }

      // If no user account exists, create one automatically
      if (!userRecord) {
        console.log(`[Survey Submit] No existing user found, creating new account`)

        const username = validated.email
          ? validated.email.split('@')[0]
          : generateUsernameFromPhone(validated.phone)

        const userReferralCode = await generateReferralCode()

        // Generate unique email from phone if email not provided
        const phoneDigits = validated.phone.replace(/\D/g, '')
        const userEmail = validated.email || `phone_${phoneDigits}@noonewillpay.app`

        console.log(`[Survey Submit] Creating user with email: ${userEmail}, username: ${username}`)

        const [newUser] = await db.insert(users).values({
          email: userEmail,
          username,
          phone: validated.phone,
          passwordHash: null, // Passwordless auth
          referralCode: userReferralCode,
          referredByCode: validated.referredBy || null,
          allocationPoints: '0',
          registrationBonusAwarded: false,
        }).returning()

        userRecord = newUser

        console.log(`[Survey Submit] Created new user account: ${newUser.id}`)
      }
    } catch (error) {
      console.error('[Survey Submit] Error in user creation/lookup:', error)
      console.error('[Survey Submit] Error details:', error instanceof Error ? error.message : String(error))
      throw error
    }

    // Handle sticker codes and regular referrals
    let referredBy: string | null = null
    let claimedStickerCode: string | null = null

    if (validated.referredBy && isValidReferralCode(validated.referredBy)) {
      const providedCode = validated.referredBy

      // Check if it's a sticker code
      const [stickerCode] = await db
        .select()
        .from(stickerCodes)
        .where(eq(stickerCodes.code, providedCode))
        .limit(1)

      if (stickerCode && stickerCode.active) {
        // This is a sticker code!
        if (!stickerCode.claimed) {
          // FIRST USER - Claim this sticker code
          claimedStickerCode = stickerCode.code
          // Will update sticker after survey is created
        } else {
          // SUBSEQUENT USERS - Referred by the person who claimed the sticker
          // Find the survey that claimed this sticker to get their referral code
          if (stickerCode.claimedBySurvey) {
            const [claimerSurvey] = await db
              .select()
              .from(surveyResponses)
              .where(eq(surveyResponses.id, stickerCode.claimedBySurvey))
              .limit(1)

            if (claimerSurvey) {
              referredBy = claimerSurvey.referralCode
              // Increment usage count on sticker code
              await db
                .update(stickerCodes)
                .set({ usageCount: stickerCode.usageCount + 1 })
                .where(eq(stickerCodes.id, stickerCode.id))
            }
          }
        }
      } else {
        // Regular referral code (from another survey response)
        referredBy = providedCode
      }
    }

    // Store survey response with Quick Quiz data
    const questionIds = userQuestions.map(q => q.id)
    let survey

    try {
      console.log(`[Survey Submit] Creating survey response with referralCode: ${referralCode}, userId: ${userRecord?.id}`)

      const [createdSurvey] = await db.insert(surveyResponses).values({
        email: validated.email || null,
        phone: validated.phone,
        region,
        onCamera: validated.onCamera,
        newsletter: validated.newsletter,
        answers: JSON.stringify(scoredQuestions), // Store scored questions with explanations
        score: totalScore,
        quickQuizScore: totalScore, // Store Quick Quiz score
        quickQuizQuestions: JSON.stringify(questionIds), // Store Quick Quiz question IDs
        referralCode,
        referredBy,
        ipAddress,
        userAgent,
        userId: userRecord?.id || null, // Link to user if exists
        submittedBy: adminUser?.userId || null,
        isAdminSubmission,
      }).returning()

      survey = createdSurvey
      console.log(`[Survey Submit] Successfully created survey response: ${survey.id}`)
    } catch (error) {
      console.error('[Survey Submit] Error creating survey response:', error)
      console.error('[Survey Submit] Survey data:', {
        phone: validated.phone,
        referralCode,
        referredBy,
        userId: userRecord?.id
      })
      throw error
    }

    // If this user claimed a sticker code, update it
    if (claimedStickerCode) {
      await db
        .update(stickerCodes)
        .set({
          claimed: true,
          claimedBySurvey: survey.id,
          claimedBy: userRecord?.id || null,
          claimedAt: new Date(),
        })
        .where(eq(stickerCodes.code, claimedStickerCode))
    }

    // Award multi-level referral points to the entire chain
    let multiLevelResults = null
    if (referredBy) {
      console.log(`[Survey Submit] Awarding multi-level referral points for survey ${survey.id}, referred by ${referredBy}`)

      multiLevelResults = await awardMultiLevelReferralPoints(survey.id, referredBy)

      console.log(`[Survey Submit] Multi-level results: ${multiLevelResults.levelsAwarded} levels, ${multiLevelResults.totalPoints} total points`)

      if (multiLevelResults.errors.length > 0) {
        console.error(`[Survey Submit] Multi-level referral errors:`, multiLevelResults.errors)
      }
    }

    // If user exists, award Quick Quiz points via PointsService
    if (userRecord) {
      // Prepare questions data for points recording
      const questionsForPoints = scoredQuestions.map(sq => ({
        id: sq.id,
        correct: sq.isCorrect,
        points: sq.pointsEarned
      }))

      // Award points through PointsService with full audit trail
      await recordQuickQuizPoints(
        userRecord.id,
        questionsForPoints,
        totalScore,
        ipAddress || undefined,
        userAgent || undefined
      )

      // Note: PointsService handles both points history recording and user total update
    }

    // Create session token for auto-login
    const sessionToken = await createToken({
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      referralCode: userRecord.referralCode,
    })

    const response = NextResponse.json({
      success: true,
      message: 'Survey submitted successfully',
      surveyId: survey.id,
      score: totalScore,
      maxScore,
      percentage,
      referralCode,
      scoredQuestions, // Include for results page
      region,
      // Return user info for client
      user: {
        id: userRecord.id,
        email: userRecord.email,
        username: userRecord.username,
        referralCode: userRecord.referralCode,
      }
    })

    // Set secure cookie for auto-login
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid survey data', details: error.errors },
        { status: 400 }
      )
    }

    // Log detailed error information
    console.error('Error processing survey:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Error message:', error instanceof Error ? error.message : String(error))

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit survey',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
