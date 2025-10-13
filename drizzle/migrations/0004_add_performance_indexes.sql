-- Migration: Add performance indexes for duplicate detection and queries
-- Critical for production performance and security

-- Index for phone number lookups (duplicate detection)
CREATE INDEX IF NOT EXISTS idx_survey_phone
ON survey_responses(phone)
WHERE is_admin_submission = false;

-- Index for IP address lookups (duplicate detection)
CREATE INDEX IF NOT EXISTS idx_survey_ip
ON survey_responses(ip_address)
WHERE is_admin_submission = false;

-- Composite index for timestamp-based queries (analytics, recent submissions)
CREATE INDEX IF NOT EXISTS idx_survey_timestamp
ON survey_responses(timestamp DESC);

-- Composite index for region analytics
CREATE INDEX IF NOT EXISTS idx_survey_region_timestamp
ON survey_responses(region, timestamp DESC);

-- Index for admin submission queries
CREATE INDEX IF NOT EXISTS idx_survey_admin_submitted
ON survey_responses(submitted_by, timestamp DESC)
WHERE is_admin_submission = true;

-- Partial unique index to prevent duplicate phone submissions (non-admin only)
-- Note: This is informational - actual enforcement is in application layer
-- because we want better error messages
CREATE INDEX IF NOT EXISTS idx_survey_phone_unique
ON survey_responses(phone)
WHERE is_admin_submission = false;

-- Comments for documentation
COMMENT ON INDEX idx_survey_phone IS 'Fast lookup for phone number duplicate detection (non-admin submissions only)';
COMMENT ON INDEX idx_survey_ip IS 'Fast lookup for IP address duplicate detection (non-admin submissions only)';
COMMENT ON INDEX idx_survey_timestamp IS 'Optimize queries sorted by submission time';
COMMENT ON INDEX idx_survey_region_timestamp IS 'Optimize region-based analytics queries';
