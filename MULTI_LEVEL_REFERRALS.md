# Multi-Level Referral System Documentation

## Overview

The multi-level referral system implements a Bitcoin-style halving mechanism for referral rewards, where users earn points not just for direct referrals, but also for referrals made by their referrals, up to 5 levels deep.

## Points Structure (Bitcoin-Style Halving)

```
Level 1 (Direct):      21.000 points
Level 2 (2nd degree):  10.500 points  (50% halving)
Level 3 (3rd degree):   5.250 points  (50% halving)
Level 4 (4th degree):   2.250 points  (custom reduction)
Level 5 (5th degree):   1.125 points  (50% halving)
```

### Example Scenario

```
Alice completes survey (referral code: ALICE123)
  ↓ refers
Bob completes survey (referral code: BOB456, referred_by: ALICE123)
  ↓ refers
Carol completes survey (referral code: CAROL789, referred_by: BOB456)
  ↓ refers
David completes survey (referral code: DAVID012, referred_by: CAROL789)
  ↓ refers
Eve completes survey (referral code: EVE345, referred_by: DAVID012)
  ↓ refers
Frank completes survey (referral code: FRANK678, referred_by: EVE345)
```

**When Frank completes his survey, points are awarded:**
- Eve gets 21.000 points (Level 1 - direct referral)
- David gets 10.500 points (Level 2 - Bob referred Carol who referred David who referred Eve who referred Frank)
- Carol gets 5.250 points (Level 3)
- Bob gets 2.250 points (Level 4)
- Alice gets 1.125 points (Level 5)

**Total points distributed:** 40.125 points per new referral

## Database Schema

### Key Tables

#### `referrals` Table
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  referred_survey_id UUID REFERENCES survey_responses(id),
  referral_level INTEGER DEFAULT 1 NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  points_earned DECIMAL(10,3) DEFAULT 21.000,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `allocation_points_history` Table
```sql
CREATE TABLE allocation_points_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  points DECIMAL(10,3) NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_id UUID,
  referral_level INTEGER,  -- NEW: tracks which level this referral was
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `users` Table (Updated)
```sql
ALTER TABLE users
  ALTER COLUMN allocation_points TYPE DECIMAL(12,3);
