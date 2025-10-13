# Sticker Referral System Documentation

## Overview

The sticker referral system allows you to print QR codes on physical stickers that can be distributed at events, conferences, or retail locations. Each sticker contains a unique code that:

1. **First User**: Claims ownership of the sticker code and becomes its "owner"
2. **Subsequent Users**: Are automatically referred by the person who claimed the sticker
3. **Tracking**: All referrals through that sticker are credited to the claimer

---

## Features

### For Admins
- Generate batches of unique sticker codes
- Download codes as CSV for printing
- View QR codes for individual stickers
- Track usage statistics per batch
- Monitor claimed vs unclaimed codes

### For Users
- Claim sticker codes by being the first to use them
- View claimed stickers on their dashboard
- See referral statistics from sticker codes
- Automatic point allocation for referrals

---

## Database Schema

### `sticker_codes` Table

```sql
- id: UUID (Primary Key)
- code: VARCHAR(20) UNIQUE -- Format: STIK-XXXX
- claimed: BOOLEAN -- Has someone claimed this?
- claimedBy: UUID -- User who claimed it (foreign key to users)
- claimedBySurvey: UUID -- Survey that claimed it (foreign key to survey_responses)
- claimedAt: TIMESTAMP -- When it was claimed
- usageCount: INTEGER -- Number of referrals through this code
- batchId: VARCHAR(50) -- For grouping codes
- notes: TEXT -- Optional notes
- active: BOOLEAN -- Can be deactivated
- createdAt: TIMESTAMP
```

---

## API Endpoints

### 1. Generate Sticker Codes (Admin Only)
**POST** `/api/admin/generate-sticker-codes`

**Request Body:**
```json
{
  "count": 100,                    // 1-1000
  "batchId": "CONFERENCE-2024",    // Optional
  "notes": "Q1 Conference batch"   // Optional
}
```

**Response:**
```json
{
  "success": true,
  "batchId": "CONFERENCE-2024",
  "generated": 100,
  "failed": 0,
  "codes": ["STIK-A3F9", "STIK-B7D2", ...]
}
```

### 2. Get All Sticker Codes (Admin Only)
**GET** `/api/admin/generate-sticker-codes?batchId=BATCH-123&claimed=true`

**Response:**
```json
{
  "success": true,
  "codes": [...],
  "batches": [
    {
      "batchId": "CONFERENCE-2024",
      "total": 100,
      "claimed": 23,
      "unclaimed": 77,
      "totalUsage": 45
    }
  ],
  "stats": {
    "totalCodes": 500,
    "claimed": 120,
    "unclaimed": 380,
    "active": 500
  }
}
```

### 3. Check Sticker Code Status (Public)
**GET** `/api/sticker-codes/check/STIK-A3F9`

**Response:**
```json
{
  "success": true,
  "exists": true,
  "code": "STIK-A3F9",
  "claimed": true,
  "claimedAt": "2024-10-12T10:30:00Z",
  "usageCount": 12,
  "active": true,
  "message": "This sticker has been claimed and is now a referral code"
}
```

### 4. Get Profile/Referral Stats
**GET** `/api/profile/stats?referralCode=ABCD-1234`

Can also query by:
- `?phone=2025551234`
- `?email=user@example.com`

**Response:**
```json
{
  "success": true,
  "stats": {
    "referralCode": "ABCD-1234",
    "referralCount": 15,
    "totalScore": 85,
    "allocationPoints": 1050,
    "rank": 42,
    "referrals": [...]
  },
  "stickerCodes": {
    "stickers": [
      {
        "code": "STIK-A3F9",
        "claimedAt": "2024-10-12T10:30:00Z",
        "usageCount": 12,
        "batchId": "CONFERENCE-2024"
      }
    ],
    "totalStickerReferrals": 12
  }
}
```

---

## User Flow

### Scenario 1: First User Claims Sticker

1. User scans QR code: `https://yoursite.com/?ref=STIK-A3F9`
2. User completes survey
3. System detects `STIK-A3F9` is an unclaimed sticker code
4. Sticker is claimed:
   - `claimed = true`
   - `claimedBySurvey = [survey ID]`
   - `claimedBy = [user ID if they have an account]`
   - `claimedAt = NOW()`
5. User receives their own referral code: `ABCD-1234`
6. User can view their dashboard: `/dashboard?code=ABCD-1234`

### Scenario 2: Subsequent Users Use Same Sticker

