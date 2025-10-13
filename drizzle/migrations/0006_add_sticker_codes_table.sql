-- Migration: Add sticker_codes table for referral campaigns
-- Date: 2025-10-11

-- Create sticker_codes table
CREATE TABLE IF NOT EXISTS sticker_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  claimed BOOLEAN DEFAULT FALSE NOT NULL,
  claimed_by UUID REFERENCES users(id),
  claimed_by_survey UUID REFERENCES survey_responses(id),
  claimed_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0 NOT NULL,
  batch_id VARCHAR(50),
  notes TEXT,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS sticker_codes_code_idx ON sticker_codes(code);
CREATE INDEX IF NOT EXISTS sticker_codes_claimed_idx ON sticker_codes(claimed);
CREATE INDEX IF NOT EXISTS sticker_codes_claimed_by_idx ON sticker_codes(claimed_by);
CREATE INDEX IF NOT EXISTS sticker_codes_batch_id_idx ON sticker_codes(batch_id);
CREATE INDEX IF NOT EXISTS sticker_codes_active_idx ON sticker_codes(active);

-- Add comments
COMMENT ON TABLE sticker_codes IS 'Pre-generated codes for sticker referral campaigns';
COMMENT ON COLUMN sticker_codes.code IS 'Unique code printed on physical stickers';
COMMENT ON COLUMN sticker_codes.claimed IS 'Whether this code has been claimed by first user';
COMMENT ON COLUMN sticker_codes.claimed_by IS 'User who first used this sticker code';
COMMENT ON COLUMN sticker_codes.claimed_by_survey IS 'Survey submission that claimed this code';
COMMENT ON COLUMN sticker_codes.usage_count IS 'Number of times this code was used as referral after being claimed';
COMMENT ON COLUMN sticker_codes.batch_id IS 'Identifier for grouping bulk-generated codes';
