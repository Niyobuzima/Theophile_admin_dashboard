#!/bin/sh
set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
log() { echo "${GREEN}[frontend-entrypoint]${NC} $1"; }
warn() { echo "${YELLOW}[frontend-entrypoint]${NC} $1"; }

log "Ensuring protobuf artifacts..."
if npm run build:proto; then
  log "Protobuf generated."
else
  warn "Protobuf generation failed (continuing)."
fi

log "Starting Vite dev server..."
exec npm run dev -- --host 0.0.0.0
