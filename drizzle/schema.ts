import { pgTable, text, timestamp, integer, boolean, uuid, varchar, decimal } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 50 }), // Phone number for magic link auth
  passwordHash: text('password_hash'), // Nullable for passwordless auth
  isAdmin: boolean('is_admin').default(false).notNull(),
  referralCode: varchar('referral_code', { length: 20 }).notNull().unique(),
  referredByCode: varchar('referred_by_code', { length: 20 }),
  allocationPoints: decimal('allocation_points', { precision: 12, scale: 3 }).default('0.000').notNull(), // Support decimal points
  registrationBonusAwarded: boolean('registration_bonus_awarded').default(false).notNull(), // NEW: Track if 10-point bonus given
  birthDecade: varchar('birth_decade', { length: 20 }), // NEW: Birth decade for demographics (e.g., '1980-1990')
  bitcoinAddress: varchar('bitcoin_address', { length: 255 }), // Bitcoin Taproot address for payments/rewards
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Survey responses
export const surveyResponses = pgTable('survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  email: varchar('email', { length: 255 }), // Optional
  phone: varchar('phone', { length: 50 }).notNull(), // Required
  region: varchar('region', { length: 20 }).notNull(), // Auto-detected from phone
  onCamera: boolean('on_camera').default(false).notNull(),
  newsletter: boolean('newsletter').default(true).notNull(),
  answers: text('answers').notNull(), // JSON string
  score: integer('score').default(0).notNull(),

  // Two-Tier Quiz System
  quickQuizScore: integer('quick_quiz_score'), // NEW: Score from 3-question quick quiz
  quickQuizQuestions: text('quick_quiz_questions'), // NEW: JSON array of question IDs used
  fullAssessmentScore: integer('full_assessment_score'), // NEW: Score from full 21-question assessment
  fullAssessmentCompleted: boolean('full_assessment_completed').default(false).notNull(),
  fullAssessmentCompletedAt: timestamp('full_assessment_completed_at'),

  referralCode: varchar('referral_code', { length: 20 }).notNull().unique(), // User's unique referral code
  referredBy: varchar('referred_by', { length: 20 }), // Code of person who referred them
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 support
  userAgent: text('user_agent'),
  submittedBy: uuid('submitted_by').references(() => users.id), // Admin who submitted (if applicable)
  isAdminSubmission: boolean('is_admin_submission').default(false).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
})

// Referrals tracking - Multi-level support
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id').references(() => users.id).notNull(), // Person who gets the points
  referredId: uuid('referred_id').references(() => users.id), // Person who signed up (optional until they create account)
  referredSurveyId: uuid('referred_survey_id').references(() => surveyResponses.id), // Survey of person who signed up
  referralLevel: integer('referral_level').default(1).notNull(), // 1=direct, 2=second-degree, etc.
  status: varchar('status', { length: 20 }).default('active').notNull(),
  pointsEarned: decimal('points_earned', { precision: 10, scale: 3 }).default('21.000').notNull(), // Support decimal points
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

  // Point Details
  points: decimal('points', { precision: 10, scale: 3 }).notNull(), // Support decimal points
  pointType: varchar('point_type', { length: 50 }), // NEW: categorize point source
  source: varchar('source', { length: 100 }).notNull(), // 'survey', 'referral', 'purchase'
  sourceId: uuid('source_id'),

  // Context
  description: text('description'),
  metadata: text('metadata'), // NEW: JSON string for flexible storage

  // Referral Context (if applicable)
  referralCode: varchar('referral_code', { length: 20 }),
  referralLevel: integer('referral_level'), // For referral source: 1=direct, 2=2nd degree, etc.
  referredUserId: uuid('referred_user_id').references(() => users.id),

  // Quiz Context (if applicable)
  quizType: varchar('quiz_type', { length: 20 }), // NEW: 'quick_quiz' or 'full_assessment'
  quizQuestionId: varchar('quiz_question_id', { length: 10 }), // NEW: which question
  quizCorrect: boolean('quiz_correct'), // NEW: was answer correct

  // Audit Trail
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 50 }), // NEW: 'user', 'system', 'admin'
  ipAddress: varchar('ip_address', { length: 45 }), // NEW: IPv6 support
  userAgent: text('user_agent'), // NEW: fraud detection

  // Verification
  verified: boolean('verified').default(true).notNull(),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: uuid('verified_by').references(() => users.id),

  // Reversal Support
  reversed: boolean('reversed').default(false).notNull(),
  reversedAt: timestamp('reversed_at'),
  reversedBy: uuid('reversed_by').references(() => users.id),
  reversalReason: text('reversal_reason'),
  reversalTransactionId: uuid('reversal_transaction_id'), // Self-reference without FK constraint
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

