// lib/points/point-types.ts

export enum PointType {
  // Quiz Points
  QUICK_QUIZ = 'quick_quiz',
  FULL_ASSESSMENT = 'full_assessment',
  QUIZ_QUESTION = 'quiz_question',

  // Referral Points
  DIRECT_REFERRAL = 'direct_referral',
  SECOND_DEGREE_REFERRAL = 'second_degree_referral',
  THIRD_DEGREE_REFERRAL = 'third_degree_referral',
  FOURTH_DEGREE_REFERRAL = 'fourth_degree_referral',
  FIFTH_DEGREE_REFERRAL = 'fifth_degree_referral',

  // Bonus Points
  REGISTRATION_BONUS = 'registration_bonus',
  PROFILE_COMPLETION = 'profile_completion',
  EARLY_ADOPTER = 'early_adopter',

  // Community Points
  MEETUP_ATTENDANCE = 'meetup_attendance',
  BOOK_CLUB = 'book_club',
  NODE_RUNNER = 'node_runner',
  FIRST_INSCRIPTION = 'first_inscription',

  // Business Points
  MERCHANT_ONBOARD = 'merchant_onboard',
  FIRST_BITCOIN_PAYMENT = 'first_bitcoin_payment',

  // Achievement Points
  ACHIEVEMENT_UNLOCK = 'achievement_unlock',
  MILESTONE_REACHED = 'milestone_reached',

  // Admin Points
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  CONTEST_PRIZE = 'contest_prize',

  // Redemptions (negative points)
  REDEMPTION = 'redemption',

  // Legacy support (for old data)
  SURVEY = 'survey',
  REFERRAL = 'referral',
  PURCHASE = 'purchase'
}

export const POINT_TYPE_DESCRIPTIONS: Record<PointType, string> = {
  [PointType.QUICK_QUIZ]: 'Quick Quiz Completion',
  [PointType.FULL_ASSESSMENT]: 'Full Assessment Completion',
  [PointType.QUIZ_QUESTION]: 'Individual Question',
  [PointType.DIRECT_REFERRAL]: 'Direct Referral (Level 1)',
  [PointType.SECOND_DEGREE_REFERRAL]: '2nd Degree Referral (Level 2)',
  [PointType.THIRD_DEGREE_REFERRAL]: '3rd Degree Referral (Level 3)',
  [PointType.FOURTH_DEGREE_REFERRAL]: '4th Degree Referral (Level 4)',
  [PointType.FIFTH_DEGREE_REFERRAL]: '5th Degree Referral (Level 5)',
  [PointType.REGISTRATION_BONUS]: 'Registration Bonus',
  [PointType.PROFILE_COMPLETION]: 'Profile Completion',
  [PointType.EARLY_ADOPTER]: 'Early Adopter Bonus',
  [PointType.MEETUP_ATTENDANCE]: 'Meetup Attendance',
  [PointType.BOOK_CLUB]: 'Book Club Participation',
  [PointType.NODE_RUNNER]: 'Bitcoin Node Operation',
  [PointType.FIRST_INSCRIPTION]: 'First Inscription Created',
  [PointType.MERCHANT_ONBOARD]: 'Merchant Onboarded',
  [PointType.FIRST_BITCOIN_PAYMENT]: 'First Bitcoin Payment',
  [PointType.ACHIEVEMENT_UNLOCK]: 'Achievement Unlocked',
  [PointType.MILESTONE_REACHED]: 'Milestone Reached',
  [PointType.ADMIN_ADJUSTMENT]: 'Admin Adjustment',
  [PointType.CONTEST_PRIZE]: 'Contest Prize',
  [PointType.REDEMPTION]: 'Points Redeemed',
  [PointType.SURVEY]: 'Survey Completion (Legacy)',
  [PointType.REFERRAL]: 'Referral (Legacy)',
  [PointType.PURCHASE]: 'Package Purchase (Legacy)'
}

// Point values for easy reference
export const POINT_VALUES = {
  // Quiz
  EASY_QUESTION: 5,
  MEDIUM_QUESTION: 10,
  HARD_QUESTION: 15,

  // Bonuses
  REGISTRATION_BONUS: 10,
  PROFILE_COMPLETION: 5,

  // Referrals (Bitcoin halving structure)
  DIRECT_REFERRAL: 21,
  SECOND_DEGREE: 10.5,
  THIRD_DEGREE: 5.25,
  FOURTH_DEGREE: 2.25,
  FIFTH_DEGREE: 1.125,

  // Community
  FIRST_MEETUP: 25,
  BOOK_CLUB: 10,
  NODE_RUNNER: 50,
  FIRST_INSCRIPTION: 21,
  MERCHANT_ONBOARD: 100,
} as const
