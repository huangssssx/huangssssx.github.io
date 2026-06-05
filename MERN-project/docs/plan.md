# Deployment Plan — MERN Admin Dashboard Demo

## Goal
Build a MERN (MongoDB + Express + React + Node.js) admin dashboard demo with user authentication and CRUD operations. Deploy the **entire stack** (frontend + backend + database) via a single live URL to showcase full-stack capability for Upwork portfolio.

This demo targets a real Upwork job posting: "MERN Stack Developer Needed for React.js & Node.js Web Application Updates" — demonstrating readiness for exactly this type of work.

## Why Not GitHub Pages?
GitHub Pages only supports static files. A MERN stack needs a Node.js runtime and a database, which Pages cannot provide. We need a platform that supports:
- Static frontend hosting
- Serverless or long-running Node.js functions
- Free tier (for portfolio purposes)

## Chosen Solution: Vercel + MongoDB Atlas

### Architecture

```
┌─────────────────────────────────────────────────┐
│                    User Browser                 │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   Vercel (Single Domain)     │
        │                              │
        │  /           → React SPA     │
        │  /api/*      → Serverless    │
        │               Functions      │
        │               (Node.js)      │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │   MongoDB Atlas (Free Tier)  │
        │   M0 Sandbox Cluster         │
        └──────────────────────────────┘
```

A single Vercel project serves both the React frontend and the Express API. The API runs as Vercel Serverless Functions under `/api/*`. The database lives on MongoDB Atlas free tier.

## Demo Feature Scope

### What We're Building
A small **admin dashboard** with authentication — the exact type of project the Upwork client likely needs maintained. This hits two birds with one stone: proves MERN competency and shows understanding of real-world admin panel patterns.

### Features

#### 1. Authentication
- **Register** — email + password (bcrypt hashed)
- **Login** — JWT token, stored in httpOnly cookie
- **Logout** — clear token
- **Protected routes** — redirect to login if unauthenticated
- **Auth context** — React Context for user state

#### 2. Dashboard Home
- Summary stats cards (total items, recent activity)
- Simple overview layout

#### 3. Items Management (Full CRUD)
- **List view** — paginated table with search and status filter
- **Create** — modal form with client-side + server-side validation
- **Edit** — pre-filled form, inline or modal
- **Delete** — confirmation dialog
- **Detail view** — single item page with all fields

#### 4. UI/UX Essentials
- Responsive layout (desktop-first, mobile usable)
- Loading spinners during API calls
- Error banners for failed requests
- Empty state illustrations
- Success/error toast notifications

### Why This Scope?
- **Auth** — almost every admin panel needs it; shows you understand security basics
- **CRUD table** — the most common pattern in business tools; proves full-stack data flow
- **Validation** — client + server side; shows attention to edge cases
- **Loading/error states** — separates "works on my machine" from production quality

## Project Structure

```
MERN-project/
├── client/                      # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Sidebar + header shell
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Items.tsx        # List + CRUD
│   │   │   └── ItemDetail.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts           # Axios instance with interceptors
│   │   │   ├── auth.ts          # Login/register/logout calls
│   │   │   └── items.ts         # CRUD API calls
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── api/                         # Vercel Serverless Functions
│   ├── _lib/
│   │   ├── db.ts                # MongoDB connection (global cache)
│   │   ├── auth.ts              # JWT verify middleware
│   │   └── models/
│   │       ├── User.ts          # User schema (email, password hash)
│   │       └── Item.ts          # Item schema (title, desc, status, owner)
│   ├── auth/
│   │   ├── register.ts          # POST /api/auth/register
│   │   └── login.ts             # POST /api/auth/login
│   ├── items/
│   │   ├── index.ts             # GET /api/items, POST /api/items
│   │   └── [id].ts              # GET/PUT/DELETE /api/items/:id
│   └── package.json
│
├── vercel.json
├── .env.example
├── .gitignore
├── README.md
└── docs/
    ├── requirements.md
    └── plan.md
```

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Fast dev, modern stack |
| UI | Tailwind CSS | Quick styling, no bloat |
| HTTP Client | Axios | Interceptors for auth tokens |
| Backend | Node.js + Express (adapted for serverless) | Familiar MERN pattern |
| Serverless | Vercel Functions | Free, zero config |
| Database | MongoDB Atlas (M0) | Free 512MB, persistent |
| ODM | Mongoose | Standard MERN choice |
| Auth | JWT + bcrypt | Industry standard, simple |
| Deployment | Vercel | Free, supports full stack |

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account (email + password) |
| POST | `/api/auth/login` | No | Login, return JWT in httpOnly cookie |
| POST | `/api/auth/logout` | No | Clear cookie |
| GET | `/api/items` | Yes | List items (paginated, filterable) |
| POST | `/api/items` | Yes | Create new item |
| GET | `/api/items/:id` | Yes | Get single item |
| PUT | `/api/items/:id` | Yes | Update item |
| DELETE | `/api/items/:id` | Yes | Delete item |