1. Second user scans same QR code: `https://yoursite.com/?ref=STIK-A3F9`
2. User completes survey
3. System detects `STIK-A3F9` is already claimed
4. System finds the original claimer's survey and referral code
5. Second user is recorded as referred by: `ABCD-1234` (the claimer's code)
6. Original claimer gets:
   - +50 referral points
   - +10% of second user's score
   - `usageCount` on sticker increments to 1
7. Second user gets their own referral code: `EFGH-5678`

---

## Admin Workflow

### Step 1: Generate Codes

1. Navigate to `/admin/sticker-codes`
2. Enter number of codes (1-1000)
3. Optionally add batch ID (e.g., "CONFERENCE-2024-Q1")
4. Optionally add notes
5. Click "Generate"

### Step 2: Download for Printing

1. Select a batch or click "Download All CSV"
2. CSV includes: Code, Batch ID, Claimed status, Usage count, Created date
3. Import CSV into your printing software
4. Print QR codes on stickers (recommended: weatherproof labels)

### Step 3: Generate QR Codes

**Option A: Individual QR Codes**
- Click on any code in the admin panel
- QR code displays in modal
- Right-click to save image

**Option B: Bulk QR Generation**
Use the CSV with a QR code generator like:
- QR Code Generator Pro
- Canva (batch QR codes)
- Python script using `qrcode` library

### Step 4: Monitor Usage

- View real-time stats on admin dashboard
- Track which batches are performing best
- See claimed vs unclaimed rates
- Monitor referral conversion rates

---

## Testing Instructions

### 1. Database Migration

```bash
cd /Users/nw/No.One.Will.Pay/noonewillpay-web

# Run migration
psql $DATABASE_URL -f drizzle/migrations/0006_add_sticker_codes_table.sql
```

### 2. Generate Test Codes

```bash
# Login as admin (you'll need admin authentication)
# Then navigate to:
http://localhost:3000/admin/sticker-codes

# Generate 10 test codes
```

### 3. Test First User Claim

```bash
# Use one of the generated codes
http://localhost:3000/?ref=STIK-XXXX

# Complete survey
# Check that code is now marked as claimed
```

### 4. Test Subsequent Referrals

```bash
# Use the SAME code again with different phone number
http://localhost:3000/?ref=STIK-XXXX

# Complete survey
# Check that first user got referral points
# Check that usageCount incremented
```

### 5. Test Dashboard

```bash
# Get the first user's referral code from survey completion
http://localhost:3000/dashboard?code=THEIR-CODE

# Should see:
# - Their claimed sticker code
# - Referral count from sticker
# - Allocation points breakdown
```

---

## Production Deployment Checklist

- [ ] Run database migration
- [ ] Test admin authentication
- [ ] Generate initial batch of codes
- [ ] Test QR code generation
- [ ] Test printing workflow
- [ ] Test claiming flow
- [ ] Test referral attribution
- [ ] Monitor analytics
- [ ] Set up batch tracking system
- [ ] Train staff on code distribution

---

## Troubleshooting

### Code Not Claiming
**Issue**: Sticker code not being claimed when first user submits survey

**Check**:
1. Is the code in the `sticker_codes` table?
2. Is `active = true`?
3. Check browser console for errors
4. Verify URL format: `?ref=STIK-XXXX`

### Referrals Not Tracking
**Issue**: Subsequent users not being credited to claimer

**Check**:
1. Is sticker code claimed? (`claimed = true`)
2. Does `claimedBySurvey` point to valid survey?
3. Check that survey has `referralCode` set
4. Verify `submit-survey` route logic

### Dashboard Not Loading
**Issue**: User dashboard shows error

**Check**:
1. Correct URL parameter: `?code=XXXX` or `?phone=XXX` or `?email=XXX`
2. Does survey response exist with that referral code?
3. Check `/api/profile/stats` endpoint directly
4. Verify database connection

---

## Best Practices

### Code Distribution
- Use weatherproof stickers for outdoor use
- Include branding alongside QR code
- Add text: "Scan to claim your referral code!"
- Test QR codes before mass printing

### Batch Management
- Use descriptive batch IDs: `CONF-NYC-2024-Q1`
- Add notes with location/event details
- Track which events perform best
- Retire old batches when depleted

### Security
- Admin endpoints require authentication
- Codes are single-claim (can't be claimed twice)
- IP and phone validation prevents abuse
- Monitor for suspicious patterns

---

## Future Enhancements

- [ ] Bulk QR code image generation
- [ ] Export QR codes as PDF for printing
- [ ] Analytics dashboard per batch
- [ ] Expiration dates for sticker codes
- [ ] Geographic tracking of claims
- [ ] Integration with printing services
- [ ] Mobile app for code validation
- [ ] Real-time notifications for claims

---

## Support

For issues or questions:
- Check logs: `console.error` messages
- Test API endpoints with Postman/curl
- Verify database schema matches migration
- Review this documentation

---

Last Updated: 2024-10-12
Version: 1.0.0
