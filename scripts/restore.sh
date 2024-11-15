#!/bin/bash
set -e

BACKUP_DIR="/backups"

# Get the latest backup file
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No backup files found in $BACKUP_DIR"
    exit 1
fi

echo "Dropping and recreating the local  database: $POSTGRES_DATABASE"
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h postgres -U "${POSTGRES_USER}" -c "DROP DATABASE IF EXISTS ${POSTGRES_DATABASE};"
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h postgres -U "${POSTGRES_USER}" -c "CREATE DATABASE ${POSTGRES_DATABASE};"

echo "Restoring from: $LATEST_BACKUP"
PGPASSWORD="${POSTGRES_PASSWORD}" psql -h postgres -U "${POSTGRES_USER}" -d "${POSTGRES_DATABASE}" < "$LATEST_BACKUP"
echo "Local database restored successfully"