import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../drizzle/schema'

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Create Neon HTTP client
export const sql = neon(process.env.DATABASE_URL)

// Create Drizzle ORM instance
export const db = drizzle(sql, { schema })

// Export types
export type DB = typeof db
export * from '../drizzle/schema'

export default db
