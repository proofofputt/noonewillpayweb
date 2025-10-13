#!/usr/bin/env tsx

/**
 * Migration Script: Points History System Migration
 *
 * This script migrates existing points data to the new comprehensive
 * points tracking system with proper categorization and audit trails.
 *
 * What it does:
 * 1. Updates existing quiz points with proper point types and metadata
 * 2. Updates existing referral points with new categorization
 * 3. Backfills missing Quick Quiz data in survey responses
 * 4. Ensures all points have proper audit trail fields
 *
 * Safety: This script is idempotent and can be run multiple times safely.
 */

import db, { allocationPointsHistory, surveyResponses, users } from '@/lib/db'
import { eq, isNull, and, or } from 'drizzle-orm'
import { PointType } from '@/lib/points/point-types'

interface MigrationStats {
  totalRecords: number
  quizRecordsUpdated: number
  referralRecordsUpdated: number
  surveyRecordsUpdated: number
  errors: string[]
}

async function migratePointsHistory() {
  console.log('🚀 Starting Points History Migration...\n')

  const stats: MigrationStats = {
    totalRecords: 0,
    quizRecordsUpdated: 0,
    referralRecordsUpdated: 0,
    surveyRecordsUpdated: 0,
    errors: []
  }

  try {
    // Step 1: Get all existing points history records
    console.log('📊 Step 1: Fetching existing points history...')
    const allRecords = await db.select().from(allocationPointsHistory)
    stats.totalRecords = allRecords.length
    console.log(`   Found ${stats.totalRecords} existing records\n`)

    // Step 2: Update quiz-related points
    console.log('📝 Step 2: Migrating quiz points...')
    const quizRecords = allRecords.filter(r => r.source === 'survey')

    for (const record of quizRecords) {
      try {
        // Get the associated survey response
        const [survey] = record.sourceId
          ? await db.select().from(surveyResponses).where(eq(surveyResponses.id, record.sourceId)).limit(1)
          : []

        const updates: any = {
          pointType: PointType.QUICK_QUIZ,
          quizType: 'quick_quiz',
        }

        // Add metadata with original point value
        const metadata: any = {
          originalPoints: parseFloat(record.points),
          migrated: true,
          migrationDate: new Date().toISOString(),
          source: 'survey_migration',
        }

        if (survey) {
          metadata.surveyId = survey.id
          metadata.surveyScore = survey.score
        }

        updates.metadata = JSON.stringify(metadata)
        updates.createdBy = 'migration_script'

        // Update the record
        await db
          .update(allocationPointsHistory)
          .set(updates)
          .where(eq(allocationPointsHistory.id, record.id))

        stats.quizRecordsUpdated++
      } catch (error: any) {
        stats.errors.push(`Quiz record ${record.id}: ${error.message}`)
      }
    }
    console.log(`   ✓ Updated ${stats.quizRecordsUpdated} quiz records\n`)

    // Step 3: Update referral-related points
    console.log('🤝 Step 3: Migrating referral points...')
    const referralRecords = allRecords.filter(r =>
      r.source === 'referral' || r.referralLevel !== null
    )

    for (const record of referralRecords) {
      try {
        let pointType: PointType
        const level = record.referralLevel || 1

        // Map referral level to new point types
        switch (level) {
          case 1:
            pointType = PointType.DIRECT_REFERRAL
            break
          case 2:
            pointType = PointType.SECOND_DEGREE_REFERRAL
            break
          case 3:
            pointType = PointType.THIRD_DEGREE_REFERRAL
            break
          case 4:
            pointType = PointType.FOURTH_DEGREE_REFERRAL
            break
          case 5:
            pointType = PointType.FIFTH_DEGREE_REFERRAL
            break
          default:
            pointType = PointType.DIRECT_REFERRAL
        }

        const updates: any = {
          pointType,
        }

        // Add metadata
        const metadata: any = {
          originalPoints: parseFloat(record.points),
          migrated: true,
          migrationDate: new Date().toISOString(),
          source: 'referral_migration',
          referralLevel: level,
        }

        if (record.referralCode) {
          metadata.referralCode = record.referralCode
        }

        updates.metadata = JSON.stringify(metadata)
        updates.createdBy = 'migration_script'

        // Update the record
        await db
          .update(allocationPointsHistory)
          .set(updates)
          .where(eq(allocationPointsHistory.id, record.id))

        stats.referralRecordsUpdated++
      } catch (error: any) {
        stats.errors.push(`Referral record ${record.id}: ${error.message}`)
      }
    }
    console.log(`   ✓ Updated ${stats.referralRecordsUpdated} referral records\n`)

    // Step 4: Backfill Quick Quiz data in survey responses
    console.log('📋 Step 4: Backfilling Quick Quiz data in surveys...')
    const surveys = await db
      .select()
      .from(surveyResponses)
      .where(
        or(
          isNull(surveyResponses.quickQuizScore),
          isNull(surveyResponses.quickQuizQuestions)
        )
      )

    for (const survey of surveys) {
      try {
        // Parse answers to extract question IDs
        let questionIds: string[] = []

        if (survey.answers) {
          try {
            const parsedAnswers = JSON.parse(survey.answers)
            if (Array.isArray(parsedAnswers)) {
              questionIds = parsedAnswers.map((q: any) => q.id).filter(Boolean)
            }
          } catch (e) {
            // Skip if answers can't be parsed
          }
        }

        const updates: any = {}

        if (!survey.quickQuizScore && survey.score !== null) {
          updates.quickQuizScore = survey.score
        }

        if (!survey.quickQuizQuestions && questionIds.length > 0) {
          updates.quickQuizQuestions = JSON.stringify(questionIds)
        }

        if (Object.keys(updates).length > 0) {
          await db
            .update(surveyResponses)
            .set(updates)
            .where(eq(surveyResponses.id, survey.id))

          stats.surveyRecordsUpdated++
        }
      } catch (error: any) {
        stats.errors.push(`Survey ${survey.id}: ${error.message}`)
      }
    }
    console.log(`   ✓ Updated ${stats.surveyRecordsUpdated} survey records\n`)

    // Step 5: Add registration bonuses for users who don't have them
    console.log('🎁 Step 5: Adding missing registration bonuses...')
    let registrationBonusesAdded = 0

    const usersWithoutBonus = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.registrationBonusAwarded, false),
          // Only for users created after we implemented the bonus system
        )
      )
      .limit(100) // Safety limit

    for (const user of usersWithoutBonus) {
      try {
        // Check if they already have a registration bonus in history
        const existingBonus = await db
          .select()
          .from(allocationPointsHistory)
          .where(
            and(
              eq(allocationPointsHistory.userId, user.id),
              eq(allocationPointsHistory.source, 'registration')
            )
          )
          .limit(1)

        if (existingBonus.length === 0) {
          // Award registration bonus retroactively
          await db.insert(allocationPointsHistory).values({
            userId: user.id,
            points: '10',
            pointType: PointType.REGISTRATION_BONUS,
            source: 'registration',
            description: 'Registration bonus (retroactive)',
            metadata: JSON.stringify({
              migrated: true,
              migrationDate: new Date().toISOString(),
              retroactive: true,
            }),
            createdBy: 'migration_script',
            verified: true,
          })

          // Update user's total points
          const currentPoints = parseFloat(user.allocationPoints as any) || 0
          await db
            .update(users)
            .set({
              allocationPoints: (currentPoints + 10).toFixed(3),
              registrationBonusAwarded: true,
            })
            .where(eq(users.id, user.id))

          registrationBonusesAdded++
        }
      } catch (error: any) {
        stats.errors.push(`Registration bonus for user ${user.id}: ${error.message}`)
      }
    }
    console.log(`   ✓ Added ${registrationBonusesAdded} registration bonuses\n`)

    // Print final statistics
    console.log('📊 Migration Complete!\n')
    console.log('='.repeat(50))
    console.log('Statistics:')
    console.log(`  Total records processed: ${stats.totalRecords}`)
    console.log(`  Quiz records updated: ${stats.quizRecordsUpdated}`)
    console.log(`  Referral records updated: ${stats.referralRecordsUpdated}`)
    console.log(`  Survey records updated: ${stats.surveyRecordsUpdated}`)
    console.log(`  Registration bonuses added: ${registrationBonusesAdded}`)

    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`)
      console.log('First 10 errors:')
      stats.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
    } else {
      console.log('\n✅ No errors encountered!')
    }
    console.log('='.repeat(50))

    return stats
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migratePointsHistory()
    .then(() => {
      console.log('\n✅ Migration script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error)
      process.exit(1)
    })
}

export { migratePointsHistory }
