FROM node:20-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Generate protobuf artifacts (idempotent)
RUN npm run build:proto || echo "Proto build failed (continuing)"

EXPOSE 4000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
