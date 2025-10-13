# Learning Platform Framework - Pizza Ninjas Network

**Version**: 1.0
**Date**: 2025-10-09
**Purpose**: Framework selection and architecture for course delivery, completion tracking, and public sharing

---

## Framework Evaluation

### Option 1: GitBook (Recommended for Content + Custom Backend)

**What GitBook Provides:**
- ✅ Beautiful documentation/book interface
- ✅ Markdown-based content (version controlled)
- ✅ Search functionality
- ✅ Mobile-responsive design
- ✅ Public/private content control
- ✅ Custom domains
- ✅ Git sync (GitHub/GitLab integration)
- ✅ Embeds (videos, interactive widgets)

**What GitBook DOESN'T Provide (Out of Box):**
- ❌ User authentication
- ❌ Progress tracking
- ❌ Course completion certificates
- ❌ Quizzes with scoring
- ❌ User-specific state (checkboxes, notes)
- ❌ Social features (sharing achievements)

**GitBook Limitations:**
- Content is static (no dynamic user state)
- Limited API for customization
- No built-in learning management features
- Would need external database for user progress

---

### Option 2: GitBook + Custom Backend (RECOMMENDED)

**Architecture:**
```
┌──────────────────────────────────────────────────┐
│              GitBook (Content Layer)              │
│  - All course content (chapters, guides)         │
│  - Beautiful reading experience                  │
│  - Search, navigation, mobile-friendly           │
└──────────────────────────────────────────────────┘
                      │
                      ▼ (Embeds)
┌──────────────────────────────────────────────────┐
│         Custom Web App (Backend Layer)            │
│  - User authentication                           │
│  - Progress tracking                             │
│  - Quiz engine                                   │
│  - Certificate generation                        │
│  - Social sharing                                │
│  - Database: PostgreSQL                          │
└──────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────┐
│          User Profile (Integration)               │
│  - Completion badges                             │
│  - Certificates earned                           │
│  - Learning path progress                        │
└──────────────────────────────────────────────────┘
```

**How It Works:**
1. **Content lives in GitBook** - Beautiful, searchable, version-controlled
2. **Interactive elements embedded** - Quizzes, progress trackers as iframes/widgets
3. **Custom backend tracks state** - User progress, quiz scores, certificates
4. **Profile shows achievements** - Badges, completion %, shareable certificates

**Example Integration:**
```markdown
<!-- In GitBook chapter -->
# Chapter 1: Xverse Setup

[Read the content...]

<!-- Embedded progress tracker -->
<iframe src="https://noonewillpay.com/api/progress/chapter1" />

<!-- Embedded quiz -->
<iframe src="https://noonewillpay.com/api/quiz/chapter1" />

<!-- Complete chapter button -->
<iframe src="https://noonewillpay.com/api/complete/chapter1" />
```

---

### Option 3: Docusaurus (Open Source Alternative)

**Pros:**
- ✅ Open-source (React-based)
- ✅ Fully customizable
- ✅ Versioning built-in
- ✅ Plugin ecosystem
- ✅ MDX support (embed React components)
- ✅ Self-hosted (full control)

**Cons:**
- ⚠️ Requires more dev work
- ⚠️ Hosting/maintenance overhead
- ⚠️ Need to build tracking system from scratch

**Best for:** If you want full ownership and control

---

### Option 4: Teachable / Thinkific (SaaS LMS)

**Pros:**
- ✅ Built-in course completion
- ✅ Quizzes, certificates
- ✅ Student dashboard
- ✅ Payment integration

**Cons:**
- ❌ Expensive ($39-399/month)
- ❌ Less customizable
- ❌ Vendor lock-in
- ❌ Not Bitcoin-native

**Best for:** If you want zero dev work and have budget

---

### Option 5: Custom Learning Platform (Full Build)

**Pros:**
- ✅ Total control
- ✅ Exactly what you want
- ✅ Bitcoin-native features
- ✅ Open-source contribution potential

**Cons:**
- ❌ 3-6 months dev time
- ❌ Ongoing maintenance
- ❌ Reinventing wheel

**Best for:** Long-term vision if you have dev resources

---

## RECOMMENDED: GitBook + Custom Progress Tracking

