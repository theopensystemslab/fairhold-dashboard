#!/bin/bash

set -e

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_DATABASE" ]; then
    echo "Error: Required environment variables are missing"
    echo "Please ensure POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DATABASE are set in your .env file"
    exit 1
fi

echo "Starting backup of database: $POSTGRES_DATABASE"

PGPASSWORD="$POSTGRES_PASSWORD" PGSSLMODE=require pg_dump \
    -h "$POSTGRES_HOST" \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DATABASE" \
    -F c -b -v -w \
    -f "$(date +%F)_backup.dump"

echo "Backup completed successfully"