-- Migration: Add multi-level referral system support
-- Date: 2024-10-12
-- Description: Implements Bitcoin-style halving referral points system

-- ============================================================
-- STEP 1: Backup current data (safety measure)
-- ============================================================

-- Create backup tables
CREATE TABLE IF NOT EXISTS referrals_backup AS SELECT * FROM referrals;
CREATE TABLE IF NOT EXISTS allocation_points_history_backup AS SELECT * FROM allocation_points_history;
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;

-- ============================================================
-- STEP 2: Update referrals table
-- ============================================================

-- Add new columns for multi-level tracking
ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS referred_survey_id UUID REFERENCES survey_responses(id),
  ADD COLUMN IF NOT EXISTS referral_level INTEGER DEFAULT 1 NOT NULL;

-- Change points_earned from integer to decimal
ALTER TABLE referrals
  ALTER COLUMN points_earned TYPE DECIMAL(10,3) USING points_earned::DECIMAL(10,3);

-- Update default for new rows
ALTER TABLE referrals
  ALTER COLUMN points_earned SET DEFAULT 21.000;

-- Update existing rows to new point value (21 instead of 50)
UPDATE referrals SET points_earned = 21.000 WHERE points_earned = 50;

-- Add comments
COMMENT ON COLUMN referrals.referral_level IS 'Referral depth: 1=direct, 2=second-degree, 3=third-degree, etc.';
COMMENT ON COLUMN referrals.referred_survey_id IS 'Survey ID of the person who was referred';
COMMENT ON COLUMN referrals.points_earned IS 'Points awarded (21, 10.5, 5.25, 2.25, or 1.125 based on level)';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS referrals_level_idx ON referrals(referral_level);
CREATE INDEX IF NOT EXISTS referrals_survey_idx ON referrals(referred_survey_id);

-- ============================================================
-- STEP 3: Update allocation_points_history table
-- ============================================================

-- Add referral level tracking
ALTER TABLE allocation_points_history
  ADD COLUMN IF NOT EXISTS referral_level INTEGER;

-- Change points from integer to decimal
ALTER TABLE allocation_points_history
  ALTER COLUMN points TYPE DECIMAL(10,3) USING points::DECIMAL(10,3);

-- Add comment
COMMENT ON COLUMN allocation_points_history.referral_level IS 'For referral source: 1=direct, 2=2nd degree, 3=3rd degree, etc.';

-- Create index
CREATE INDEX IF NOT EXISTS allocation_points_history_level_idx ON allocation_points_history(referral_level);

-- ============================================================
-- STEP 4: Update users table
-- ============================================================

-- Change allocation_points from integer to decimal
ALTER TABLE users
  ALTER COLUMN allocation_points TYPE DECIMAL(12,3) USING allocation_points::DECIMAL(12,3);

-- Set default for new users
ALTER TABLE users
  ALTER COLUMN allocation_points SET DEFAULT 0.000;

-- Add comment
COMMENT ON COLUMN users.allocation_points IS 'Total allocation points (supports decimal for multi-level referral system)';

-- ============================================================
-- STEP 5: Create helper view for referral tree queries
-- ============================================================

CREATE OR REPLACE VIEW referral_tree_view AS
WITH RECURSIVE referral_chain AS (
  -- Base case: direct referrals
  SELECT
    sr.id as survey_id,
    sr.referral_code,
    sr.referred_by,
    sr.phone,
    sr.email,
    sr.score,
    sr.timestamp,
    1 as depth,
    sr.referral_code::TEXT as path
  FROM survey_responses sr
  WHERE sr.referred_by IS NOT NULL

  UNION ALL

  -- Recursive case: follow the chain up
  SELECT
    sr.id,
    sr.referral_code,
    sr.referred_by,
    sr.phone,
    sr.email,
    sr.score,
    sr.timestamp,
    rc.depth + 1,
    rc.path || ' -> ' || sr.referral_code
  FROM survey_responses sr
  INNER JOIN referral_chain rc ON sr.referred_by = rc.referral_code
  WHERE rc.depth < 5  -- Limit to 5 levels
)
SELECT * FROM referral_chain;

COMMENT ON VIEW referral_tree_view IS 'Recursive view showing referral chains up to 5 levels deep';

-- ============================================================
-- STEP 6: Validation queries (for testing)
-- ============================================================

-- Check data types were updated correctly
DO $$
BEGIN
  -- Validate referrals table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referrals'
    AND column_name = 'referral_level'
  ) THEN
    RAISE EXCEPTION 'Migration failed: referral_level column not added';
  END IF;

  -- Validate allocation_points_history table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'allocation_points_history'
    AND column_name = 'referral_level'
  ) THEN
    RAISE EXCEPTION 'Migration failed: referral_level column not added to history';
  END IF;

  RAISE NOTICE 'Migration validation successful';
END $$;

-- ============================================================
-- STEP 7: Create function to calculate referral points by level
-- ============================================================

CREATE OR REPLACE FUNCTION get_referral_points(level INTEGER)
RETURNS DECIMAL(10,3) AS $$
BEGIN
  RETURN CASE level
    WHEN 1 THEN 21.000   -- Direct referral
    WHEN 2 THEN 10.500   -- 2nd degree (50% halving)
    WHEN 3 THEN 5.250    -- 3rd degree (50% halving)
    WHEN 4 THEN 2.250    -- 4th degree (custom)
    WHEN 5 THEN 1.125    -- 5th degree (50% halving)
    ELSE 0.000           -- Beyond 5 levels, no points
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_referral_points IS 'Returns the points awarded for a referral at the given level (Bitcoin-style halving)';

-- ============================================================
-- STEP 8: Statistics
-- ============================================================

-- Show migration summary
DO $$
DECLARE
  total_referrals INTEGER;
  total_users INTEGER;
  total_points_history INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_referrals FROM referrals;
  SELECT COUNT(*) INTO total_users FROM users;
  SELECT COUNT(*) INTO total_points_history FROM allocation_points_history;

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Multi-Level Referral Migration Complete';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Total referrals migrated: %', total_referrals;
  RAISE NOTICE 'Total users updated: %', total_users;
  RAISE NOTICE 'Total points history records: %', total_points_history;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  - 5-level referral chain tracking';
  RAISE NOTICE '  - Decimal point support';
  RAISE NOTICE '  - Bitcoin-style halving points:';
  RAISE NOTICE '    Level 1: 21.000 points';
  RAISE NOTICE '    Level 2: 10.500 points';
  RAISE NOTICE '    Level 3:  5.250 points';
  RAISE NOTICE '    Level 4:  2.250 points';
  RAISE NOTICE '    Level 5:  1.125 points';
  RAISE NOTICE '==============================================';
END $$;
