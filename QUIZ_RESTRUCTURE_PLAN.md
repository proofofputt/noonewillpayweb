# Quiz Restructure Plan: Two-Tier System

## Executive Summary

Restructure the quiz from a single 21-question assessment to a **two-tier system**:
1. **Quick Quiz** (3 questions): Gateway experience before registration
2. **Full Assessment** (21 questions): Unlocked after registration for additional points

This change dramatically improves UX and balances incentive economics.

---

## The Problem with Current Design

### Current System Issues

**Time Commitment Before Value:**
- Users invest 10 minutes in 21 questions
- Then asked for phone number
- Value proposition unclear
- 40-60% abandon at contact info request

**Imbalanced Incentives:**
- Quiz completion: 0-45 points (10 minutes)
- Referring someone: 21 points (30 seconds)
- Result: Referrals worth half as much as completing quiz
- Doesn't incentivize referrals enough

**No Reason to Return:**
- After completing all 21 questions, what's next?
- No progression system
- Dashboard has nothing new to unlock
- Users forget about platform

---

## The New Two-Tier System

### Tier 1: Quick Quiz (Gateway Experience)

**Structure:**
- **3 questions only**
- 1 Easy (5 points)
- 1 Medium (10 points)
- 1 Hard (15 points)
- **Maximum score: 30 points**
- **Time commitment: 2-3 minutes**

**User Flow:**
```
1. User lands on site
2. See: "Test your Bitcoin knowledge - 3 quick questions"
3. Takes Quick Quiz (2-3 minutes)
4. See results immediately
5. See referral code immediately
6. THEN contact info request with value prop
7. Register to unlock Full Assessment
```

**Questions for Quick Quiz (Randomized):**

**Easy Questions Pool (5 points each):**
- Q02: What year was Bitcoin Genesis Block mined? (2009)
- Q05: What year did Nixon end Gold Standard? (1971)
- Q09: DMV electricity costs per kWh? (17 cents)
- Q10: How many kWh for one SREC? (1000)
- Q14: How many minutes per Bitcoin block? (10 minutes)

**Medium Questions Pool (10 points each):**
- Q01: How many Bitcoins have been mined? (19 million)
- Q04: What % of mining uses renewable energy? (55%)
- Q06: How much higher are electricity prices vs 10 years ago? (23%)
- Q11: What year does DC aim for 100% renewable? (2032)
- Q16: Electoral votes to win presidency? (270)
- Q18: What year was the Howey test established? (1946)
- Q19: How many bits in a Bitcoin private key? (256)
- Q20: How much did Laszlo pay per pizza? (5000 BTC)

**Hard Questions Pool (15 points each):**
- Q03: How many Bitcoin halvings total? (34)
- Q07: How many government currencies exist? (130)
- Q08: How many Bitcoin burned in genesis? (50)
- Q12: How many blocks found per day? (144)
- Q13: What % of miners needed to filter transactions? (98%)
- Q15: SegWit max block size in KB? (4000)
- Q17: How many blocks per difficulty adjustment? (2016)
- Q21: How many zeros in 1 quadrillion? (15)

**Selection Algorithm:**
```javascript
function selectQuickQuizQuestions() {
  const easyPool = questions.filter(q => q.difficulty === 'easy')
  const mediumPool = questions.filter(q => q.difficulty === 'medium')
  const hardPool = questions.filter(q => q.difficulty === 'hard')

  const selectedEasy = randomSelect(easyPool, 1)
  const selectedMedium = randomSelect(mediumPool, 1)
  const selectedHard = randomSelect(hardPool, 1)

  return [selectedEasy, selectedMedium, selectedHard]
}
```