// Sticker codes for referral campaigns
export const stickerCodes = pgTable('sticker_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(), // The unique code printed on sticker
  claimed: boolean('claimed').default(false).notNull(), // Has someone claimed this code?
  claimedBy: uuid('claimed_by').references(() => users.id), // Who claimed it (first user)
  claimedBySurvey: uuid('claimed_by_survey').references(() => surveyResponses.id), // Which survey claimed it
  claimedAt: timestamp('claimed_at'), // When it was claimed
  usageCount: integer('usage_count').default(0).notNull(), // How many people used this as referral
  batchId: varchar('batch_id', { length: 50 }), // For grouping bulk generations
  notes: text('notes'), // Optional notes about this code/batch
  active: boolean('active').default(true).notNull(), // Can be deactivated if needed
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ==================== PIZZA BANK TABLES ====================

// Pizzerias - Participating pizza restaurants
export const pizzerias = pgTable('pizzerias', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).default('USA').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }), // GPS coordinates for map
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  hours: text('hours'), // JSON string: {"mon": "11am-10pm", ...}

  // Payment options
  acceptsBitcoin: boolean('accepts_bitcoin').default(false).notNull(),
  acceptsLightning: boolean('accepts_lightning').default(false).notNull(),
  lightningAddress: varchar('lightning_address', { length: 255 }),
  bitcoinAddress: varchar('bitcoin_address', { length: 255 }),

  // Features & stats
  imageUrl: text('image_url'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  totalOrders: integer('total_orders').default(0).notNull(),
  treasurySlicesAvailable: integer('treasury_slices_available').default(0).notNull(),
  treasuryPiesAvailable: integer('treasury_pies_available').default(0).notNull(),

  // Referral tracking
  referredByCode: varchar('referred_by_code', { length: 20 }), // Referral code of user who brought this pizzeria
  referredByUserId: uuid('referred_by_user_id').references(() => users.id), // Direct reference to referrer

  // Onboarding & Integration
  onboardingStatus: varchar('onboarding_status', { length: 20 }).default('pending').notNull(), // 'pending', 'payment_setup', 'api_integration', 'completed'
  paymentSetupCompleted: boolean('payment_setup_completed').default(false).notNull(),
  apiIntegrationCompleted: boolean('api_integration_completed').default(false).notNull(),
  apiKey: varchar('api_key', { length: 255 }), // API key for order fulfillment integration
  webhookUrl: text('webhook_url'), // URL for order status webhooks
  posSystem: varchar('pos_system', { length: 100 }), // e.g., 'Toast', 'Square', 'Clover', 'Custom'

  // Admin
  ownerId: uuid('owner_id').references(() => users.id), // User who manages this pizzeria
  verified: boolean('verified').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Pizza orders - Individual and group orders
export const pizzaOrders = pgTable('pizza_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  groupBuyId: uuid('group_buy_id').references(() => groupBuys.id), // If part of group buy

  // Order details
  orderType: varchar('order_type', { length: 20 }).notNull(), // 'individual', 'group', 'treasury_claim'
  items: text('items').notNull(), // JSON array: [{name, quantity, price}, ...]
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0.00'),
  finalAmount: decimal('final_amount', { precision: 10, scale: 2 }).notNull(),

  // Payment
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'bitcoin', 'lightning', 'fiat'
  paymentStatus: varchar('payment_status', { length: 20 }).default('pending').notNull(), // 'pending', 'confirmed', 'failed'
  paymentInvoiceId: text('payment_invoice_id'), // Invoice/payment request ID from payment provider
  paymentTxId: text('payment_tx_id'), // Transaction ID after payment confirmed
  paidAt: timestamp('paid_at'),

  // Fulfillment
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending', 'preparing', 'ready', 'completed', 'cancelled'
  pickupTime: timestamp('pickup_time'),
  deliveryAddress: text('delivery_address'),
  fulfillmentCode: varchar('fulfillment_code', { length: 20 }).notNull().unique(), // Code to claim order
  fulfilledAt: timestamp('fulfilled_at'),

  // Treasury contribution tracking
  contributesToTreasury: boolean('contributes_to_treasury').default(false).notNull(),
  treasurySlicesGenerated: integer('treasury_slices_generated').default(0).notNull(),

  // Metadata
  notes: text('notes'), // Special instructions
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Group buys - Coordinate bulk pizza orders
export const groupBuys = pgTable('group_buys', {
  id: uuid('id').defaultRandom().primaryKey(),
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id).notNull(),
  creatorId: uuid('creator_id').references(() => users.id).notNull(),

  // Group buy details
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  targetAmount: decimal('target_amount', { precision: 10, scale: 2 }).notNull(), // Minimum $ to activate
  currentAmount: decimal('current_amount', { precision: 10, scale: 2 }).default('0.00').notNull(),
  participantCount: integer('participant_count').default(0).notNull(),
  maxParticipants: integer('max_participants'), // Optional cap

  // Discount structure
  discountPercent: decimal('discount_percent', { precision: 5, scale: 2 }).notNull(), // e.g., 15.00 for 15%

  // Timing
  deadline: timestamp('deadline').notNull(), // When group buy closes
  pickupTime: timestamp('pickup_time'), // When orders can be picked up

  // Status
  status: varchar('status', { length: 20 }).default('active').notNull(), // 'active', 'funded', 'fulfilled', 'cancelled'
  activatedAt: timestamp('activated_at'), // When target reached
  completedAt: timestamp('completed_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Pizza treasury - Free pizza pool (pay-it-forward system)
export const pizzaTreasury = pgTable('pizza_treasury', {
  id: uuid('id').defaultRandom().primaryKey(),
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id).notNull(),

  // Contribution tracking
  fundedByOrderId: uuid('funded_by_order_id').references(() => pizzaOrders.id), // Which order generated this
  fundedByUserId: uuid('funded_by_user_id').references(() => users.id), // Who contributed
  itemType: varchar('item_type', { length: 20 }).notNull(), // 'slice', 'pie'
  quantity: integer('quantity').default(1).notNull(),

  // Claim tracking
  claimed: boolean('claimed').default(false).notNull(),
  claimedByUserId: uuid('claimed_by_user_id').references(() => users.id),
  claimCode: varchar('claim_code', { length: 20 }).unique(), // Code to redeem at pizzeria
  claimedAt: timestamp('claimed_at'),
  redeemedAt: timestamp('redeemed_at'), // When pizzeria confirmed redemption

  // Metadata
  expiresAt: timestamp('expires_at'), // Optional expiration
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Pizza events - Culture club events (pizza parties, tastings, etc.)
export const pizzaEvents = pgTable('pizza_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id),
  creatorId: uuid('creator_id').references(() => users.id).notNull(),

  // Event details
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'tasting', 'party', 'meetup', 'competition'
  imageUrl: text('image_url'),

  // Location (can be at pizzeria or custom location)
  locationName: varchar('location_name', { length: 255 }),
  address: text('address'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  // Timing
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),

  // Attendance
  maxAttendees: integer('max_attendees'),
  currentAttendees: integer('current_attendees').default(0).notNull(),
  requiresRsvp: boolean('requires_rsvp').default(true).notNull(),

  // Status
  status: varchar('status', { length: 20 }).default('upcoming').notNull(), // 'upcoming', 'ongoing', 'completed', 'cancelled'

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Event RSVPs
export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').references(() => pizzaEvents.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).default('attending').notNull(), // 'attending', 'maybe', 'cancelled'
  checkedIn: boolean('checked_in').default(false).notNull(),
  checkedInAt: timestamp('checked_in_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Culture club posts - Social feed for pizza experiences
export const cultureClubPosts = pgTable('culture_club_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id), // Optional tag
  orderId: uuid('order_id').references(() => pizzaOrders.id), // Optional link to order

  // Content
  content: text('content').notNull(),
  imageUrls: text('image_urls'), // JSON array of image URLs
  rating: integer('rating'), // 1-5 star rating if reviewing

  // Engagement
  likeCount: integer('like_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  shareCount: integer('share_count').default(0).notNull(),

  // Moderation
  reported: boolean('reported').default(false).notNull(),
  visible: boolean('visible').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Post likes
export const postLikes = pgTable('post_likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => cultureClubPosts.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Post comments
export const postComments = pgTable('post_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => cultureClubPosts.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Pizzeria affiliates - Referral/commission system for pizzerias
export const pizzeriaAffiliates = pgTable('pizzeria_affiliates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(), // Affiliate user
  pizzeriaId: uuid('pizzeria_id').references(() => pizzerias.id).notNull(), // Pizzeria they're promoting

  // Referral tracking
  referralCode: varchar('referral_code', { length: 20 }).notNull().unique(),
  ordersGenerated: integer('orders_generated').default(0).notNull(),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0.00').notNull(),

  // Commission structure
  commissionPercent: decimal('commission_percent', { precision: 5, scale: 2 }).default('10.00').notNull(), // e.g., 10.00 for 10%
  totalCommissionEarned: decimal('total_commission_earned', { precision: 10, scale: 2 }).default('0.00').notNull(),
  commissionPaid: decimal('commission_paid', { precision: 10, scale: 2 }).default('0.00').notNull(),

  // Status
  active: boolean('active').default(true).notNull(),
  approvedAt: timestamp('approved_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Magic links - Passwordless authentication via SMS
export const magicLinks = pgTable('magic_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  phone: varchar('phone', { length: 50 }).notNull(), // Phone number requesting auth
  token: varchar('token', { length: 64 }).notNull().unique(), // Unique token for verification
  expiresAt: timestamp('expires_at').notNull(), // Token expiration (typically 10 minutes)
  used: boolean('used').default(false).notNull(), // Has token been used?
  usedAt: timestamp('used_at'), // When was it used?
  ipAddress: varchar('ip_address', { length: 45 }), // IP that requested the link
  userAgent: text('user_agent'), // Browser/device info
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
