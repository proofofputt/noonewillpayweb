#!/bin/bash

# Migrate Production Database
# Usage: ./scripts/migrate-production.sh

echo "================================"
echo "Production Database Migration"
echo "================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable not set"
  echo ""
  echo "Set it with:"
  echo "  export DATABASE_URL='your-neon-db-connection-string'"
  echo ""
  exit 1
fi

# Show database host (without credentials)
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^\/]*\).*/\1/p')
echo "Target database: $DB_HOST"
echo ""

# Confirm
read -p "Are you sure you want to migrate PRODUCTION database? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Migration cancelled"
  exit 0
fi

echo ""
echo "Running migrations..."
npm run db:push

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ Migration successful!"
else
  echo ""
  echo "✗ Migration failed"
  exit 1
fi