## Data Models

### User
```
{
  email: string (unique, required),
  password: string (bcrypt hash, required),
  name: string (required),
  createdAt: Date
}
```

### Item
```
{
  title: string (required),
  description: string,
  status: enum ["active", "archived", "draft"],
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Implementation Steps

### Phase 1: Backend API
1. Initialize `api/` with package.json and dependencies (express, mongoose, bcryptjs, jsonwebtoken)
2. Create `_lib/db.ts` — MongoDB connection with global cache pattern
3. Create `_lib/models/User.ts` — schema + password hash middleware
4. Create `_lib/models/Item.ts` — schema with owner reference
5. Create `_lib/auth.ts` — JWT verify middleware for protected routes
6. Implement `auth/register.ts` — validate input, hash password, create user, return token
7. Implement `auth/login.ts` — validate credentials, return httpOnly cookie
8. Implement `items/index.ts` — GET (paginated) + POST (with owner)
9. Implement `items/[id].ts` — GET + PUT + DELETE (owner check)
10. Test locally with `vercel dev`

### Phase 2: Frontend UI
1. Initialize Vite + React + TypeScript in `client/`
2. Add Tailwind CSS
3. Create TypeScript types in `types/index.ts`
4. Set up Axios instance with auth interceptor in `services/api.ts`
5. Build auth service (`services/auth.ts`)
6. Build items service (`services/items.ts`)
7. Create AuthContext (`context/AuthContext.tsx`) — login, register, logout, user state
8. Build layout components: Layout shell, ProtectedRoute, Toast
9. Build pages: Login, Register, Dashboard, Items (list), ItemDetail
10. Add form validation, loading states, error handling
11. Test full flow end-to-end locally

### Phase 3: Deployment (GitHub → Vercel Auto Sync)
1. Create MongoDB Atlas account → M0 free cluster
2. Whitelist `0.0.0.0/0` (Vercel functions have dynamic IPs)
3. Create database user, save connection string
4. Push code to GitHub repository
5. In Vercel Dashboard → "Import Project" → "Continue with GitHub"
6. Authorize Vercel to access the GitHub repo, select `MERN-project`
7. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
8. Deploy and verify live URL
9. Seed some demo data (optional)

**Auto-deploy:** Once connected, every `git push` to the main branch triggers an automatic rebuild and deploy on Vercel (typically under 60 seconds). PR branches generate preview URLs for review before merging.

### Phase 4: Documentation
1. Write `README.md` with:
   - Project overview and live URL
   - Local setup instructions
   - API endpoint documentation
   - Screenshots of key pages
2. Update Upwork portfolio with live URL

## Environment Variables

```
# .env.example
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=<random-32-char-string>
```

## Cost Analysis

| Service | Tier | Cost |
|---|---|---|
| Vercel | Hobby (personal) | $0 |
| MongoDB Atlas | M0 Sandbox | $0 |
| **Total** | | **$0** |

## Vercel Configuration

`vercel.json`:
```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/client/dist/$1" }
  ]
}
```

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| MongoDB Atlas IP whitelist blocks Vercel | Use `0.0.0.0/0` (serverless has dynamic IPs) |
| Serverless cold start latency | Cache MongoDB connection globally; acceptable for demo |
| Mongoose connection exhaustion | Use global cache pattern (standard serverless fix) |
| JWT in cookie vs localStorage | Use httpOnly cookie for security; CSRF not a concern for API-only |
| Atlas M0 pauses after inactivity | Free tier, resumes on next query (few seconds delay) |

## Success Criteria

- [ ] User can register and login
- [ ] Unauthenticated users redirected to login page
- [ ] Authenticated users see dashboard with stats
- [ ] Full CRUD on items (create, read, update, delete)
- [ ] Pagination and search work on item list
- [ ] Form validation on both client and server
- [ ] Loading, error, and empty states on all pages
- [ ] Responsive on mobile and desktop
- [ ] Live URL accessible without local setup
- [ ] README has clear setup + deployment instructions
- [ ] No secrets committed to Git

## Timeline

- Phase 1 (Backend API): 1 day
- Phase 2 (Frontend UI): 1-2 days
- Phase 3 (Deployment): 2 hours
- Phase 4 (Documentation): 1 hour

## Why This Demo Wins the Job

1. **Exact match** — the Upwork job asks for MERN stack, this IS MERN stack
2. **Live and clickable** — client doesn't need to clone anything to see it works
3. **Real auth** — not a toy; shows production-level thinking
4. **Full data flow** — form → API → database → back to UI, complete loop
5. **Maintainable code** — TypeScript, clear structure, easy to extend
6. **Shows readiness** — "Here's what I can build, imagine what I can maintain"
