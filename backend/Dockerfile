FROM node:20-alpine3.20 AS base
WORKDIR /app
RUN apk add --no-cache curl openssl bash

# Install dependencies (dev for watch & tooling)
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .

# Prepare writable directories (prisma, keys)
RUN mkdir -p /app/prisma /app/keys && chmod -R 777 /app/prisma /app/keys

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

