-- Migration: Add referral tracking to survey_responses table
-- Date: 2025-10-10

-- Add referral code columns to survey_responses
ALTER TABLE survey_responses
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) NOT NULL DEFAULT 'TEMP-0000',
  ADD COLUMN IF NOT EXISTS referred_by VARCHAR(20);

-- Create unique index on referral_code
CREATE UNIQUE INDEX IF NOT EXISTS survey_responses_referral_code_idx
  ON survey_responses(referral_code);

-- Create index on referred_by for faster lookups
CREATE INDEX IF NOT EXISTS survey_responses_referred_by_idx
  ON survey_responses(referred_by);

-- Remove default after adding column (to enforce uniqueness going forward)
ALTER TABLE survey_responses
  ALTER COLUMN referral_code DROP DEFAULT;

-- Update existing records with unique referral codes if any exist
-- This will be handled by the application on first access
DO $$
DECLARE
  rec RECORD;
  new_code VARCHAR(20);
BEGIN
  FOR rec IN
    SELECT id FROM survey_responses WHERE referral_code = 'TEMP-0000'
  LOOP
    -- Generate a simple unique code for existing records
    new_code := 'MIG-' || SUBSTRING(MD5(rec.id::TEXT), 1, 8);
    UPDATE survey_responses
      SET referral_code = new_code
      WHERE id = rec.id;
  END LOOP;
END $$;

-- Add comment explaining the fields
COMMENT ON COLUMN survey_responses.referral_code IS 'Unique referral code generated for this user to share with others';
COMMENT ON COLUMN survey_responses.referred_by IS 'Referral code of the user who referred this signup';
