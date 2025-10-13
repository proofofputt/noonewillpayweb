# Viral Trivia Challenge - Referral System Documentation

## Overview

The referral system enables users to share the quiz and earn points when friends sign up using their unique referral link. This creates viral growth through incentivized sharing.

---

## How It Works

### 1. User Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    New User Journey                          │
└──────────────────────────────────────────────────────────────┘

1. User clicks referral link (e.g., /?ref=AB3X-9K2L)
   ↓
2. Takes 3-question quiz
   ↓
3. Submits contact information
   ↓
4. Sees results page with:
   - Score & answer explanations
   - Link to full 21-question quiz
   - Their own unique referral link
   ↓
5. Shares referral link via:
   - Copy/paste
   - SMS text message
   - Social media
```

### 2. Referral Tracking

**Referral Code Format**: `XXXX-XXXX` (8 characters, e.g., `AB3X-9K2L`)

**Example Referral URL**:
```
https://noonewillpayweb.vercel.app/?ref=AB3X-9K2L
```

**Database Schema**:
```sql
-- survey_responses table
referral_code VARCHAR(20) NOT NULL UNIQUE  -- User's unique code
referred_by VARCHAR(20)                     -- Code of referrer (nullable)
```

---

## Implementation Details

### Backend (API Route)

**File**: `app/api/submit-survey/route.ts`

**Key Features**:
1. Generate unique referral code for each signup
2. Validate incoming referral codes
3. Award points to referrer (50 points per signup)
4. Calculate proper quiz scores based on correct answers
5. Return full results including referral code

**Referral Code Generation**:
```typescript
// lib/referral.ts
export async function generateReferralCode(): Promise<string> {
  // Generates unique 8-character code (XXXX-XXXX format)
  // Checks database for collisions
  // Returns guaranteed unique code
}
```

**Points System**:
- Quiz completion: 1-3 points per question (based on difficulty)
  - Easy: 1 point
  - Medium: 2 points
  - Hard: 3 points
- Referral bonus: 50 points to referrer per signup
- Maximum quiz score: 6 points (for 3 questions)

### Frontend (Survey Form)

**File**: `components/SurveyForm.tsx`

**Key Features**:
1. Captures `ref` parameter from URL on page load
2. Displays quiz questions (3 random: easy, medium, hard)
3. Validates answers and submits with referral code
4. Shows comprehensive results page with:
   - Score display (X/6 points, percentage)
   - Answer-by-answer breakdown
   - Correct answer explanations
   - Warning not to share answers publicly
   - Link to full 21-question quiz
   - Unique referral link with copy & SMS buttons

**Results Page Screenshot**:
```
┌─────────────────────────────────────────────────┐
│               Your Score                         │
│                                                  │
│                  4 / 6                           │
│                  67%                             │
├─────────────────────────────────────────────────┤
│  Answer Breakdown                                │
│  ⚠️ Don't share answers online                   │
│                                                  │
│  ✓ Q1: [Question] - Correct (1 pt)              │
│    💡 [Explanation]                              │
│                                                  │
│  ✗ Q2: [Question] - Wrong (0 pt)                │
│    Your answer: B (Correct: C)                   │
│    💡 [Explanation]                              │
│                                                  │
│  ✓ Q3: [Question] - Correct (3 pts)             │
│    💡 [Explanation]                              │
├─────────────────────────────────────────────────┤
│  Ready for More?                                 │
│  Take the full 21-question quiz!                 │
│  [Take Full Quiz Button]                         │
├─────────────────────────────────────────────────┤
│  🎁 Share & Earn 50 Points Per Signup           │
│                                                  │
│  Your referral link:                             │
│  https://.../?ref=AB3X-9K2L                      │
│                                                  │
│  [📋 Copy Link]  [💬 Text to Friend]            │
└─────────────────────────────────────────────────┘
```

---

## Scoring Logic

### Question Point Values

**File**: `data/questions.json`

Each question has a `pointValue` field:
```json
{
  "id": "01",
  "difficulty": "medium",
  "pointValue": 2,
  "correctOption": "B",
  "explanation": "..."
}
```

### Score Calculation

**File**: `lib/questions.ts`

```typescript
export function scoreQuestions(questions, answers): {
  scoredQuestions: ScoredQuestion[]  // Each question with isCorrect, pointsEarned
  totalScore: number                 // Sum of points earned
  maxScore: number                   // Maximum possible points
  percentage: number                 // (totalScore / maxScore) * 100
}
```

**Example**:
```
Questions taken:
  Q1 (easy):   Correct → 1 point
  Q2 (medium): Wrong   → 0 points
  Q3 (hard):   Correct → 3 points

