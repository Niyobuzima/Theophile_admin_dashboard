#!/bin/sh
set -e

# Colors for logs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo "${GREEN}[backend-entrypoint]${NC} $1"; }
warn() { echo "${YELLOW}[backend-entrypoint]${NC} $1"; }
err() { echo "${RED}[backend-entrypoint]${NC} $1"; }

# 1. Generate RSA keys if missing
if [ ! -f "${PRIVATE_KEY_PATH}" ] || [ ! -f "${PUBLIC_KEY_PATH}" ]; then
  warn "Keys not found, generating..."
  if npm run generate:keys; then
    log "Keys generated."
  else
    err "Key generation failed (continuing)."
  fi
else
  log "Keys already present."
fi

# 2. Proto build (idempotent)
if npm run build:proto; then
  log "Protobuf generated."
else
  warn "Protobuf generation failed (continuing)."
fi

# 3. Prisma migrate & generate
if [ -n "${DATABASE_URL}" ]; then
  log "Applying migrations..."
  if npx prisma migrate deploy; then
    log "Migrations applied."
  else
    warn "migrate deploy failed, attempting db push..."
    npx prisma db push || warn "db push also failed."
  fi
  npx prisma generate || warn "Prisma generate failed."
else
  warn "DATABASE_URL not set; skipping prisma setup."
fi

# 4. Start application (dev watch mode by default)
log "Starting NestJS server..."
exec npm run start:dev