### Why This Combo Wins

**GitBook handles:**
- Content presentation (beautiful, mobile-friendly)
- Search and navigation
- Version control (Git-backed)
- Public sharing (anyone can read)
- Multi-language support (future)

**Custom backend handles:**
- User authentication (login with profile)
- Progress tracking (checkboxes, completion %)
- Quiz engine (questions, answers, scoring)
- Certificates (PDF generation with Bitcoin proof)
- Shareable achievements (social cards, Nostr posts)

**Benefits:**
1. **Fast to launch** - Content in GitBook immediately
2. **Best UX** - GitBook's reading experience is excellent
3. **Flexible** - Add features incrementally to backend
4. **Cost-effective** - GitBook free tier + your hosting
5. **Version controlled** - All content in Git
6. **Bitcoin-native** - Custom features you build

---

## Implementation Architecture

### GitBook Setup

**Repository Structure:**
```
noonewillpay-gitbook/
├── SUMMARY.md                    # Table of contents
├── README.md                     # Landing page
├── part1/
│   ├── chapter1-xverse-setup.md
│   ├── chapter2-whitepaper.md
│   ├── chapter3-wallet-advanced.md
│   ├── chapter4-bitcoin-basics.md
│   └── chapter5-bitcoin-node.md
├── knowledgebase/
│   ├── quick-start/
│   ├── learning-modules/
│   └── troubleshooting/
├── guides/
│   ├── organizers/
│   ├── ambassadors/
│   └── restaurants/
└── assets/
    ├── images/
    └── videos/
```

**SUMMARY.md (GitBook TOC):**
```markdown
# Summary

## Getting Started
* [Introduction](README.md)
* [Chapter 1: Xverse Setup (Required)](part1/chapter1-xverse-setup.md)
* [Chapter 2: Whitepaper Read-Along](part1/chapter2-whitepaper.md)
* [Chapter 3: Advanced Wallet Security](part1/chapter3-wallet-advanced.md)

## Knowledgebase
* [Quick Start Guides](knowledgebase/quick-start/README.md)
  * [Organizer: First Event](knowledgebase/quick-start/organizer-first-event.md)
  * [Ambassador: First Week](knowledgebase/quick-start/ambassador-first-week.md)
  * [Restaurant: Setup](knowledgebase/quick-start/restaurant-setup.md)

## Learning Modules
* [Module 1: Understanding the Mission](knowledgebase/learning-modules/module-1-mission.md)
* [Module 2: Batch Economics](knowledgebase/learning-modules/module-2-economics.md)
* [Module 3: Ambassador Skills](knowledgebase/learning-modules/module-3-ambassador.md)

## Troubleshooting
* [FAQ & Common Issues](knowledgebase/troubleshooting/common-issues-faq.md)
```

---

### Custom Backend (Node.js/Express)

**API Endpoints:**

```javascript
// Progress Tracking
POST   /api/progress/start-chapter/:chapterId
POST   /api/progress/complete-chapter/:chapterId
GET    /api/progress/user/:userId
GET    /api/progress/chapter/:chapterId

// Quiz System
GET    /api/quiz/:quizId
POST   /api/quiz/:quizId/submit
GET    /api/quiz/:quizId/results/:userId

// Certificates
GET    /api/certificate/generate/:courseId/:userId
POST   /api/certificate/verify/:certificateId

// Social Sharing
GET    /api/share/achievement/:userId/:achievementId
POST   /api/share/nostr/:userId/:achievementId

// Leaderboard
GET    /api/leaderboard/:courseId
GET    /api/leaderboard/city/:city
```

---

### Database Schema (Progress Tracking)

```sql
-- Course structure
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  gitbook_url TEXT NOT NULL, -- Link to GitBook page
  estimated_minutes INTEGER,
  required BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- User progress
CREATE TABLE user_course_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  completion_percentage REAL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE user_chapter_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  started_at DATETIME,
  completed_at DATETIME,
  time_spent_seconds INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Quizzes
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  title TEXT NOT NULL,
  passing_score REAL DEFAULT 0.8, -- 80%
  questions_data TEXT, -- JSON
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

CREATE TABLE quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  score REAL NOT NULL,
  passed BOOLEAN NOT NULL,
  answers_data TEXT, -- JSON
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Certificates
CREATE TABLE certificates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  bitcoin_timestamp TEXT, -- OpenTimestamps proof
  pdf_url TEXT,
  shareable_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Achievements/Badges
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria_type TEXT, -- course_complete, quiz_perfect, streak_days, etc.
  criteria_value TEXT -- JSON
);

CREATE TABLE user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  shared_on_nostr BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);
```

