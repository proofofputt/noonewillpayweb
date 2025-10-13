# Scripts Directory

This directory contains maintenance and migration scripts for the No One Will Pay project.

## Migration Scripts

### `migrate-points-history.ts`

Migrates existing points data to the new comprehensive points tracking system.

**What it does:**
- Updates existing quiz points with proper point types and metadata
- Updates existing referral points with new categorization
- Backfills missing Quick Quiz data in survey responses
- Adds missing registration bonuses for eligible users
- Ensures all points have proper audit trail fields

**Safety:**
- ✅ Idempotent (can be run multiple times safely)
- ✅ Does not delete or lose data
- ✅ Adds metadata to track migration
- ✅ Includes error handling and reporting

**How to run:**

```bash
# Using tsx (recommended)
npx tsx scripts/migrate-points-history.ts

# Or add to package.json scripts:
npm run migrate:points
```

**Add to package.json:**
```json
{
  "scripts": {
    "migrate:points": "tsx scripts/migrate-points-history.ts"
  }
}
```

**Expected output:**
```
🚀 Starting Points History Migration...

📊 Step 1: Fetching existing points history...
   Found 150 existing records

📝 Step 2: Migrating quiz points...
   ✓ Updated 45 quiz records

🤝 Step 3: Migrating referral points...
   ✓ Updated 80 referral records

📋 Step 4: Backfilling Quick Quiz data in surveys...
   ✓ Updated 30 survey records

🎁 Step 5: Adding missing registration bonuses...
   ✓ Added 12 registration bonuses

📊 Migration Complete!

==================================================
Statistics:
  Total records processed: 150
  Quiz records updated: 45
  Referral records updated: 80
  Survey records updated: 30
  Registration bonuses added: 12

✅ No errors encountered!
==================================================
```

**When to run:**
- After deploying the new points system code
- Before users start taking the Full Assessment
- Can be run in production with zero downtime

**Post-migration verification:**
```bash
# Check points breakdown for a user
curl "http://localhost:3000/api/points/breakdown?referralCode=USER_CODE"

# Check points history
curl "http://localhost:3000/api/points/history?referralCode=USER_CODE"
```

## Adding New Scripts

When adding new scripts to this directory:

1. Use TypeScript (`.ts` extension)
2. Add proper error handling
3. Make scripts idempotent when possible
4. Document in this README
5. Add npm script to package.json
6. Include progress logging
7. Provide usage examples
