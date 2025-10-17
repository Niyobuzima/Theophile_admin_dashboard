FROM node:20-alpine3.20 AS base
WORKDIR /app
RUN apk add --no-cache curl openssl

FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/prisma && chmod -R 777 /app/prisma && \
    npx prisma generate || true && \
    mkdir -p keys

EXPOSE 3001
CMD ["npm", "run", "start:dev"]