```

## Core Functions

### 1. `getReferralChain()`

Recursively walks up the referral chain to find all ancestors.

```typescript
export async function getReferralChain(
  startingReferralCode: string,
  maxDepth: number = MAX_REFERRAL_DEPTH
): Promise<ReferralChainNode[]>
```

**Parameters:**
- `startingReferralCode` - The code of the person who made the direct referral
- `maxDepth` - Maximum levels to traverse (default: 5)

**Returns:** Array of `ReferralChainNode` objects, ordered from closest to furthest ancestor

**Example:**
```typescript
const chain = await getReferralChain('BOB456')
// Returns:
// [
//   { surveyId: '...', referralCode: 'BOB456', level: 1, points: 21.000 },
//   { surveyId: '...', referralCode: 'ALICE123', level: 2, points: 10.500 }
// ]
```

### 2. `awardMultiLevelReferralPoints()`

Awards points to all ancestors in the referral chain.

```typescript
export async function awardMultiLevelReferralPoints(
  newSurveyId: string,
  referredByCode: string
): Promise<{
  success: boolean
  levelsAwarded: number
  totalPoints: number
  chain: ReferralChainNode[]
  errors: string[]
}>
```

**Parameters:**
- `newSurveyId` - ID of the newly completed survey
- `referredByCode` - Referral code of the person who directly referred the new user

**Side Effects:**
1. Creates `referrals` records for each level
2. Updates `users.allocation_points` for each ancestor
3. Creates `allocation_points_history` records

**Example:**
```typescript
const result = await awardMultiLevelReferralPoints(
  'survey-uuid-123',
  'BOB456'
)
// result.levelsAwarded = 2 (Bob and Alice)
// result.totalPoints = 31.500 (21 + 10.5)
```

### 3. `getReferralStats()`

Get comprehensive statistics for a user's referrals.

```typescript
export async function getReferralStats(referralCode: string): Promise<{
  totalReferrals: number
  directReferrals: number
  referralsByLevel: Record<number, number>
  pointsByLevel: Record<number, number>
  totalPoints: number
}>
```

**Example Response:**
```json
{
  "totalReferrals": 15,
  "directReferrals": 5,
  "referralsByLevel": {
    "1": 5,
    "2": 6,
    "3": 3,
    "4": 1
  },
  "pointsByLevel": {
    "1": 105.000,
    "2": 63.000,
    "3": 15.750,
    "4": 2.250
  },
  "totalPoints": 186.000
}
```

### 4. `validateReferralChain()`

Checks for circular references and broken chains.

```typescript
export async function validateReferralChain(referralCode: string): Promise<{
  valid: boolean
  issues: string[]
  chain: ReferralChainNode[]
}>
```

## API Endpoints

### GET `/api/profile/stats`

Get user's referral statistics including multi-level breakdown.

**Query Parameters:**
- `referralCode` - User's referral code
- `phone` - User's phone number (alternative)
- `email` - User's email (alternative)

**Response:**
```json
{
  "success": true,
  "user": {
    "referralCode": "ALICE123",
    "email": "alice@example.com",
    "score": 85
  },
  "multiLevel": {
    "totalReferrals": 15,
    "directReferrals": 5,
    "referralsByLevel": {
      "1": 5,
      "2": 6,
      "3": 3,
      "4": 1
    },
    "pointsByLevel": {
      "1": 105.000,
      "2": 63.000,
      "3": 15.750,
      "4": 2.250
    },
    "totalPoints": 186.000,
    "pointsStructure": {
      "1": 21.000,
      "2": 10.500,
      "3": 5.250,
      "4": 2.250,
      "5": 1.125
    }
  }
}
```

### GET `/api/referrals/tree`

Get the full referral tree for a given referral code.

**Query Parameters:**
- `code` - Referral code (required)
- `validate` - Set to 'true' to run validation checks (optional)

**Response:**
```json
{
  "success": true,
  "referralCode": "BOB456",
  "stats": {
    "totalReferrals": 8,
    "directReferrals": 3,
    "referralsByLevel": { "1": 3, "2": 5 },
    "pointsByLevel": { "1": 63.000, "2": 52.500 },
    "totalPoints": 115.500
  },
  "upwardChain": [
    {
      "surveyId": "...",
      "referralCode": "BOB456",
      "level": 1,
      "points": 21.000
    },
    {
      "surveyId": "...",
      "referralCode": "ALICE123",
      "level": 2,
      "points": 10.500
    }
  ],
  "validation": {
    "valid": true,
    "issues": []
  }
}
```

### POST `/api/submit-survey`

Submit a survey response with referral tracking.

**Body:**
```json
{
  "email": "frank@example.com",
  "phone": "+1234567890",
  "onCamera": true,
  "newsletter": false,
  "questions": [...],
  "answers": {...},
  "referredBy": "EVE345",
  "timestamp": "2024-10-12T..."
}
```

**Behavior:**
When a survey is submitted with a `referredBy` code, the system automatically:
1. Creates the survey response
2. Generates a unique referral code for the new user
3. Calls `awardMultiLevelReferralPoints()` to walk up the chain
4. Awards points to all ancestors (up to 5 levels)
5. Creates records in `referrals` and `allocation_points_history`

## Integration with Sticker Codes

Sticker codes integrate seamlessly with the multi-level system:

1. **First User Claims Sticker:**
   - Scans QR code with unique sticker code (e.g., `STICKER-ABC123`)
   - Completes survey
   - Sticker code is marked as `claimed` and linked to their survey
   - User becomes the "owner" of that sticker code

2. **Subsequent Users:**
   - Scan the same QR code
   - System detects sticker is already claimed
   - Automatically sets `referredBy` to the claimer's referral code
   - Multi-level point distribution flows up from the claimer

**Example:**
```
Sticker Code: STICKER-ABC123

