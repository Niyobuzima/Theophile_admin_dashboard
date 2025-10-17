# ADMIN Dashboard (Condensed Guide)

Minimal secure admin panel: NestJS + Prisma (SQLite) backend, React + Radix/ui frontend, RSA-PSS signatures, SHA-384 hashing, protobuf export.

## 1. Quick Start (Local Dev)
```bash
git clone https://github.com/Niyobuzima/Theophile_admin_dashboard.git
cd Theophile_admin_dashboard

# Backend
cd backend
npm install
cp .env.example .env
npm run generate:keys       
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev        

# Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env.local
npm run dev          
```

## 2. Essential Env (`backend/.env`)
```env
DATABASE_URL="file:./dev.db"
PRIVATE_KEY_PATH=./keys/private.pem
PUBLIC_KEY_PATH=./keys/public.pem
PORT=3001
FRONTEND_URL=http://localhost:4000
NODE_ENV=development
```
Never commit `keys/` or private keys.

## 3. Core Commands
```bash
# Migrations
npx prisma migrate dev

# Regenerate Prisma client
npx prisma generate

```

## 4. Basic API Usage
```bash
# Create user
curl -X POST http://localhost:3001/users -H 'Content-Type: application/json' -d '{"email":"admin@example.com"}'

# List users
curl http://localhost:3001/users

# Export protobuf
curl http://localhost:3001/users/export --output users.bin

# Get public key
curl http://localhost:3001/keys/public
```
Swagger docs: http://localhost:3001/api-docs

## 5. Docker (Dev)
```bash
# From repo root
docker-compose up --build
docker-compose logs -f backend
```
Stop: `docker-compose down` • Clean slate: `docker-compose down -v`

## 6. Security Basics
- SHA-384 hashes email, RSA-PSS signs hash
- Public key exposed via `/keys/public`
- Helmet + rate limiting + sanitization enabled
- Keep `keys/` out of git

## 7. Protobuf Decode (Node)
```javascript
const protobuf = require('protobufjs');
const fs = require('fs');
async function run(){
  const root = await protobuf.load('proto/user.proto');
  const UserList = root.lookupType('user.UserList');
  const buf = fs.readFileSync('users.bin');
  console.log(UserList.decode(buf));
}
run();
```

## 8. Troubleshooting (Fast)
- Missing keys → `npm run generate:keys`
- Missing Prisma client → `npx prisma generate`
- DB schema empty → `npx prisma migrate dev`
- CORS issue → check `FRONTEND_URL` in `.env`
- Port clash → change `PORT` in `.env`

## 9. Next Steps / Production
- Swap SQLite → PostgreSQL (`provider = "postgresql"`)
- Regenerate fresh production RSA keys
- Set `NODE_ENV=production`
- Add auth (JWT) + RBAC
- Use secrets manager + HTTPS


