#!/bin/bash

# OwnCent Production Start Script
# Ensures the application starts with proper configuration

set -e

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with required environment variables."
    exit 1
fi

# Check if dist directory exists
if [ ! -d dist ]; then
    echo "Error: dist directory not found!"
    echo "Please run 'npm run build' first."
    exit 1
fi

# Check if dist-server directory exists
if [ ! -d dist-server ]; then
    echo "Error: dist-server directory not found!"
    echo "Please run 'npm run build' first."
    exit 1
fi

# Load environment variables
source .env

# Verify required environment variables
required_vars=("DB_HOST" "DB_USER" "DB_PASSWORD" "DB_DATABASE" "JWT_ACCESS_SECRET" "JWT_REFRESH_SECRET")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: Required environment variable $var is not set!"
        exit 1
    fi
done

echo "Starting OwnCent Server..."
echo "Environment: ${NODE_ENV:-production}"
echo "Port: ${PORT:-3000}"
echo "Database: $DB_HOST:${DB_PORT:-3306}/$DB_DATABASE"

# Start the server
exec node dist-server/index.js
