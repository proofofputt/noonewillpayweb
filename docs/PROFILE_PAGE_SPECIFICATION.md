# Profile Page Specification - Pizza Ninjas Network

**Version**: 1.0
**Date**: 2025-10-09
**Purpose**: Comprehensive profile system for professional networking and community building

---

## Overview

The Pizza Ninjas profile page serves three core purposes:

1. **Rewards Eligibility** - Collect Taproot address + phone for treasury distributions
2. **Professional Networking** - Enable meaningful introductions and collaboration discovery
3. **Community Building** - Surface synergies, shared interests, and potential partnerships

---

## Profile Page Structure

### Section 1: Required Information (Rewards Eligibility)

**These fields unlock treasury rewards and platform participation:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 REQUIRED: REWARDS ELIGIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Name: ________________________
(How you'd like to be introduced)

Email Address: ________________________
(Primary contact)

Phone Number: ________________________
(Required for SMS notifications - free pizza codes, event reminders)

Bitcoin Taproot Address (bc1p...): ________________________________
(Where you'll receive treasury rewards)

☑ I want to receive updates about free pizza codes
☑ I want to participate in the treasury rewards program
☑ I've backed up my seed phrase securely (confirm you control this address)

[Verify Address] [Save & Continue]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Validation:**
- Taproot address must start with `bc1p` and be 62 characters
- Phone number format check (international support)
- Email verification link sent
- Checkbox acknowledgments required

---

### Section 2: Professional Introduction (Recommended)

**Help others understand who you are and what you bring to the community:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PROFESSIONAL INTRODUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Professional Title/Role: ________________________
(e.g., "Bitcoin Developer", "Restaurant Owner", "Community Organizer")

Current City & Country: ________________________
(Helps connect with local community members)

Professional Bio (280 characters):
_________________________________________________
_________________________________________________
(Think Twitter bio - concise, punchy)

Professional Website/Portfolio (optional):
https:// ________________________

LinkedIn (optional):
https://linkedin.com/in/ ________________________

GitHub (optional):
https://github.com/ ________________________

Twitter/X (optional):
https://twitter.com/ ________________________

Nostr npub (optional):
npub1... ________________________________
(Your Nostr public key)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 3: Skills & Expertise (Recommended)

**Signal what you can contribute and what you're looking for:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILLS & EXPERTISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Expertise (select up to 3):
☐ Bitcoin Protocol Development
☐ Lightning Network Development
☐ Smart Contracts (Stacks, RGB, etc.)
☐ Bitcoin Mining
☐ Cryptography
☐ Security/OpSec
☐ Frontend Development
☐ Backend Development
☐ Mobile Development
☐ UI/UX Design
☐ Graphic Design
☐ Marketing & Growth
☐ Community Management
☐ Event Organization
☐ Content Creation (Writing)
☐ Content Creation (Video)
☐ Podcasting
☐ Business Development
☐ Legal/Compliance
☐ Finance/Accounting
☐ Project Management
☐ Restaurant/Hospitality
☐ Education/Teaching
☐ Translation/Localization
☐ Other: ________________________

What I'm Looking to Collaborate On:
☐ Open-source Bitcoin projects
☐ Starting a Bitcoin business
☐ Educational content creation
☐ Local community building
☐ Bitcoin meetup organizing
☐ Restaurant partnerships
☐ Marketing initiatives
☐ Technical infrastructure
☐ Nothing right now (just learning)
☐ Other: ________________________

I Can Help Others With (free text):
_________________________________________________
_________________________________________________
(What could you mentor/advise on? Be specific!)

I'm Currently Learning (free text):
_________________________________________________
_________________________________________________
(What are you trying to get better at?)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 4: Bitcoin & Web3 Affiliations (Optional)

**Show your community involvement and discover shared connections:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BITCOIN & WEB3 AFFILIATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bitcoin Communities I'm Active In (select all that apply):
☐ Bitcoin Twitter/X
☐ Nostr
☐ Bitcoin Telegram groups
☐ BitcoinTalk forums
☐ Reddit r/Bitcoin
☐ Stacker.News
☐ Local Bitcoin meetup (specify city): ________________________
☐ Bitcoin Magazine community
☐ Swan Signal community
☐ What Bitcoin Did community
☐ Citadel Dispatch community
☐ TFTC (Tales From The Crypt)
☐ Bitcoin Conference attendee (specify): ________________________
☐ Other: ________________________

Bitcoin Layer 2 / Sidechain Interest:
☐ Lightning Network
☐ Liquid Network
☐ Stacks
☐ RGB Protocol
☐ Taproot Assets
☐ Fedimint
☐ Ark
☐ Other: ________________________

Bitcoin Projects I Contribute To (optional):
_________________________________________________
(Open-source repos, DAOs, community projects)

Bitcoin Podcasts I Listen To (top 3):
1. ________________________
2. ________________________
3. ________________________

Proof-of-Work (optional fun signal):
Have you read the Bitcoin whitepaper?
☐ Yes, multiple times
☐ Yes, once
☐ Skimmed it
☐ Not yet (it's Chapter 2! 📚)

How did you first hear about Bitcoin?
☐ 2009-2012 (OG)
☐ 2013-2016 (Early adopter)
☐ 2017 (First bull run)
☐ 2020-2021 (COVID era)
☐ 2024+ (Recent)

[Text field]: My Bitcoin journey started when...
_________________________________________________
_________________________________________________
(Optional: Share your orange-pill story)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 5: Interests & Hobbies (Optional)

**Discover shared interests beyond Bitcoin:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INTERESTS & HOBBIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Topics I'm Passionate About (select all that apply):
☐ Austrian Economics
☐ Philosophy
☐ History
☐ Politics/Governance
☐ Technology/AI
☐ Entrepreneurship
☐ Personal Finance/Investing
☐ Privacy/Security
☐ Open Source
☐ Sustainability/Environment
☐ Art
☐ Music
☐ Gaming
☐ Sports
☐ Fitness/Health
☐ Cooking/Food
☐ Travel
☐ Writing
☐ Reading/Books
☐ Science
☐ Education
☐ Other: ________________________

Favorite Book Genres:
☐ Bitcoin/Crypto books
☐ Economics/Finance
☐ Philosophy
☐ Science Fiction
☐ Technology
☐ History
☐ Biography/Memoir
☐ Self-improvement
☐ Fiction
☐ Other: ________________________

Current Book I'm Reading (optional):
_________________________________________________

Hobbies & Side Interests:
_________________________________________________
_________________________________________________
(What do you do for fun? Helps find event synergies!)

Favorite Pizza Topping (important! 🍕):
☐ Pepperoni
☐ Mushrooms
☐ Sausage
☐ Onions
☐ Peppers
☐ Olives
☐ Pineapple (controversial!)
☐ Plain cheese (purist)
☐ Vegan/plant-based
☐ Other: ________________________

Dietary Restrictions (helps event organizers):
☐ None
☐ Vegetarian
☐ Vegan
☐ Gluten-free
☐ Dairy-free
☐ Nut allergy
☐ Other: ________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 6: Passion Projects & Current Work (Optional)

**Share what you're building and invite collaboration:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSION PROJECTS & CURRENT WORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Are you currently working on a project?
☐ Yes, actively building
☐ Yes, in planning/ideation stage
☐ Yes, side project (nights/weekends)
☐ No, but open to joining projects
☐ No, just learning for now

If yes, describe your project (280 characters):
_________________________________________________
_________________________________________________

Project Type:
☐ Bitcoin/Lightning application
☐ Bitcoin education/media
☐ Bitcoin business/startup
☐ Community organizing
☐ Open-source tool/library
☐ Hardware/physical product
☐ Content/media platform
☐ Research/analysis
☐ Non-Bitcoin (but cool!)
☐ Other: ________________________

Project Stage:
☐ Idea/concept
☐ Prototype/MVP
☐ Beta testing
☐ Live/launched
☐ Scaling/growing

Looking for collaborators?
☐ Yes - need developers
☐ Yes - need designers
☐ Yes - need marketers
☐ Yes - need funding/investors
☐ Yes - need advisors/mentors
☐ Yes - need community feedback
☐ No, not right now
☐ Maybe, feel free to reach out

Project Website/Link (optional):
https:// ________________________

GitHub/Code Repository (optional):
https://github.com/ ________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 7: Community Preferences (Optional)

**Help us tailor your experience:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COMMUNITY PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event Types I'd Attend (select all that apply):
☐ Book clubs (Bitcoin/economics literature)
☐ Game nights (board games, video games)
☐ Casual meetups (coffee, pizza, drinks)
☐ Technical workshops (coding, node setup)
☐ Educational talks/presentations
☐ Hackathons
☐ Conferences
☐ Outdoor activities (hikes, sports)
☐ Coworking sessions
☐ Other: ________________________

Preferred Event Frequency:
☐ Weekly
☐ Bi-weekly
☐ Monthly
☐ Quarterly
☐ Just special occasions

Preferred Event Size:
☐ Small (5-10 people, intimate)
☐ Medium (10-30 people, social)
☐ Large (30-100+ people, networking)
☐ Any size, I'm flexible

Communication Preferences:
☐ Email updates (low frequency)
☐ SMS notifications (event reminders only)
☐ Telegram group membership
☐ Discord server access
☐ Nostr DMs
☐ Prefer not to be contacted (just rewards)

I'm interested in:
☐ Organizing events in my city
☐ Becoming a Pizza Ninjas ambassador
☐ Volunteering for community initiatives
☐ Mentoring newcomers to Bitcoin
☐ Speaking at events
☐ Sponsoring events/treasury contributions
☐ Just participating, no leadership role

Availability:
☐ Weekday evenings (after work)
☐ Weekends (anytime)
☐ Weekday mornings/afternoons
☐ Varies, check with me
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Section 8: Privacy Settings

**Control what others can see:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PRIVACY SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Public Profile Visibility:
☐ Public (anyone can view)
☐ Community Only (Pizza Ninjas members)
☐ Private (only visible to event organizers)

Show my profile in:
☐ Community directory (searchable by skills, city, interests)
☐ Event participant lists
☐ Collaboration matching suggestions
☐ None of the above (completely private)

What can others see:
☑ Name and city (always visible if attending events)
☐ Professional bio and social links
☐ Skills and expertise
☐ Bitcoin affiliations
☐ Interests and hobbies
☐ Passion project details
☐ Email address (for collaboration)
☐ Phone number (only organizers)

Collaboration Matching:
☐ Yes, match me with others based on shared interests/skills
☐ Maybe, I'm open but not actively seeking
☐ No, I prefer to network organically

Data Export:
You can download all your profile data at any time.
[Download My Data]

Account Deletion:
You can delete your account and all associated data.
[Delete Account]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Database Schema

### Users Table (Core)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Required (Section 1)
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  taproot_address TEXT NOT NULL, -- bc1p...
  seed_phrase_backed_up BOOLEAN DEFAULT FALSE,
  wants_pizza_codes BOOLEAN DEFAULT TRUE,
  wants_treasury_rewards BOOLEAN DEFAULT TRUE,

  -- Professional (Section 2)
  professional_title TEXT,
  city TEXT,
  country TEXT,
  bio TEXT, -- 280 char limit
  website_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  nostr_npub TEXT,

  -- Dietary (Section 5)
  dietary_restrictions TEXT, -- JSON array
  favorite_pizza_topping TEXT,

  -- Privacy (Section 8)
  profile_visibility TEXT DEFAULT 'community', -- public, community, private
  show_in_directory BOOLEAN DEFAULT TRUE,
  show_in_events BOOLEAN DEFAULT TRUE,
  show_email BOOLEAN DEFAULT FALSE,
  show_phone BOOLEAN DEFAULT FALSE,
  collaboration_matching_enabled BOOLEAN DEFAULT TRUE
);
```

### User Skills Table
```sql
CREATE TABLE user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_category TEXT NOT NULL, -- expertise, learning, collaboration
  skill_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Affiliations Table
```sql
CREATE TABLE user_affiliations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  affiliation_type TEXT NOT NULL, -- community, layer2, project, podcast
  affiliation_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Interests Table
```sql
CREATE TABLE user_interests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  interest_category TEXT NOT NULL, -- passion_topic, book_genre, hobby
  interest_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Projects Table
```sql
CREATE TABLE user_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_name TEXT,
  project_description TEXT, -- 280 char
  project_type TEXT,
  project_stage TEXT,
  project_url TEXT,
  github_url TEXT,
  looking_for_collaborators BOOLEAN DEFAULT FALSE,
  collaborator_needs TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Event preferences
  preferred_event_types TEXT, -- JSON array
  preferred_event_frequency TEXT,
  preferred_event_size TEXT,

  -- Communication
  communication_channels TEXT, -- JSON array
  interested_in_organizing BOOLEAN DEFAULT FALSE,
  interested_in_ambassador BOOLEAN DEFAULT FALSE,
  interested_in_volunteering BOOLEAN DEFAULT FALSE,
  interested_in_mentoring BOOLEAN DEFAULT FALSE,
  interested_in_speaking BOOLEAN DEFAULT FALSE,
  interested_in_sponsoring BOOLEAN DEFAULT FALSE,

  -- Availability
  availability_weekday_evenings BOOLEAN DEFAULT FALSE,
  availability_weekends BOOLEAN DEFAULT FALSE,
  availability_weekday_daytime BOOLEAN DEFAULT FALSE,
  availability_varies BOOLEAN DEFAULT TRUE,

  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Bitcoin Journey Table
```sql
CREATE TABLE user_bitcoin_journey (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  read_whitepaper TEXT, -- multiple, once, skimmed, not_yet
  bitcoin_era TEXT, -- 2009-2012, 2013-2016, 2017, 2020-2021, 2024+
  orange_pill_story TEXT, -- Free text

  current_book TEXT,
  favorite_podcasts TEXT, -- JSON array

  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Profile Completion Gamification

### Progress Indicators

**Level 1: Rewards Ready (Required)**
- ✅ Name, email, phone
- ✅ Taproot address
- ✅ Seed phrase backed up confirmation
- **Unlocks**: Treasury rewards, event participation

**Level 2: Community Member (Recommended)**
- ✅ Professional title and city
- ✅ Bio written
- ✅ At least 3 skills selected
- **Unlocks**: Community directory listing, collaboration matching

**Level 3: Active Contributor (Optional)**
- ✅ Bitcoin affiliations added
- ✅ Interests and hobbies filled out
- ✅ Event preferences set
- **Unlocks**: Featured in weekly newsletter, priority event invites

**Level 4: Community Leader (Optional)**
- ✅ Passion project documented
- ✅ Looking for collaborators
- ✅ Interested in organizing/mentoring
- **Unlocks**: Ambassador consideration, speaking opportunities

---

## Profile Display (Public View)

### Profile Card (Compact View)
```
┌─────────────────────────────────────────────────┐
│ 🧑 Alice Johnson                    📍 Austin, TX │
│ ⚡ Lightning Network Developer                    │
│                                                  │
│ "Building the circular economy, one payment     │
│  at a time. Open to collaborations!"            │
│                                                  │
│ 🔧 Skills: Lightning Dev, Node.js, Community     │
│ 🌐 GitHub: @alice-btc                            │
│ 💡 Project: LN Pizza Bot (beta)                  │
│                                                  │
│ [View Full Profile] [Connect] [Message]         │
└─────────────────────────────────────────────────┘
```

### Full Profile Page
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Alice Johnson
 Lightning Network Developer
 📍 Austin, TX, USA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

About
"Building the circular economy, one payment at a time.
Open to collaborations!"

🔗 Links
  GitHub: @alice-btc
  Twitter: @alice_lightning
  Nostr: npub1alice...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skills & Expertise
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Expertise:
  • Lightning Network Development
  • Backend Development (Node.js, Rust)
  • Community Management

Looking to Collaborate On:
  • Open-source Bitcoin projects
  • Educational content creation
  • Local community building

I Can Help With:
  "Setting up Lightning nodes, integrating LNURL,
   building Lightning-enabled apps. Happy to mentor!"

Currently Learning:
  "RGB Protocol, Taproot Assets, Rust programming"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bitcoin Journey
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bitcoin Since: 2017
Read Whitepaper: Yes, multiple times

Communities:
  • Nostr
  • Lightning Network Telegram
  • Austin Bitcoin Meetup
  • Stacker.News

Favorite Podcasts:
  1. Citadel Dispatch
  2. Bitcoin Review
  3. Lightning Junkies

Orange Pill Story:
  "Discovered Bitcoin during 2017 bull run. Lost money,
   got humbled, read the whitepaper, became obsessed
   with Lightning Network's potential. Never looked back!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 LN Pizza Bot (Beta)
   "Telegram bot that lets you order pizza and pay
    via Lightning. Currently testing in Austin."

   Type: Lightning application
   Stage: Beta testing
   Looking for: Beta testers, Node.js devs, feedback

   🔗 github.com/alice-btc/ln-pizza-bot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Interests & Hobbies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passionate About:
  • Austrian Economics
  • Open Source
  • Technology/AI
  • Entrepreneurship

Currently Reading: "The Bitcoin Standard"

Hobbies: Rock climbing, brewing beer, board games

🍕 Favorite Pizza: Mushrooms & jalapeños
🥗 Dietary: Vegetarian

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Event Preferences
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event Types: Book clubs, Technical workshops, Meetups
Frequency: Bi-weekly
Size Preference: Small-medium (10-30 people)
Availability: Weekday evenings, Weekends

Open to: Organizing events, Mentoring newcomers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Message Alice] [Connect] [View Projects] [Back to Directory]
```

---

## Collaboration Matching Algorithm

### Matching Signals

**High-weight signals:**
- Same city (local collaboration)
- Complementary skills (designer + developer)
- Shared project interests (both interested in Lightning apps)
- Looking for specific collaborators (dev seeking marketer, vice versa)

**Medium-weight signals:**
- Similar Bitcoin communities
- Overlapping interests/hobbies
- Same event preferences (both like book clubs)
- Similar availability

**Low-weight signals:**
- Read same podcasts
- Similar Bitcoin era
- Same favorite pizza topping (fun Easter egg)

### Matching Interface

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUGGESTED CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your profile, you might want to connect with:

┌─────────────────────────────────────────────────┐
│ 🎨 Bob Designer                   📍 Austin, TX │
│ UI/UX Designer for Bitcoin Apps                 │
│                                                  │
│ Match Reasons:                                   │
│ ✅ Same city (Austin)                            │
│ ✅ Complementary skills (you: dev, Bob: design) │
│ ✅ Both interested in Lightning apps            │
│ ✅ Both attend Austin Bitcoin Meetup            │
│                                                  │
│ Bob is looking for: Frontend/backend developers │
│ You're looking for: Designers                    │
│                                                  │
│ [Connect] [View Profile] [Not Interested]       │
└─────────────────────────────────────────────────┘

[Show More Matches] [Adjust Matching Preferences]
```

---

## Privacy & Data Usage Policy

### What We Collect
- Required: Name, email, phone, Taproot address (for rewards)
- Optional: Everything else (professional info, skills, interests, projects)

### How We Use Data
- **Rewards distribution**: Send treasury codes to Taproot address, SMS notifications to phone
- **Community building**: Match collaborators, suggest connections, organize local events
- **Platform improvement**: Aggregate analytics (never sell individual data)

### What We Share
- **Public profiles**: Only what you choose to make public
- **Event organizers**: Name, dietary restrictions, attendance
- **Other members**: Based on your privacy settings
- **Third parties**: NEVER (no data sales, no advertising)

### Your Rights
- ✅ Download all your data (JSON export)
- ✅ Edit profile anytime
- ✅ Adjust privacy settings
- ✅ Delete account (removes all data)
- ✅ Opt out of matching/directory
- ✅ Unsubscribe from communications

---

## Implementation Phases

### Phase 1: MVP (Required for Launch)
- ✅ Section 1: Required Information (rewards)
- ✅ Basic profile display
- ✅ Privacy settings (public/private toggle)
- ✅ Profile completion percentage

### Phase 2: Community Features
- ✅ Section 2: Professional Introduction
- ✅ Section 3: Skills & Expertise
- ✅ Section 5: Interests & Hobbies (simplified)
- ✅ Community directory (searchable)
- ✅ Basic matching (city + skills)

### Phase 3: Advanced Networking
- ✅ Section 4: Bitcoin Affiliations
- ✅ Section 6: Passion Projects
- ✅ Section 7: Community Preferences
- ✅ Advanced collaboration matching
- ✅ Project showcase pages
- ✅ Messaging/DMs between users

### Phase 4: Gamification
- Achievement badges (profile completion, event attendance, contributions)
- Leaderboards (most connections, most helpful, most active)
- Reputation system (community endorsements)

---

## Mobile-First Design Notes

### Progressive Disclosure
- Required fields first (minimize friction)
- Optional sections collapsible ("Add Professional Info +")
- Save progress as you go (no "lose your data" frustration)
- Multi-step wizard option (5 screens vs. 1 long form)

### Quick Actions
- QR code for Taproot address (easy to scan/share)
- "Copy profile link" button
- "Share profile" (to Nostr, Twitter, Telegram)
- "Add to event" shortcut

---

**This comprehensive profile system transforms Pizza Ninjas from a simple rewards platform into a thriving professional network for Bitcoin builders and enthusiasts!** 🍕⚡
