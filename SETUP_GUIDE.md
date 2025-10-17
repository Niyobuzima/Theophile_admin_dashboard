# Setup Guide

## Project Structure

```
Theophile_admin_dashboard/
├── backend/              ✅ NestJS + Prisma + SQLite
├── frontend/             ✅ React 19 + Next.js + Tailwind
├── proto/                ✅ .proto files schema
├── .github/workflows/    ✅ CI/CD pipelines
├── docker-compose.yml    ✅ Docker configuration
├── README.md             ✅ Complete documentation
├── SECURITY.md           ✅ Security documentation
```

## Quick Start (5 minutes)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Generate RSA keys
npm run generate:keys
```

### Step 3: Setup Database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Step 4: Start Backend

```bash
npm run start:dev
```

Backend will be running on **http://localhost:3001**

### Step 5: Install Frontend Dependencies (New Terminal)

```bash
cd frontend
npm install
```

### Step 6: Setup Frontend Environment

```bash
# Copy environment template
cp .env.example .env.local
```

### Step 7: Start Frontend

```bash
npm run build:proto #Compile proto file to use on the frontend
npm run dev
```

Frontend will be running on **http://localhost:3000**

---

## Testing the Application

### Create a Test User

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "role": "admin", "status": "active"}'
```

### Verify Protobuf Export

```bash
curl http://localhost:3001/users/export --output users.bin
```

### Check Public Key

```bash
curl http://localhost:3001/keys/public
```

### View Analytics

```bash
curl http://localhost:3001/users/analytics/daily
```

---

## Alternative: Using Docker

### Start Everything with Docker

```bash
# From project root
docker-compose up --build
```

This will:
- Build and start backend on port 3001
- Build and start frontend on port 3000
- Set up networking between containers

---

## Next Steps

1. **Test the Application**
   - Create users via API
   - Verify signature verification works
   - Check analytics chart

2. **Add Sample Data** (Optional)
   ```bash
   cd backend
   # Create multiple users to see chart data
   for i in {1..10}; do
     curl -X POST http://localhost:3001/users \
       -H "Content-Type: application/json" \
       -d "{\"email\": \"user$i@example.com\", \"role\": \"user\", \"status\": \"active\"}"
   done
   ```

3. **Generate Protobuf Files** (if needed)
   ```bash
   # Backend
   cd backend
   npx pbjs -t static-module -w commonjs -o src/proto/user.js proto/user.proto
   npx pbts -o src/proto/user.d.ts src/proto/user.js

   # Frontend
   cd frontend
   npx pbjs -t static-module -w commonjs -o src/proto/user.js src/proto/user.proto
   npx pbts -o src/proto/user.d.ts src/proto/user.js
   ```

4. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "feat: initial project setup"
   ```

5. **Create GitHub Repository**
   - Create a new repo on GitHub
   - Push your code:
     ```bash
     git remote add origin <your-repo-url>
     git branch -M main
     git push -u origin main
     ```
---

## Troubleshooting

### Issue: "Cannot find module '@nestjs/core'"
```bash
cd backend && npm install
```

### Issue: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### Issue: "Port 3001 already in use"
```bash
# Kill the process
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
PORT=3002
```

### Issue: "Keys not found"
```bash
cd backend
npm run generate:keys
```

---

## Key Files to Review

1. **Backend Entry Point**: `backend/src/main.ts`
2. **Users Service**: `backend/src/users/users.service.ts`
3. **Crypto Service**: `backend/src/crypto/crypto.service.ts`
4. **Frontend Components**: `frontend/src/components/`
5. **API Client**: `frontend/src/lib/api.ts`
6. **Crypto Utils**: `frontend/src/lib/crypto.ts`

---

## Important Notes

⚠️ **Never Commit**:
- Private keys (`backend/keys/private.pem`)
- `.env` files
- `node_modules/`
- Database files (`*.db`)

✅ **Include in Repository**:
- All source code
- Configuration files
- README.md
- SECURITY.md
- PROJECT_ASSUMPTIONS.md
- package.json files
- Dockerfile and docker-compose.yml

---

## Support

If you encounter issues:
1. Check the troubleshooting section in README.md
2. Review SECURITY.md for security-related questions

---
