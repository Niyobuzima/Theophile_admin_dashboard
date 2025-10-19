FROM node:20-alpine3.20 AS base
WORKDIR /app
RUN apk add --no-cache curl openssl

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .

# Generate Prisma client and setup directories during build
RUN npx prisma generate && \
    mkdir -p /app/prisma /app/keys && \
    chmod -R 777 /app/prisma /app/keys && \
    chmod +x /app/entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["sh", "/app/entrypoint.sh"]

