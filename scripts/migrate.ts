/**
 * Run database migrations
 * Usage: npx tsx scripts/migrate.ts
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

async function runMigrations() {
  console.log('Running database migrations...')

  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  try {
    await migrate(db, { migrationsFolder: './drizzle/migrations' })
    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
