#!/bin/sh
set -e

echo "[entrypoint] Starting backend setup..."

# 0. Setup .env file if missing
if [ ! -f "/app/.env" ] && [ -f "/app/.env.example" ]; then
  echo "[entrypoint] Copying .env.example to .env..."
  cp /app/.env.example /app/.env || echo "[entrypoint] Failed to copy .env.example, continuing..."
fi

# 1. Generate keys if missing
if [ ! -f "${PRIVATE_KEY_PATH:-/app/keys/private.pem}" ]; then
  echo "[entrypoint] Generating RSA keys..."
  npm run generate:keys || echo "[entrypoint] Key generation failed, continuing..."
fi

# 2. Build protobuf
echo "[entrypoint] Building protobuf..."
# Check if proto file exists in mounted location or parent directory
if [ -f "/app/proto/user.proto" ]; then
  echo "[entrypoint] Using proto from /app/proto..."
  pbjs -t static-module -w commonjs -o src/generated/user_pb.js /app/proto/user.proto && \
  pbts -o src/generated/user_pb.d.ts src/generated/user_pb.js || echo "[entrypoint] Proto build failed, continuing..."
elif [ -f "../proto/user.proto" ]; then
  echo "[entrypoint] Using proto from ../proto..."
  npm run build:proto || echo "[entrypoint] Proto build failed, continuing..."
else
  echo "[entrypoint] Proto file not found, skipping..."
fi

# 3. Setup database and run migrations
if [ -n "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] Setting up database..."
  
  # Ensure the database directory exists
  mkdir -p /app/prisma/db
  
  # Generate Prisma client first
  echo "[entrypoint] Generating Prisma client..."
  npx prisma generate || echo "[entrypoint] Prisma generate failed, continuing..."
  
  # Run database setup for development
  echo "[entrypoint] Running database setup..."
  npx prisma db push || echo "[entrypoint] DB push failed, continuing..."
  
  echo "[entrypoint] Database setup completed."
fi

echo "[entrypoint] Starting server..."
exec npm run start:dev