Alice scans first → Claims sticker → Gets referral code ALICE123
Bob scans same sticker → referred_by = ALICE123 → Alice gets 21 points
Carol scans same sticker → referred_by = ALICE123 → Alice gets 21 points
```

If Bob then refers David through his own code:
```
David → referred_by = BOB456
  Bob gets 21 points (level 1)
  Alice gets 10.5 points (level 2, because she referred Bob)
```

## Testing Guide

### Test Scenario 1: Basic Chain

```bash
# 1. Create first user (Alice)
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15551111111",
    "email": "alice@test.com",
    "onCamera": true,
    "newsletter": false,
    "questions": [...],
    "answers": {...},
    "timestamp": "2024-10-12T10:00:00Z"
  }'
# Note Alice's referralCode from response

# 2. Create second user (Bob) referred by Alice
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15552222222",
    "email": "bob@test.com",
    "referredBy": "ALICE_REFERRAL_CODE",
    ...
  }'
# Alice should receive 21 points

# 3. Create third user (Carol) referred by Bob
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15553333333",
    "email": "carol@test.com",
    "referredBy": "BOB_REFERRAL_CODE",
    ...
  }'
# Bob receives 21 points (level 1)
# Alice receives 10.5 points (level 2)

# 4. Check Alice's stats
curl "http://localhost:3000/api/profile/stats?referralCode=ALICE_REFERRAL_CODE"
# Should show:
# - directReferrals: 1 (Bob)
# - totalReferrals: 2 (Bob + Carol)
# - pointsByLevel: { "1": 21.000, "2": 10.500 }
# - totalPoints: 31.500
```

### Test Scenario 2: Full 5-Level Chain

Create a chain of 6 users to test all levels:

```
User 1 (Alice)
  ↓ refers
User 2 (Bob)
  ↓ refers
User 3 (Carol)
  ↓ refers
User 4 (David)
  ↓ refers
User 5 (Eve)
  ↓ refers
User 6 (Frank)
```

When Frank completes survey:
- Eve: +21.000 points
- David: +10.500 points
- Carol: +5.250 points
- Bob: +2.250 points
- Alice: +1.125 points

**Validation:**
```bash
# Check Eve's points (should be 21.000)
curl "http://localhost:3000/api/profile/stats?referralCode=EVE_CODE"

# Check Alice's points (should be 1.125)
curl "http://localhost:3000/api/profile/stats?referralCode=ALICE_CODE"

# Validate the chain
curl "http://localhost:3000/api/referrals/tree?code=EVE_CODE&validate=true"
```

### Test Scenario 3: Sticker Code Integration

```bash
# 1. Generate sticker codes (admin endpoint)
curl -X POST http://localhost:3000/api/admin/generate-sticker-codes \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "batchSize": 1,
    "batchId": "test-batch-1"
  }'
# Note the sticker code from response

# 2. First user claims sticker
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15551111111",
    "email": "alice@test.com",
    "referredBy": "STICKER_CODE",
    ...
  }'
# Alice claims the sticker

# 3. Second user uses same sticker
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15552222222",
    "email": "bob@test.com",
    "referredBy": "STICKER_CODE",
    ...
  }'
# Bob is automatically referred by Alice
# Alice receives 21 points

# 4. Third user uses same sticker
curl -X POST http://localhost:3000/api/submit-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15553333333",
    "email": "carol@test.com",
    "referredBy": "STICKER_CODE",
    ...
  }'
# Carol is automatically referred by Alice
# Alice receives another 21 points

# 5. Check Alice's stats
curl "http://localhost:3000/api/profile/stats?referralCode=ALICE_CODE"
# Should show:
# - directReferrals: 2 (Bob and Carol)
# - stickerCodes: [{ code: "STICKER_CODE", usageCount: 2, ... }]
```

## Dashboard Integration

To display multi-level referral data on a user dashboard:

```typescript
'use client'

import { useEffect, useState } from 'react'

interface MultiLevelStats {
  totalReferrals: number
  directReferrals: number
  referralsByLevel: Record<number, number>
  pointsByLevel: Record<number, number>
  totalPoints: number
  pointsStructure: Record<number, number>
}