---

### Embedded Progress Tracker Widget

**In GitBook Chapter:**
```html
<!-- Embedded at top of chapter -->
<div class="progress-widget" data-chapter-id="chapter1-xverse-setup">
  <iframe
    src="https://noonewillpay.com/widgets/progress/chapter1-xverse-setup"
    width="100%"
    height="120px"
    frameborder="0">
  </iframe>
</div>
```

**Widget Display:**
```
┌───────────────────────────────────────────────────┐
│ 📚 Chapter 1: Xverse Setup                        │
├───────────────────────────────────────────────────┤
│ Progress: ▓▓▓▓▓▓▓▓░░ 80% Complete                 │
│                                                   │
│ ✅ Section 1: Download Xverse                     │
│ ✅ Section 2: Create Wallet                       │
│ ✅ Section 3: Backup Seed Phrase                  │
│ ✅ Section 4: Generate Taproot Address            │
│ ⏳ Section 5: Update Profile (Current)            │
│ ☐ Section 6: Test Your Wallet                    │
│                                                   │
│ Time Spent: 8 minutes                             │
│ [Mark Section Complete] [Mark Chapter Complete]  │
└───────────────────────────────────────────────────┘
```

---

### Embedded Quiz Widget

**In GitBook Chapter:**
```html
<!-- At end of chapter -->
<div class="quiz-widget" data-quiz-id="quiz-chapter1">
  <iframe
    src="https://noonewillpay.com/widgets/quiz/chapter1-xverse-setup"
    width="100%"
    height="600px"
    frameborder="0">
  </iframe>
</div>
```

**Quiz Display:**
```
┌───────────────────────────────────────────────────┐
│ 📝 Chapter 1 Quiz                                 │
├───────────────────────────────────────────────────┤
│ Question 1 of 5:                                  │
│                                                   │
│ What do Taproot addresses start with?            │
│                                                   │
│ ○ A) bc1q...                                     │
│ ○ B) bc1p...   ← Selected                        │
│ ○ C) 1...                                        │
│ ○ D) 3...                                        │
│                                                   │
│ [Previous] [Next Question]                        │
│                                                   │
│ Progress: ●●●○○ (3/5 answered)                   │
└───────────────────────────────────────────────────┘
```

**Results Display:**
```
┌───────────────────────────────────────────────────┐
│ 🎉 Quiz Complete!                                 │
├───────────────────────────────────────────────────┤
│ Your Score: 9/10 (90%)                            │
│ Passing Score: 8/10 (80%)                         │
│                                                   │
│ ✅ PASSED!                                        │
│                                                   │
│ Breakdown:                                        │
│ ✅ Question 1: Correct                            │
│ ✅ Question 2: Correct                            │
│ ❌ Question 3: Incorrect (Review Section 4)       │
│ ✅ Question 4: Correct                            │
│ ✅ Question 5: Correct                            │
│                                                   │
│ 🏆 Achievement Unlocked: "Wallet Expert"         │
│                                                   │
│ [View Detailed Results] [Retake Quiz]            │
│ [Continue to Next Chapter]                        │
│ [Share Achievement 🐦 📝]                         │
└───────────────────────────────────────────────────┘
```

---

### Course Completion Certificate

**Auto-Generated on 100% Completion:**