Total: 4/6 points (67%)
```

---

## Database Schema

### Survey Responses Table

```sql
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  region VARCHAR(20) NOT NULL,
  on_camera BOOLEAN DEFAULT false,
  newsletter BOOLEAN DEFAULT true,

  -- Quiz data
  answers TEXT NOT NULL,                    -- JSON: ScoredQuestion[]
  score INTEGER DEFAULT 0,                   -- Total points earned

  -- Referral tracking
  referral_code VARCHAR(20) NOT NULL UNIQUE, -- User's code to share
  referred_by VARCHAR(20),                   -- Code of referrer

  -- Anti-fraud
  ip_address VARCHAR(45),
  user_agent TEXT,
  submitted_by UUID,                         -- Admin who submitted
  is_admin_submission BOOLEAN DEFAULT false,

  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX survey_responses_referral_code_idx
  ON survey_responses(referral_code);

CREATE INDEX survey_responses_referred_by_idx
  ON survey_responses(referred_by);
```

---

## Viral Growth Features

### 1. **Immediate Gratification**
- Users see their score instantly
- Get detailed explanations for learning
- Receive unique referral link right away

### 2. **Social Sharing**
- **Copy Link Button**: One-click copy to clipboard
- **SMS Button**: Pre-filled text message with referral link
- **Future**: Twitter, WhatsApp, Email sharing options

### 3. **Incentive Structure**
- **50 points per referral**: Substantial reward for sharing
- **Point leaderboard** (future): Gamification & competition
- **Allocation rewards**: Points convert to real benefits

### 4. **Friction Reduction**
- No account required to take initial quiz
- Phone number only (email optional)
- Instant results, no waiting
- Share link works immediately

---

## Analytics & Tracking

### Key Metrics to Monitor

```sql
-- Total signups
SELECT COUNT(*) FROM survey_responses;

-- Referral conversion rate
SELECT
  COUNT(*) FILTER (WHERE referred_by IS NOT NULL) * 100.0 / COUNT(*)
    AS referral_percentage
FROM survey_responses;

-- Top referrers
SELECT
  referral_code,
  COUNT(*) FILTER (WHERE referred_by = survey_responses.referral_code) AS referrals_made,
  score
FROM survey_responses
GROUP BY referral_code, score
ORDER BY referrals_made DESC
LIMIT 10;

-- Average score
SELECT AVG(score) AS avg_score, MAX(score) AS max_score
FROM survey_responses;

-- Viral coefficient (K-factor)
-- K > 1 means exponential growth
SELECT
  COUNT(*) FILTER (WHERE referred_by IS NOT NULL)::FLOAT /
  COUNT(DISTINCT referred_by)::FLOAT AS k_factor