**Benefits:**
- ✅ Low time commitment (2-3 minutes vs 10 minutes)
- ✅ Shows value immediately
- ✅ Less painful to abandon (only lost 2 minutes if they don't register)
- ✅ Creates curiosity: "What are the other 18 questions?"
- ✅ Makes registration feel like unlocking content, not giving up data

### Tier 2: Full Assessment (Unlocked Content)

**Structure:**
- **All 21 questions** (including the 3 from Quick Quiz)
- Easy: 5 points × 5 questions = 25 points
- Medium: 10 points × 8 questions = 80 points
- Hard: 15 points × 8 questions = 120 points
- **Maximum score: 225 points total**
- **Time commitment: 10-15 minutes**
- **Only available after registration**

**User Flow:**
```
1. User completes Quick Quiz (30 points)
2. Registers with contact info
3. Dashboard shows: "Unlock Full Assessment for up to 195 more points!"
4. Takes remaining 18 questions
5. Earns additional points
6. Total possible from both quizzes: 225 points
```

**Display Strategy:**
- Show Quick Quiz score separately: "Quick Quiz: 25/30"
- Show Full Assessment score: "Full Assessment: 180/195"
- Show Total Score: "Total Knowledge Score: 205/225"
- Show breakdown: "You've answered 21/21 questions. You're a Bitcoin expert!"

**Benefits:**
- ✅ Gives reason to return after registration
- ✅ Provides immediate value unlock
- ✅ Creates progression system
- ✅ Increases engagement with platform
- ✅ More data for segmentation (educational vs random guessers)

---

## New Point Economics

### Current System (Broken)

**Points from Quiz:**
- Easy: 1 point × 5 = 5 points
- Medium: 2 points × 8 = 16 points
- Hard: 3 points × 8 = 24 points
- **Total: 45 points**

**Points from Referral:**
- Direct referral: 21 points

**Ratio: 2.1:1** (quiz worth 2.1x a referral)

**Problem:**
- Users spend 10 minutes on quiz for 45 points
- Users spend 30 seconds referring someone for 21 points
- Time-to-points ratio heavily favors referrals
- But quiz is required before referrals matter
- Imbalanced

### New System (Balanced)

**Points from Quick Quiz (Required for Registration):**
- 1 Easy: 5 points
- 1 Medium: 10 points
- 1 Hard: 15 points
- **Total: 30 points (2-3 minutes)**

**Points from Full Assessment (Optional, Post-Registration):**
- Remaining 18 questions
- **Up to 195 additional points (10-15 minutes)**

**Points from Referral:**
- Direct referral: 21 points

**New Ratios:**

**Quick Quiz to Referral:**
- 30:21 = 1.4:1
- Quiz is worth 1.4x a referral
- **This is much more balanced**

**Full Assessment to Referral:**
- 195:21 = 9.3:1
- Full assessment worth ~9 referrals
- **This properly values the time investment**

**Total Possible from Both Quizzes:**
- 225 points total
- Equivalent to 10.7 direct referrals
- **This creates strong incentive to complete everything**

---

## Updated Allocation Points Economy

### How Users Earn Points (New System)

**Immediate Actions (Gateway):**
1. **Quick Quiz**: 0-30 points (2-3 minutes)
   - Required for registration
   - Low barrier to entry

**Post-Registration Actions:**
2. **Registration Bonus**: 10 points (immediate reward)
   - "Thanks for joining! +10 points"
   - Softens the ask for contact info

3. **Full Assessment**: 0-195 points (10-15 minutes)
   - Unlocked after registration
   - Optional but highly incentivized
   - Creates reason to return

4. **Profile Completion**: 5 points
   - Add email (if only gave phone)
   - Add location/preferences
   - Opt into newsletter

**Referral Actions:**
5. **Direct Referral**: 21 points each
   - When someone uses your code
   - Now properly valued vs Quick Quiz

6. **Multi-Level Referrals**:
   - 2nd degree: 10.5 points
   - 3rd degree: 5.25 points
   - 4th degree: 2.25 points
   - 5th degree: 1.125 points

**Community Actions:**
7. **First Meetup**: 25 points
8. **Book Club Session**: 10 points per session
9. **Run Bitcoin Node**: 50 points (verified)
10. **First Inscription**: 21 points
11. **Merchant Onboarding**: 100 points

### Sample User Journey (Points Accumulation)

**Day 1:**
```
1. Takes Quick Quiz: +25 points (got 1 wrong)
2. Registers: +10 points (bonus)
3. Takes Full Assessment: +175 points (got 2 wrong)
───────────────────────────────────
Total Day 1: 210 points
```

**Week 1:**
```
4. Refers 3 friends: +63 points (3 × 21)
5. One friend refers someone: +10.5 points (2nd degree)
6. Attends first meetup: +25 points
───────────────────────────────────
Total Week 1: 308.5 points
```

**Month 1:**
```
7. Refers 2 more friends: +42 points
8. 2nd degree referrals: +31.5 points (3 × 10.5)
9. Book club attendance: +30 points (3 sessions)
10. Profile completion: +5 points
───────────────────────────────────
Total Month 1: 417 points
```

**At 417 points, user can:**
- Get free conference ticket (500 points - close!)
- Access premium GitBook content (100 points - yes!)
- Vote on community decisions (50 points - yes!)
- Get merchant discounts (varies)

---

## Implementation Plan

### Phase 1: Backend Changes (Week 1)

**Database Schema Updates:**

```sql
-- Add new fields to survey_responses table
ALTER TABLE survey_responses
  ADD COLUMN quick_quiz_score INTEGER,
  ADD COLUMN quick_quiz_questions JSONB,
  ADD COLUMN full_assessment_score INTEGER,
  ADD COLUMN full_assessment_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN full_assessment_completed_at TIMESTAMP,
  ADD COLUMN registration_bonus_awarded BOOLEAN DEFAULT FALSE;

-- Add index for performance
CREATE INDEX idx_full_assessment_completed
  ON survey_responses(full_assessment_completed);

-- Update point values in questions (multiply by 5)
-- This will be done in questions.json
```

**New API Endpoints:**

1. **POST /api/quick-quiz/submit**
```typescript
// Submit 3-question quick quiz
// Returns: score, referral code, unlock message
{
  quickQuizScore: 25,
  referralCode: "ABC123",
  questionsAnswered: [
    { id: "02", correct: true, points: 5 },
    { id: "04", correct: true, points: 10 },
    { id: "12", correct: false, points: 0 }
  ],
  nextStep: "Register to unlock 18 more questions and earn up to 195 more points!"
}
```

2. **POST /api/full-assessment/submit**
```typescript
// Submit remaining 18 questions (requires authentication)
// Returns: additional score, total score, achievements
{
  fullAssessmentScore: 175,
  totalScore: 200, // quick quiz + full assessment
  questionsAnswered: 21,
  achievementsUnlocked: ["Knowledge Seeker", "Bitcoin Scholar"],
  nextStep: "Refer friends to earn even more points!"
}
```

3. **GET /api/quiz/status**
```typescript
// Check user's quiz completion status
{
  quickQuizCompleted: true,
  quickQuizScore: 25,
  fullAssessmentCompleted: false,
  remainingQuestions: 18,
  potentialPoints: 195
}
```

**Updated Point Calculation:**

```typescript
// lib/points-calculator.ts

export function calculateAllocationPoints(user: User): number {
  let total = 0

  // Quick Quiz (required for registration)
  if (user.quickQuizScore) {
    total += user.quickQuizScore // 0-30 points
  }

  // Registration bonus
  if (user.registrationBonusAwarded) {
    total += 10
  }

  // Full Assessment (optional)
  if (user.fullAssessmentScore) {
    total += user.fullAssessmentScore // 0-195 points
  }

  // Referral points (unchanged)
  total += calculateReferralPoints(user.referralCode)

  // Community actions
  total += calculateCommunityPoints(user.id)

  return total
}

// New point values
export const POINT_VALUES = {
  EASY_QUESTION: 5,
  MEDIUM_QUESTION: 10,
  HARD_QUESTION: 15,
  REGISTRATION_BONUS: 10,
  DIRECT_REFERRAL: 21,
  SECOND_DEGREE: 10.5,
  THIRD_DEGREE: 5.25,
  FOURTH_DEGREE: 2.25,
  FIFTH_DEGREE: 1.125,
  FIRST_MEETUP: 25,
  BOOK_CLUB: 10,
  NODE_RUNNER: 50,
  FIRST_INSCRIPTION: 21,
  MERCHANT_ONBOARD: 100
}
```

### Phase 2: Frontend Changes (Week 1-2)

**Landing Page Updates:**

```typescript
// app/page.tsx

export default function LandingPage() {
  return (
    <div>
      <Hero
        title="Test Your Bitcoin Knowledge"
        subtitle="3 quick questions. 2 minutes. See how you compare."
        cta="Start Quick Quiz"
      />

      <SocialProof
        stats={{
          totalUsers: 10234,
          avgScore: 23.5,
          topScorers: ["Alice: 30/30", "Bob: 28/30", "Carol: 27/30"]
        }}
      />

      <WhatYouGet
        items={[
          "See your Bitcoin knowledge score",
          "Get your unique referral code",
          "Unlock full 21-question assessment",
          "Earn allocation points for DMV Bitcoin events"
        ]}
      />
    </div>
  )
}
```

**Quick Quiz Component:**

```typescript
// components/QuickQuiz.tsx

export function QuickQuiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    // Fetch 3 random questions (1 easy, 1 medium, 1 hard)
    fetchQuickQuizQuestions().then(setQuestions)
  }, [])

  return (
    <div className="quick-quiz">
      <ProgressBar current={currentQuestionIndex + 1} total={3} />

      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />

      <Navigation
        canGoBack={currentQuestionIndex > 0}
        canGoNext={hasAnswered}
        onBack={goToPrevious}
        onNext={goToNext}
      />
    </div>
  )
}
```

**Results Page (Pre-Registration):**

```typescript
// app/quick-quiz/results/page.tsx

export default function QuickQuizResults() {
  const { score, maxScore, referralCode } = useQuickQuizResults()

  return (
    <div>
      <ScoreDisplay
        score={score}
        maxScore={maxScore}
        message={getScoreMessage(score)}
      />

      <ReferralCode
        code={referralCode}
        message="Share this code with friends. You'll earn 21 points for each person who completes the quiz!"
      />

      <UnlockPrompt
        message="Want to unlock 18 more questions and earn up to 195 more points?"
        cta="Register Now"
        subtext="We'll save your progress and track your referrals"
      />

      <RegistrationForm
        onSubmit={handleRegistration}
        bonus={10}
        bonusMessage="Get 10 bonus points just for registering!"
      />
    </div>
  )
}
```

**Dashboard (Post-Registration):**

```typescript
// app/dashboard/page.tsx

export default function Dashboard() {
  const user = useUser()
  const stats = useUserStats()

  return (
    <div className="dashboard">
      <PointsSummary
        quickQuiz={user.quickQuizScore}
        fullAssessment={user.fullAssessmentScore}
        referrals={stats.referralPoints}
        community={stats.communityPoints}
        total={stats.totalPoints}
      />

      {!user.fullAssessmentCompleted && (
        <CallToAction
          title="Unlock Full Assessment"
          description="Answer 18 more questions to earn up to 195 additional points"
          cta="Continue Quiz"
          href="/full-assessment"
          highlight={true}
        />
      )}

      <ReferralTree
        code={user.referralCode}
        directReferrals={stats.directReferrals}
        networkSize={stats.totalNetwork}
        pointsEarned={stats.referralPoints}
      />

      <NextSteps
        suggestions={[
          { action: "Refer 3 friends", points: 63, href: "/referral" },
          { action: "Attend next meetup", points: 25, href: "/events" },
          { action: "Join book club", points: 10, href: "/book-club" }
        ]}
      />
    </div>
  )
}
```

**Full Assessment Page:**

```typescript
// app/full-assessment/page.tsx

export default function FullAssessment() {
  const user = useUser()
  const [questions, setQuestions] = useState<Question[]>([])

  // Exclude the 3 questions from quick quiz
  useEffect(() => {
    fetchRemainingQuestions(user.quickQuizQuestions).then(setQuestions)
  }, [])

  return (
    <div>
      <Header
        title="Full Bitcoin Assessment"
        subtitle="18 questions to test your deep knowledge"
      />

      <ProgressTracker
        completed={user.quickQuizCompleted ? 3 : 0}
        remaining={18}
        total={21}
      />

      <QuestionsInterface
        questions={questions}
        onComplete={handleSubmit}
      />
    </div>
  )
}
```

### Phase 3: Content Updates (Week 2)

**Fix Broken Question Explanations:**

1. **Question 8** (Genesis block burned BTC):
```json
{
  "id": "08",
  "explanation": "The genesis block contained 50 BTC in the coinbase transaction, but due to the way Satoshi embedded the timestamp message, these coins are unspendable. They remain in the genesis block address forever, effectively burned."
}
```

2. **Question 13** (Mining censorship):
```json
{
  "id": "13",
  "explanation": "Research shows that approximately 98% of mining power would need to coordinate to effectively censor transactions from blocks. This high threshold makes Bitcoin extremely resistant to censorship attacks."
}
```

3. **Question 18** (Howey test):
```json
{
  "id": "18",
  "explanation": "The Howey test, established in 1946, determines whether a transaction qualifies as an investment contract and thus a security. This test is crucial for Bitcoin regulation, as it helps define when crypto projects are securities subject to SEC oversight."
}
```

**Update Point Values in questions.json:**

```bash
# All easy questions (currently pointValue: 1)
# Change to: pointValue: 5

# All medium questions (currently pointValue: 2)
# Change to: pointValue: 10

# All hard questions (currently pointValue: 3)
# Change to: pointValue: 15
```

### Phase 4: UX Improvements (Week 2-3)

**Onboarding Sequence:**

```typescript
// After Quick Quiz completion, before registration:

Step 1: Show Results
"You scored 25 out of 30 points!"
[Visual score display with breakdown]

Step 2: Show Referral Code
"Your referral code: ABC123"
"Share this with friends to earn 21 points each"
[One-click share buttons]

Step 3: Tease Full Assessment
"Want to see the full 21-question assessment?"
"Unlock 18 more questions and earn up to 195 more points"
[Preview of question categories]

Step 4: Registration Value Prop
"Register to:"
✓ Unlock Full Assessment (195 points)
✓ Save your progress
✓ Track your referrals
✓ Access exclusive events
✓ Get 10 bonus points now

Step 5: Registration Form
[Email OR Phone (not both required)]
[Camera consent (explained)]
[Newsletter opt-in]
"Register and Get 10 Points"
```

**Gamification Elements:**

```typescript
// Add achievements system

export const ACHIEVEMENTS = {
  QUICK_LEARNER: {
    name: "Quick Learner",
    description: "Completed Quick Quiz",
    points: 0,
    icon: "⚡"
  },
  KNOWLEDGE_SEEKER: {
    name: "Knowledge Seeker",
    description: "Completed Full Assessment",
    points: 0,
    icon: "🎓"
  },
  PERFECT_SCORE: {
    name: "Bitcoin Scholar",
    description: "Scored 100% on Full Assessment",
    points: 25,
    icon: "👑"
  },
  FIRST_REFERRAL: {
    name: "Orange Piller",
    description: "Referred your first person",
    points: 0,
    icon: "🟠"
  },
  FIVE_REFERRALS: {
    name: "Community Builder",
    description: "Referred 5 people",
    points: 10,
    icon: "🏗️"
  },
  TEN_REFERRALS: {
    name: "Bitcoin Evangelist",
    description: "Referred 10 people",
    points: 25,
    icon: "📢"
  }
}
```

### Phase 5: Marketing & Messaging (Week 3-4)

**Updated Landing Page Copy:**

```
Before:
"No One Will Pay - Take our 21-question Bitcoin survey"

After:
"How Much Do You Really Know About Bitcoin?"
"3 quick questions. 2 minutes. See how you stack up."
```

**Social Sharing Templates:**

```
Option 1 (Competitive):
"I just scored [X]/30 on this Bitcoin knowledge test. Think you can beat me? [link]"

Option 2 (Educational):
"This 3-question quiz taught me something new about Bitcoin. Take it: [link]"

Option 3 (Incentive):
"Take this quick Bitcoin quiz using my code and we both earn points toward free conference tickets: [link]"
```

**Email Sequences:**

**Sequence 1: Quick Quiz Only (No Registration)**
- Day 1: "Your Quick Quiz results are ready"
- Day 3: "Register to unlock 18 more questions and 195 more points"
- Day 7: "Don't lose your progress - register now"
- Day 14: Final reminder with registration bonus

**Sequence 2: Registered, No Full Assessment**
- Day 1: "Welcome! Here's your 10 bonus points"
- Day 2: "Unlock Full Assessment for 195 more points"
- Day 5: "Your Quick Quiz score: [X]/30. How much higher can you go?"
- Day 10: "Take the Full Assessment this week"

**Sequence 3: Completed Both Quizzes**
- Day 1: "Congratulations! Your total score: [X]/225"
- Day 3: "Now let's grow your network. Here's how:"
- Day 7: "Your referral code: [CODE]. Share it!"
- Day 14: "Next DMV Bitcoin meetup this week"

---

## Expected Impact

### User Experience Improvements

**Reduced Friction:**
- Quick Quiz: 2-3 minutes (vs 10 minutes)
- 70% completion rate (vs 50% currently)
- Lower barrier to entry

**Better Conversion:**
- 60-70% registration rate (vs 40% currently)
- Value demonstrated before asking for info
- Registration feels like unlocking content

**Increased Engagement:**
- 40% return to complete Full Assessment
- Dashboard has content to unlock
- Clear progression path

### Economic Impact

**Referral Value Balance:**
- Quick Quiz: 30 points (2 min) = 15 points/min
- Referral: 21 points (30 sec) = 42 points/min
- **BUT referral requires taking quiz first**
- **Net effect: Referrals still highly valuable but quiz isn't undervalued**

**Total Possible Points:**
- Quick Quiz: 30 points
- Registration: 10 points
- Full Assessment: 195 points
- Profile completion: 5 points
- **Base total: 240 points before any referrals**
- Equivalent to 11.4 direct referrals worth of effort

**Point Distribution:**
- 3-5% of users: 500+ points (superfans)
- 15-20% of users: 200-500 points (active)
- 40-50% of users: 50-200 points (casual)
- 30-40% of users: 30-50 points (quick quiz only)

### Growth Projections

**Current System:**
- 100 visitors → 60 start → 30 complete → 12 register → 2 refer
- Conversion: 12%
- Activation: 17%

**New System:**
- 100 visitors → 70 start Quick Quiz → 50 complete → 30 register → 12 complete Full Assessment → 6 refer
- Conversion: 30%
- Activation: 20%

**Month 1 (With New System):**
- 100 seed users take Quick Quiz
- 70 register (+10 bonus each)
- 40 complete Full Assessment
- 30 refer 2 people each = 60 new users
- End of month: 160 total users

**Month 3:**
- Network effects kick in
- 2nd degree referrals activate
- Sticker distribution begins
- 1,000+ total users

**Month 6:**
- Word of mouth accelerates
- Meetup attendance increases
- Media coverage possible
- 5,000+ total users

---

## Risk Mitigation

### Potential Issues

**Issue 1: Users Don't Come Back for Full Assessment**
- Mitigation: Strong email sequence, push notifications
- Mitigation: Show "You're leaving points on the table!"
- Mitigation: Time-limited bonuses "Complete Full Assessment this week for extra 25 points"

**Issue 2: Quick Quiz Too Easy**
- Mitigation: Ensure good distribution of difficulty
- Mitigation: Rotate questions so repeat takers get different sets
- Mitigation: Don't let same user take Quick Quiz multiple times

**Issue 3: Point Inflation**
- Mitigation: Monitor average points per user
- Mitigation: Adjust point unlock thresholds if needed
- Mitigation: Add point sinks (redeem points for rewards)

**Issue 4: Referral Code Abuse**
- Mitigation: Same IP/phone detection (already implemented)
- Mitigation: Admin review of suspicious referral patterns
- Mitigation: Rate limiting on referrals

---

## Success Metrics

### Week 1 (Post-Launch)
- ✅ Quick Quiz completion rate: >65%
- ✅ Registration rate: >50%
- ✅ Full Assessment start rate: >30%
- ✅ Zero critical bugs

### Month 1
- ✅ 300+ total users
- ✅ Average referral per user: >0.5
- ✅ Full Assessment completion: >25%
- ✅ Return rate (day 7): >20%

### Month 3
- ✅ 1,500+ total users
- ✅ Average referral per user: >1.0
- ✅ Viral coefficient: >1.1
- ✅ First policy impact (comment submitted)

---

## Implementation Checklist

### Backend (Week 1)
- [ ] Update questions.json with new point values (5/10/15)
- [ ] Fix explanations for Q8, Q13, Q18
- [ ] Create quick-quiz selection algorithm
- [ ] Add new database fields
- [ ] Create POST /api/quick-quiz/submit endpoint
- [ ] Create POST /api/full-assessment/submit endpoint
- [ ] Create GET /api/quiz/status endpoint
- [ ] Update points calculator logic
- [ ] Update referral points to match new scale
- [ ] Add registration bonus (10 points)

### Frontend (Week 1-2)
- [ ] Create Quick Quiz component (3 questions)
- [ ] Update landing page messaging
- [ ] Create Quick Quiz results page
- [ ] Add "Unlock Full Assessment" CTA
- [ ] Create registration form with value prop
- [ ] Update dashboard with quiz status
- [ ] Create Full Assessment page
- [ ] Add progress tracking visualization
- [ ] Create achievements system
- [ ] Add social sharing templates

### Content (Week 2)
- [ ] Fix all question explanations
- [ ] Write new landing page copy
- [ ] Create email sequences (3 types)
- [ ] Design achievement badges
- [ ] Create social share graphics
- [ ] Write FAQ about two-tier system

### Testing (Week 2-3)
- [ ] Test Quick Quiz flow end-to-end
- [ ] Test registration flow
- [ ] Test Full Assessment unlock
- [ ] Test point calculations
- [ ] Test referral tracking
- [ ] Load testing (100+ concurrent users)
- [ ] Mobile responsive testing
- [ ] Cross-browser testing

### Launch (Week 3-4)
- [ ] Deploy to staging
- [ ] Internal team testing
- [ ] Beta test with 10 users
- [ ] Gather feedback
- [ ] Make adjustments
- [ ] Deploy to production
- [ ] Announce to DMV Bitcoin community
- [ ] Monitor analytics closely

---

## Conclusion

The two-tier quiz system solves multiple problems simultaneously:

1. **Reduces friction**: 2-minute Quick Quiz vs 10-minute full survey
2. **Improves conversion**: Value before contact info request
3. **Balances incentives**: Referrals and quizzes properly valued
4. **Increases engagement**: Reason to return (unlock Full Assessment)
5. **Creates progression**: Clear path from newcomer to expert
6. **Better UX**: Gamification, achievements, unlockables

**Expected Results:**
- 2.5x improvement in registration conversion (12% → 30%)
- 2x improvement in referral activation (2% → 6%)
- 4x improvement in long-term retention (5% → 20%)

**This restructure transforms the experience from "give me your phone number" to "unlock your potential."**

---

*Plan Version 1.0 - October 2025*
*Estimated Implementation: 3-4 weeks*
*Expected Impact: 2-3x growth rate improvement*
