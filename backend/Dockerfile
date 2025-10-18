FROM node:20-alpine3.20 AS base
WORKDIR /app
RUN apk add --no-cache bash curl dos2unix openssl

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/prisma /app/keys && chmod -R 777 /app/prisma /app/keys && \
    dos2unix /app/entrypoint.sh 2>/dev/null || true && chmod +x /app/entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/app/entrypoint.sh"]

