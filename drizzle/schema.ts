import { pgTable, text, timestamp, integer, boolean, uuid, varchar, decimal } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  referralCode: varchar('referral_code', { length: 20 }).notNull().unique(),
  referredByCode: varchar('referred_by_code', { length: 20 }),
  allocationPoints: integer('allocation_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Survey responses
export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  region: varchar('region', { length: 20 }).notNull(),
  onCamera: boolean('on_camera').default(false).notNull(),
  newsletter: boolean('newsletter').default(true).notNull(),
  answers: text('answers').notNull(), // JSON string
  score: integer('score').default(0).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

// Referrals tracking
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id').references(() => users.id).notNull(),
  referredId: uuid('referred_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  pointsEarned: integer('points_earned').default(50).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Marketplace packages
export const marketplacePackages = pgTable('marketplace_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull(),
  packageName: varchar('package_name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  regularPrice: decimal('regular_price', { precision: 10, scale: 2 }).notNull(),
  matesPrice: decimal('mates_price', { precision: 10, scale: 2 }).notNull(),
  generatesCharity: boolean('generates_charity').default(true).notNull(),
  charityThreshold: integer('charity_threshold').default(5).notNull(),
  charityCounter: integer('charity_counter').default(0).notNull(),
  maxRedemptions: integer('max_redemptions'),
  currentRedemptions: integer('current_redemptions').default(0).notNull(),
  expiresAt: timestamp('expires_at'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Package purchases
export const packagePurchases = pgTable('package_purchases', {
  id: uuid('id').defaultRandom().primaryKey(),
  packageId: uuid('package_id').references(() => marketplacePackages.id).notNull(),
  businessId: uuid('business_id').notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentTxId: text('payment_tx_id'),
  redemptionCode: varchar('redemption_code', { length: 50 }).notNull().unique(),
  redeemed: boolean('redeemed').default(false).notNull(),
  redeemedAt: timestamp('redeemed_at'),
  contributesToCharity: boolean('contributes_to_charity').default(true).notNull(),
  allocationPointsEarned: integer('allocation_points_earned').default(25).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Charity pool
export const charityPool = pgTable('charity_pool', {
  id: uuid('id').defaultRandom().primaryKey(),
  packageId: uuid('package_id').references(() => marketplacePackages.id).notNull(),
  businessId: uuid('business_id').notNull(),
  claimCode: varchar('claim_code', { length: 50 }).notNull().unique(),
  claimed: boolean('claimed').default(false).notNull(),
  claimedBy: uuid('claimed_by').references(() => users.id),
  claimedAt: timestamp('claimed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Allocation points history
export const allocationPointsHistory = pgTable('allocation_points_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  points: integer('points').notNull(),
  source: varchar('source', { length: 100 }).notNull(), // 'survey', 'referral', 'purchase'
  sourceId: uuid('source_id'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Business partners
export const businessPartners = pgTable('business_partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull().unique(),
  contactPhone: varchar('contact_phone', { length: 50 }),
  address: text('address'),
  category: varchar('category', { length: 100 }).notNull(),
  region: varchar('region', { length: 50 }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
