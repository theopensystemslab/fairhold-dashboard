#!/bin/bash
set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Use the production Postgres URL for backup
if [ -z "$POSTGRES_URL" ]; then
    echo "Error: POSTGRES_URL environment variable is not set"
    echo "Set this in your .env.production file"
    exit 1
fi

echo "Creating backup of production database..."
pg_dump --no-owner "$POSTGRES_URL" > "$BACKUP_FILE"
echo "Backup created at: $BACKUP_FILE"