export default function ReferralDashboard({ referralCode }: { referralCode: string }) {
  const [stats, setStats] = useState<MultiLevelStats | null>(null)

  useEffect(() => {
    fetch(`/api/profile/stats?referralCode=${referralCode}`)
      .then(res => res.json())
      .then(data => setStats(data.multiLevel))
  }, [referralCode])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="referral-dashboard">
      <h2>Multi-Level Referral Stats</h2>

      <div className="summary">
        <div>Total Referrals: {stats.totalReferrals}</div>
        <div>Direct Referrals: {stats.directReferrals}</div>
        <div>Total Points: {stats.totalPoints.toFixed(3)}</div>
      </div>

      <div className="by-level">
        <h3>Breakdown by Level</h3>
        {Object.entries(stats.referralsByLevel).map(([level, count]) => (
          <div key={level} className="level-row">
            <span>Level {level}:</span>
            <span>{count} referrals</span>
            <span>×</span>
            <span>{stats.pointsStructure[parseInt(level)]} points</span>
            <span>=</span>
            <span className="total">{stats.pointsByLevel[parseInt(level)].toFixed(3)} points</span>
          </div>
        ))}
      </div>

      <div className="points-structure">
        <h3>Points Structure (Bitcoin-Style Halving)</h3>
        <ul>
          <li>Level 1 (Direct): {stats.pointsStructure[1]} points</li>
          <li>Level 2: {stats.pointsStructure[2]} points (50% halving)</li>
          <li>Level 3: {stats.pointsStructure[3]} points (50% halving)</li>
          <li>Level 4: {stats.pointsStructure[4]} points</li>
          <li>Level 5: {stats.pointsStructure[5]} points (50% halving)</li>
        </ul>
      </div>
    </div>
  )
}
```

## Troubleshooting

### Issue: Points Not Being Awarded

**Check:**
1. Verify the referral code exists in `survey_responses`
2. Check server logs for `[Multi-Level Referrals]` messages
3. Ensure `survey_responses.userId` is set (needed for point awards)

**Debug Query:**
```sql
SELECT
  sr.referral_code,
  sr.referred_by,
  sr.user_id,
  u.allocation_points
FROM survey_responses sr
LEFT JOIN users u ON sr.user_id = u.id
WHERE sr.referral_code = 'YOUR_CODE';
```

### Issue: Circular Reference Detected

**Cause:** A referral chain loops back on itself (A → B → C → A)

**Check:**
```bash
curl "http://localhost:3000/api/referrals/tree?code=YOUR_CODE&validate=true"
```

**Fix:**
```sql
-- Find the circular reference
SELECT referral_code, referred_by FROM survey_responses
WHERE referral_code IN ('CODE1', 'CODE2', 'CODE3');

-- Break the cycle by updating one record
UPDATE survey_responses
SET referred_by = NULL
WHERE referral_code = 'PROBLEMATIC_CODE';
```

### Issue: Points Calculation Mismatch

**Verify the calculation:**
```sql
-- Check all referrals for a user
SELECT
  r.referral_level,
  r.points_earned,
  COUNT(*) as count,
  SUM(r.points_earned::numeric) as total_points
FROM referrals r
WHERE r.referrer_id = 'USER_UUID'
GROUP BY r.referral_level, r.points_earned
ORDER BY r.referral_level;

-- Compare with user's total
SELECT allocation_points FROM users WHERE id = 'USER_UUID';
```

### Issue: Sticker Code Not Working

**Check sticker status:**
```sql
SELECT
  code,
  active,
  claimed,
  claimed_by_survey,
  claimed_at,
  usage_count
