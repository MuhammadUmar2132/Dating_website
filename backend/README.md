# Bea Backend — Express.js + PostgreSQL

Complete REST API backend for the Bea platform.

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT + Magic Links + bcrypt
- **Email**: Nodemailer
- **Payments**: Stripe
- **Validation**: Zod

## Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

Create a database:
```sql
CREATE DATABASE bea_db;
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and update `DATABASE_URL` with your PostgreSQL credentials.

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Server runs at: **http://localhost:4000**

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Email + password login |
| POST | `/api/auth/magic-link/request` | Request magic link |
| GET | `/api/auth/magic-link/verify?token=` | Verify magic link |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/waitlist/join` | Join waitlist |
| GET | `/api/schools?search=` | Search schools |
| GET | `/api/schools/markets` | List markets |
| GET | `/health` | Health check |

### Authenticated (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| GET | `/api/waitlist/status` | Waitlist status |
| GET | `/api/waitlist/dashboard` | Waitlist dashboard |
| POST | `/api/onboarding/complete` | Complete onboarding |
| GET | `/api/leaderboard?scope=national` | View leaderboard |
| GET | `/api/leaderboard/me` | My leaderboard data |
| GET | `/api/rewards/progress` | Rewards progress |
| POST | `/api/rewards/:id/redeem` | Redeem reward |
| GET | `/api/rewards/points-history` | Points history |
| GET | `/api/shop/products` | Shop products |
| POST | `/api/shop/checkout` | Create order |

### Ambassador
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ambassador/dashboard` | Ambassador dashboard |
| GET | `/api/ambassador/network` | Referral network |
| GET | `/api/ambassador/leaderboard` | Ambassador leaderboard |
| GET | `/api/ambassador/prizes` | Ambassador prizes |
| GET | `/api/ambassador/calendar` | Calendar events |
| POST | `/api/ambassador/invite` | Send invite |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Platform analytics |
| GET/PATCH/DELETE | `/api/admin/users/:id` | User management |
| GET/POST/PATCH/DELETE | `/api/admin/schools` | School management |
| GET/POST/PATCH/DELETE | `/api/admin/markets` | Market management |
| GET/POST/PATCH/DELETE | `/api/admin/competitions` | Competition management |
| GET/POST/PATCH/DELETE | `/api/admin/rewards` | Reward management |
| GET/PATCH | `/api/admin/reward-redemptions` | Redemption management |
| GET/PATCH | `/api/admin/orders` | Order management |

---

## Default Admin Credentials
- **Email**: admin@beaapp.com
- **Password**: Admin@123456

> ⚠️ Change these in production!

---

## Database Commands
```bash
npm run prisma:studio     # Open DB browser at localhost:5555
npm run prisma:migrate    # Run new migrations
npm run prisma:reset      # Reset database (WARNING: deletes all data)
npm run prisma:seed       # Re-seed initial data
```