```
┌───────────────────────────────────────────────────┐
│                                                   │
│          🍕 PIZZA NINJAS NETWORK 🍕               │
│                                                   │
│              Certificate of Completion            │
│                                                   │
│                Proudly Presented to               │
│                                                   │
│                  Alice Johnson                    │
│                                                   │
│        For successful completion of the           │
│         Bitcoin Fundamentals Course               │
│              (Part 1: Foundations)                │
│                                                   │
│    Completed: October 9, 2025                     │
│    Certificate ID: CERT-2025-001234               │
│                                                   │
│    Achievements:                                  │
│    ✅ 5 Chapters Completed                        │
│    ✅ 5 Quizzes Passed (Average: 92%)            │
│    ✅ 10 Hours of Learning                        │
│                                                   │
│    Bitcoin Timestamp Proof:                       │
│    ots://[OpenTimestamps proof hash]             │
│                                                   │
│    Verified on Bitcoin Blockchain                 │
│                                                   │
│    [Download PDF] [Verify Certificate]           │
│    [Share on Twitter] [Share on Nostr]           │
│                                                   │
└───────────────────────────────────────────────────┘
```

**Certificate Features:**
- ✅ PDF download (print/save)
- ✅ Bitcoin timestamp proof (OpenTimestamps)
- ✅ Unique certificate ID (verifiable)
- ✅ Shareable URL (public verification)
- ✅ Social media cards (auto-generated)

---

### Public Sharing Features

#### Share Achievement on Nostr

**Auto-Generated Nostr Post:**
```
Just completed the Bitcoin Fundamentals course on Pizza Ninjas Network! 🍕⚡

📚 5 chapters
✅ 92% quiz average
🏆 Wallet Expert badge earned

Certificate: https://noonewillpay.com/cert/CERT-2025-001234

Learning Bitcoin through doing! #Bitcoin #PizzaNinjas #LearnBitcoin

[Image: Certificate preview card]
```

#### Share Achievement on Twitter/X

**Auto-Generated Tweet:**
```
I just earned my Bitcoin Fundamentals certificate from @PizzaNinjasGlobal! 🍕⚡

Set up my first self-custody wallet, read the whitepaper, and learned by doing.

Verify my certificate: https://noonewillpay.com/cert/CERT-2025-001234

#Bitcoin #LearnBitcoin

[Image: Social card with certificate]
```

#### Social Card (Auto-Generated)

```
┌────────────────────────────────────────────────┐
│  🍕 PIZZA NINJAS NETWORK ⚡                    │
├────────────────────────────────────────────────┤
│                                                │
│  Alice Johnson                                 │
│  just completed                                │
│                                                │
│  Bitcoin Fundamentals                          │
│                                                │
│  ✅ 5 Chapters  ✅ 92% Avg  ✅ 10 Hours        │
│                                                │
│  🏆 Achievement: Wallet Expert                 │
│                                                │
│  Verified on Bitcoin Blockchain ₿              │
│  CERT-2025-001234                              │
│                                                │
│  noonewillpay.com/cert/...                     │
└────────────────────────────────────────────────┘
```

---

### Leaderboard / Social Features

**Course Leaderboard:**
```
┌───────────────────────────────────────────────────┐
│ 🏆 Bitcoin Fundamentals Leaderboard              │
├───────────────────────────────────────────────────┤
│                                                   │
│ Top Performers (This Month):                      │
│                                                   │
│ 🥇 1. Alice J.    (Austin)      100% / 10 hrs   │
│ 🥈 2. Bob D.      (Miami)        98% / 12 hrs   │
│ 🥉 3. Charlie M.  (Denver)       95% / 11 hrs   │
│    4. Diana S.    (SF)           94% / 9 hrs    │
│    5. Eve K.      (Portland)     92% / 13 hrs   │
│                                                   │
│ Your Ranking: #12 (88%, 8 hours)                 │
│                                                   │
│ [View Global Leaderboard] [View City Rankings]   │
└───────────────────────────────────────────────────┘
```

**Fastest Completions:**
```
⚡ Speedrun Leaderboard:
1. FastBitcoiner - 2.5 hours (100%)
2. QuickLearner - 3.1 hours (95%)
3. SpeedyStudent - 3.8 hours (98%)
```

**City Leaderboard:**
```
🏙️ Austin Learners:
1. Alice J.     - 100%
2. Dave R.      - 95%
3. Emma L.      - 92%
...
25. You         - 88%
```

---

## GitBook Configuration

### gitbook.yaml