FROM sticker_codes
WHERE code = 'STICKER_CODE';
```

**Common fixes:**
1. Ensure sticker is `active = true`
2. Check if `claimed_by_survey` references a valid survey
3. Verify the claimer's survey has a `referral_code`

## Database Maintenance

### Reset Referral Data (Testing Only)

```sql
-- WARNING: This deletes all referral data!
DELETE FROM allocation_points_history WHERE source = 'referral';
DELETE FROM referrals;
UPDATE users SET allocation_points = 0;
```

### Recalculate Points (If Database Gets Out of Sync)

```sql
-- Recalculate total allocation points for all users
UPDATE users u
SET allocation_points = (
  SELECT COALESCE(SUM(points::numeric), 0)
  FROM allocation_points_history aph
  WHERE aph.user_id = u.id
);
```

### View Referral Tree

```sql
-- Use the recursive view created by migration
SELECT * FROM referral_tree_view
WHERE referral_code = 'YOUR_CODE'
ORDER BY depth, timestamp;
```

## Performance Considerations

1. **Chain Depth Limit:** Maximum of 5 levels prevents excessive database queries
2. **Safety Limit:** 100-depth absolute maximum prevents infinite loops
3. **Indexes:** Created on `referral_level` and `referred_survey_id` for fast queries
4. **Recursive Queries:** The `referral_tree_view` uses PostgreSQL's native recursive CTEs

## Security Considerations

1. **Admin Authentication:** Sticker code generation requires admin JWT token
2. **IP Blocking:** Prevents duplicate survey submissions (can be disabled with `DISABLE_IP_BLOCKING=true`)
3. **Chain Validation:** Built-in detection of circular references
4. **SQL Injection:** All queries use parameterized statements via Drizzle ORM

## Migration Notes

The migration `0007_add_multi_level_referrals.sql` includes:

1. **Backups:** Creates backup tables before modifications
2. **Data Conversion:** Converts existing INTEGER points to DECIMAL
3. **Validation:** Ensures all columns were added correctly
4. **Helper Function:** SQL function `get_referral_points(level)` for queries
5. **Statistics:** Prints summary of migrated data

**Rollback Instructions** (if needed):
```sql
-- Restore from backups
DROP TABLE referrals;
DROP TABLE allocation_points_history;
DROP TABLE users;

ALTER TABLE referrals_backup RENAME TO referrals;
ALTER TABLE allocation_points_history_backup RENAME TO allocation_points_history;
ALTER TABLE users_backup RENAME TO users;
```

## Bitcoin Halving Analogy

The points structure mirrors Bitcoin's supply schedule:

| Referral Level | Points | Bitcoin Analogy |
|---------------|--------|-----------------|
| Level 1 | 21.000 | Initial block reward (50 BTC) |
| Level 2 | 10.500 | After 1st halving (25 BTC) |
| Level 3 | 5.250 | After 2nd halving (12.5 BTC) |
| Level 4 | 2.250 | Custom (6.25 BTC would be next) |
| Level 5 | 1.125 | After 4th halving (3.125 BTC) |

Just as Bitcoin's supply is capped at 21 million, the referral system creates a predictable, deflationary reward structure that incentivizes early adoption while maintaining long-term sustainability.

## Viral Growth Mechanics

The multi-level system creates powerful viral growth:

1. **Depth Incentive:** Users benefit from their entire referral network, not just direct referrals
2. **Compounding Effect:** Each referred user becomes a potential referrer, exponentially growing the network
3. **Bitcoin Narrative:** The halving analogy creates urgency and scarcity psychology
4. **Sticker Distribution:** Physical QR codes create real-world viral spread

**Growth Projection Example:**

If each user refers 3 people on average:
- Level 1: 3 referrals → 63 points (3 × 21)
- Level 2: 9 referrals → 94.5 points (9 × 10.5)
- Level 3: 27 referrals → 141.75 points (27 × 5.25)
- Level 4: 81 referrals → 182.25 points (81 × 2.25)
- Level 5: 243 referrals → 273.375 points (243 × 1.125)

**Total: 363 referrals generating 754.875 points from one person's initial network!**

---

## Support and Feedback

For issues or questions about the multi-level referral system:
- Check the troubleshooting section above
- Review server logs with `[Multi-Level Referrals]` prefix
- Validate chains using `/api/referrals/tree?validate=true`
- Contact the development team with specific error messages and user referral codes
