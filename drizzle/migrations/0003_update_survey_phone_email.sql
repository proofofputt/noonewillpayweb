-- Migration: Update survey_responses schema
-- Make phone required and email optional

-- First, let's handle existing data
-- Set a default phone for any existing records that don't have one
UPDATE survey_responses
SET phone = '0000000000'
WHERE phone IS NULL;

-- Now alter the columns
ALTER TABLE survey_responses
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN survey_responses.phone IS 'Required: Phone number used for region detection via area code';
COMMENT ON COLUMN survey_responses.email IS 'Optional: Email address for contact';
COMMENT ON COLUMN survey_responses.region IS 'Auto-detected from phone area code: DC, MD, VA, or OTHER';