```yaml
root: ./

structure:
  readme: README.md
  summary: SUMMARY.md

plugins:
  - sharing
  - progress  # Custom plugin (you build)
  - quiz      # Custom plugin (you build)
  - video-embed
  - code-highlighter
  - search-pro

pluginsConfig:
  sharing:
    twitter: true
    facebook: false
    all: ['twitter', 'nostr']
  progress:
    apiEndpoint: "https://noonewillpay.com/api"
  quiz:
    apiEndpoint: "https://noonewillpay.com/api/quiz"

styles:
  website: "assets/custom.css"

pdf:
  fontSize: 12
  paperSize: "a4"

links:
  sidebar:
    "🏠 Home": "https://noonewillpay.com"
    "👤 Profile": "https://noonewillpay.com/profile"
    "🏆 Certificates": "https://noonewillpay.com/certificates"
```

### Custom GitBook Plugins

**Progress Plugin (gitbook-plugin-progress):**
```javascript
// Injects progress tracker at top of each page
module.exports = {
  hooks: {
    "page:before": function(page) {
      const chapterId = page.path;
      const widget = `
        <div class="progress-widget">
          <iframe src="https://noonewillpay.com/widgets/progress/${chapterId}" />
        </div>
      `;
      page.content = widget + page.content;
      return page;
    }
  }
};
```

**Quiz Plugin (gitbook-plugin-quiz):**
```javascript
// Detects quiz markers and injects quiz widgets
module.exports = {
  blocks: {
    quiz: {
      process: function(block) {
        const quizId = block.kwargs.id;
        return `
          <div class="quiz-widget">
            <iframe src="https://noonewillpay.com/widgets/quiz/${quizId}"
                    width="100%" height="600px" />
          </div>
        `;
      }
    }
  }
};
```

**Usage in Markdown:**
```markdown
# Chapter 1 Quiz

{% quiz id="chapter1-xverse-setup" %}
{% endquiz %}
```

---

## User Dashboard (Profile Integration)

### Learning Progress Section

```
┌───────────────────────────────────────────────────┐
│ 📚 MY LEARNING                                    │
├───────────────────────────────────────────────────┤
│                                                   │
│ Current Course: Bitcoin Fundamentals              │
│ Progress: ▓▓▓▓▓▓▓▓░░ 80% Complete                 │
│                                                   │
│ ✅ Chapter 1: Xverse Setup (100%)                 │
│ ✅ Chapter 2: Whitepaper (100%)                   │
│ ✅ Chapter 3: Advanced Wallet (100%)              │
│ ✅ Chapter 4: Bitcoin Basics (100%)               │
│ ⏳ Chapter 5: Running a Node (0%)                 │
│                                                   │
│ [Continue Learning] [View All Courses]            │
│                                                   │
├───────────────────────────────────────────────────┤
│ 🏆 ACHIEVEMENTS                                   │
├───────────────────────────────────────────────────┤
│                                                   │
│ 🎯 Wallet Expert (Chapter 1, 90%+ quiz)          │
│ 📖 Whitepaper Scholar (Chapter 2 completed)      │
│ 🔐 Security Conscious (Chapter 3, perfect quiz)  │
│ ⚡ 7-Day Streak (7 days of consecutive learning) │
│                                                   │
│ [View All Achievements] [Share on Nostr]          │
│                                                   │
├───────────────────────────────────────────────────┤
│ 📜 CERTIFICATES                                   │
├───────────────────────────────────────────────────┤
│                                                   │
│ (None yet - complete a course to earn!)          │
│                                                   │
│ Next Certificate: Bitcoin Fundamentals            │
│ Complete Chapter 5 to earn                        │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: GitBook + Basic Tracking (Week 1-2)
- ✅ Set up GitBook repo
- ✅ Migrate all content (chapters, guides)
- ✅ Create custom domain (docs.noonewillpay.com)
- ✅ Build simple progress API (start/complete chapter)
- ✅ Embed basic progress widget

### Phase 2: Quiz System (Week 3-4)
- ✅ Build quiz engine (API + widget)
- ✅ Create quizzes for all chapters
- ✅ Track scores + pass/fail
- ✅ Show results with feedback

### Phase 3: Certificates (Week 5-6)
- ✅ PDF generation with user info
- ✅ Bitcoin timestamp (OpenTimestamps integration)
- ✅ Public verification page
- ✅ Social sharing cards

### Phase 4: Social Features (Week 7-8)
- ✅ Achievements/badges system
- ✅ Leaderboards (global, city, speedrun)
- ✅ Nostr integration (auto-post achievements)
- ✅ Twitter/X sharing

### Phase 5: Advanced Features (Week 9-12)
- ✅ Learning streaks
- ✅ Study time tracking
- ✅ Personalized recommendations
- ✅ Community notes/annotations

---

## Cost Analysis

### GitBook Option
**Free Tier:**
- 1 space (sufficient for all content)
- Unlimited pages
- Unlimited collaborators
- Public content
- **Cost: $0/month**

**Paid Tier ($29/month):**
- Custom domain
- Analytics
- Private content
- Remove GitBook branding

**Our Backend:**
- DigitalOcean: $12/month (2GB RAM droplet)
- PostgreSQL managed: $15/month
- Domain: $12/year
- SSL: Free (Let's Encrypt)
- **Total: $27-56/month**

**Grand Total: $27-85/month**

---

### Comparison: GitBook vs. Teachable

| Feature | GitBook + Custom | Teachable |
|---------|-----------------|-----------|
| **Cost** | $27-85/month | $39-399/month |
| **Content** | Markdown (Git-backed) | Web editor |
| **Customization** | Full control | Limited |
| **Bitcoin Features** | ✅ Build anything | ❌ None |
| **Certificates** | ✅ Bitcoin-timestamped | ✅ Generic |
| **Dev Time** | 2-3 months | 1 week (plug-n-play) |
| **Lock-in** | None (own content) | Vendor lock-in |
| **Brand** | Fully yours | Teachable branded |

**Verdict: GitBook + Custom wins for Bitcoin-native learning platform**

---

## Public Sharability Features

### 1. Public Course Catalog

**URL:** `https://docs.noonewillpay.com`