FROM survey_responses
WHERE referred_by IS NOT NULL;
```

---

## Future Enhancements

### Phase 2: Enhanced Sharing
- [ ] Pre-generated social media images (Open Graph)
- [ ] WhatsApp sharing integration
- [ ] Twitter/X sharing with custom text
- [ ] Email invitation system

### Phase 3: Gamification
- [ ] Public leaderboard (top referrers)
- [ ] Achievement badges (5 referrals, 10 referrals, etc.)
- [ ] Referral milestones with bonus rewards
- [ ] Team challenges (who can refer the most?)

### Phase 4: Referral Rewards
- [ ] Tiered rewards (50 pts → 1st referral, 75 pts → 5th, etc.)
- [ ] Exclusive content for top referrers
- [ ] Early access to new features
- [ ] Physical rewards (Bitcoin swag, books)

### Phase 5: Anti-Fraud
- [ ] Rate limiting on referral submissions
- [ ] Device fingerprinting
- [ ] CAPTCHA for suspicious activity
- [ ] Manual review queue for high-value referrals

---

## Testing the Referral System

### Manual Testing Steps

1. **Sign up without referral**:
   ```
   Visit: https://noonewillpayweb.vercel.app/
   Complete quiz → Note your referral code
   ```

2. **Test referral link**:
   ```
   Open incognito: https://noonewillpayweb.vercel.app/?ref=YOUR-CODE
   Complete quiz → Check that "referred_by" is stored
   ```

3. **Verify points awarded**:
   ```sql
   SELECT referral_code, referred_by, score
   FROM survey_responses
   ORDER BY timestamp DESC
   LIMIT 5;
   ```

4. **Test sharing features**:
   - Click "Copy Link" → Paste in new tab
   - Click "Text to Friend" → Verify SMS app opens
   - Check referral link includes `?ref=` parameter

### Automated Testing

```typescript
// Test referral code generation
describe('Referral System', () => {
  it('generates unique referral codes', async () => {
    const code1 = await generateReferralCode()
    const code2 = await generateReferralCode()

    expect(code1).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(code1).not.toBe(code2)
  })

  it('validates referral code format', () => {
    expect(isValidReferralCode('AB3X-9K2L')).toBe(true)
    expect(isValidReferralCode('invalid')).toBe(false)
  })

  it('awards points to referrer', async () => {
    const referralCode = 'TEST-1234'
    const result = await awardReferralPoints(referralCode)

    expect(result.success).toBe(true)
    expect(result.points).toBe(50)
  })
})
```

---

## API Reference

### POST /api/submit-survey

**Request Body**:
```json
{
  "email": "satoshi@example.com",       // Optional
  "phone": "+12025550123",              // Required
  "onCamera": false,
  "newsletter": true,
  "questions": [
    {
      "id": "01",
      "question": "How many Bitcoins...",
      "answer": "B"
    }
  ],
  "answers": {
    "question1": "B",
    "question2": "C",
    "question3": "A"
  },
  "referredBy": "AB3X-9K2L",           // Optional referral code
  "timestamp": "2025-10-10T12:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "surveyId": "uuid-here",
  "score": 4,
  "maxScore": 6,
  "percentage": 67,
  "referralCode": "NEW-CODE",
  "scoredQuestions": [
    {
      "id": "01",
      "question": "...",
      "userAnswer": "B",
      "isCorrect": true,
      "pointsEarned": 1,
      "explanation": "..."
    }
  ],
  "region": "US"
}
```

---

## Security Considerations

### Fraud Prevention

1. **IP-based duplicate detection**:
   - Prevents same person signing up multiple times
   - Tracks IP address per submission
   - Admin can disable for testing

2. **Phone number validation**:
   - Required field, prevents anonymous abuse
   - Region auto-detection from phone number
   - Duplicate phone number check

3. **Referral code validation**:
   - Must match `XXXX-XXXX` format
   - Must exist in database
   - Cannot refer yourself

4. **Rate limiting** (future):
   - Max 5 referrals per hour from same IP
   - Max 100 referrals per day per code
   - CAPTCHA after 3 submissions from same IP

---

## Deployment Checklist

- [x] Database schema updated with referral fields
- [x] Migration script created (`0005_add_referral_tracking.sql`)
- [x] Referral utility functions (`lib/referral.ts`)
- [x] API endpoint updated (`app/api/submit-survey/route.ts`)
- [x] Frontend component updated (`components/SurveyForm.tsx`)
- [x] Scoring logic implemented (`lib/questions.ts`)
- [ ] Run database migration in production
- [ ] Test referral flow end-to-end
- [ ] Monitor referral conversion metrics
- [ ] Set up analytics dashboard
- [ ] Enable fraud detection alerts

---

## Support & Troubleshooting

### Common Issues

**Issue**: Referral code not capturing from URL
- Check URL parameter: `?ref=XXXX-XXXX`
- Verify `useSearchParams()` hook is working
- Check browser console for errors

**Issue**: Points not awarded to referrer
- Verify referral code exists in database
- Check `awardReferralPoints()` function logs
- Ensure database connection is active

**Issue**: Duplicate referral codes generated
- Check database unique constraint on `referral_code`
- Review `generateReferralCode()` collision handling
- Verify UUID randomness

### Debug Queries

```sql
-- Check recent referrals
SELECT
  r1.referral_code AS referrer,
  r1.phone AS referrer_phone,
  r2.referral_code AS referred,
  r2.phone AS referred_phone,
  r2.timestamp AS signup_time
FROM survey_responses r1
JOIN survey_responses r2 ON r2.referred_by = r1.referral_code
ORDER BY r2.timestamp DESC
LIMIT 20;

-- Find broken referral chains
SELECT DISTINCT referred_by
FROM survey_responses
WHERE referred_by IS NOT NULL
  AND referred_by NOT IN (SELECT referral_code FROM survey_responses);
```

---

## Contact

For questions or issues with the referral system:
- GitHub Issues: [noonewillpay-web/issues](https://github.com/...)
- Email: support@noonewillpay.com

---

**Last Updated**: 2025-10-10
**Version**: 1.0
**Author**: Claude Code Implementation