Anyone can browse courses without login:
- View all chapters
- Read content
- See course structure
- Cannot: Track progress, take quizzes, earn certificates (login required)

### 2. Public Certificate Verification

**URL:** `https://noonewillpay.com/cert/CERT-2025-001234`

Shows:
- ✅ Certificate details (name, course, date)
- ✅ Bitcoin timestamp proof
- ✅ Verification status
- ✅ QR code (share/print)

Example:
```
┌───────────────────────────────────────────────────┐
│ Certificate Verification                          │
├───────────────────────────────────────────────────┤
│                                                   │
│ ✅ VERIFIED                                       │
│                                                   │
│ Certificate ID: CERT-2025-001234                  │
│ Recipient: Alice Johnson                          │
│ Course: Bitcoin Fundamentals (Part 1)             │
│ Completed: October 9, 2025                        │
│                                                   │
│ Bitcoin Timestamp:                                │
│ Block: 812,345                                    │
│ Timestamp: 2025-10-09 14:23:45 UTC                │
│ OpenTimestamps Proof: [Verify]                    │
│                                                   │
│ This certificate is cryptographically proven      │
│ to have existed on the Bitcoin blockchain.        │
│                                                   │
│ [Download Certificate] [Share]                    │
└───────────────────────────────────────────────────┘
```

### 3. Public Leaderboards

**URL:** `https://noonewillpay.com/leaderboard`

Shows (with user permission):
- Top performers (anonymous or display name)
- City rankings
- Course completion stats
- Opt-in only (privacy respecting)

### 4. Social Media Cards

Auto-generated for sharing:
- Twitter/X card (1200x630px)
- Nostr image
- LinkedIn post
- All include certificate ID for verification

---

## Next Steps

**Immediate (This Week):**
1. Set up GitBook repo
2. Migrate Chapter 1 content
3. Test GitBook embedding
4. Build simple progress tracker (MVP)

**Short-Term (Month 1):**
1. Complete content migration
2. Build quiz engine
3. Implement basic certificates
4. Launch beta with 10 test users

**Long-Term (Month 2-3):**
1. Social features (achievements, leaderboards)
2. Nostr integration
3. Bitcoin timestamping
4. Mobile app (optional)

---

**GitBook + Custom Backend = Best of both worlds: Beautiful content presentation + Bitcoin-native learning features!** 🍕⚡📚
