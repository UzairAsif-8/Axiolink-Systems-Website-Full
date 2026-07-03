# Axiolink Systems — Technical Documentation & Production Readiness Audit

> **Purpose:** This document is a developer-focused technical reference and audit artifact. It is intended for senior engineers and AI reviewers to verify implementation status, Neon PostgreSQL readiness, and gaps before production deployment.
>
> **Accuracy policy:** Features are marked **Completed**, **Partial**, or **Not Implemented** based on what exists in the repository today—not on roadmap intent.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Environment Variables](#environment-variables)
5. [Database Documentation](#database-documentation)
6. [API Documentation](#api-documentation)
7. [Authentication Flow](#authentication-flow)
8. [Dashboard Modules](#dashboard-modules)
9. [Data Flow](#data-flow)
10. [Seed & Demo Data](#seed--demo-data)
11. [File Upload Architecture](#file-upload-architecture)
12. [Security Features](#security-features)
13. [Performance Optimizations](#performance-optimizations)
14. [Setup Guide](#setup-guide)
15. [Deployment Guide](#deployment-guide)
16. [Known Limitations](#known-limitations)
17. [Future Roadmap](#future-roadmap)
18. [Final Verification Checklist](#final-verification-checklist)
19. [AI Technical Review](#ai-technical-review)

---

## Project Overview

### Purpose

**Axiolink Systems Webpage** is a full-stack corporate website and unified admin portal for Axiolink Systems Pvt Ltd. It combines:

- A **public marketing website** (services, about, careers/internships, Buland Parwaz program, blog, contact, certificate verification)
- A **unified admin dashboard** for recruitment, education (Buland Parwaz), content, messaging, and site settings
- A **production-oriented Express + Prisma + PostgreSQL backend** designed for **Neon**, with an optional **JSON demo mode** for local development without a database

### Frontend Architecture

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 18 | SPA with React Router v6 |
| Build | Vite 5 | Dev server on port **3005**, proxies `/api` → backend |
| Styling | Tailwind CSS 3 | Custom design system + admin slate/blue theme |
| State / Data | TanStack React Query v5 | Admin data fetching, cache invalidation |
| Forms | React Hook Form | Admin forms (internships, courses, blogs) |
| HTTP | Axios (admin), fetch (public) | JWT interceptors in admin client |
| Animation | Framer Motion | Public site motion |
| Charts | Recharts | Admin dashboard area chart |

**Route split:**

- `/admin/*` — Protected admin portal (`ProtectedAdmin` + `AuthContext`)
- Public routes — Wrapped in shared `Layout` (navbar, footer)

### Backend Architecture

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Entry | `backend/src/server.js` | HTTP server bootstrap |
| App | `backend/src/app.js` | Middleware, route mounting, **demo vs production switch** |
| Controllers | `backend/src/controllers/` | Thin HTTP handlers |
| Services | `backend/src/services/` | Business logic, demo JSON persistence |
| Routes | `backend/src/routes/` | Express routers |
| Middleware | `backend/src/middleware/` | Auth, roles, upload, errors |
| Validators | `backend/src/validators/` | Zod schemas |
| Config | `backend/src/config/` | `env.js`, Prisma client |

**Critical runtime switch (`USE_DEMO_DATA`):**

```text
USE_DEMO_DATA=true  → Admin + partial public API served from backend/data/demo-data.json
USE_DEMO_DATA=false → Full PostgreSQL-backed REST API via Prisma (Neon-ready)
```

When demo mode is active, most production admin route modules are **not mounted**; a consolidated `demo.routes.js` handler set is used instead.

### Database Architecture

- **ORM:** Prisma 6.x
- **Provider:** PostgreSQL (`provider = "postgresql"`)
- **Target:** Neon (or any PostgreSQL 14+ compatible host)
- **Primary keys:** UUID (`@db.Uuid`) on all major entities
- **Soft deletes:** `deletedAt DateTime?` on most content/HR entities
- **Timestamps:** `createdAt` / `updatedAt` on mutable models
- **Migration:** `backend/prisma/migrations/20250628120000_init/migration.sql`

### Admin Dashboard

Single unified portal at `/admin` with sidebar navigation:

| Section | Modules |
|---------|---------|
| Overview | Dashboard |
| Recruitment | Internships, Applications |
| Education | Courses, Students, Certificates |
| Content | Messages, Blogs |
| System | Settings |

All authenticated admin roles currently share the same panel (`canAccessAdmin` middleware).

### Website CMS (Public)

| Area | Data source (current) | Admin-managed |
|------|----------------------|---------------|
| Internships / Careers | **API** (`/api/internships`) in demo & prod | Yes (admin) |
| Internship applications | **API** multipart submit | Yes |
| Buland Parwaz courses (public listing) | **Static** `src/data/bulandParwazCourses.js` | Partial (admin courses exist; public page not wired to API) |
| Course enrollment form | **API** (`/api/courses/enroll`) — prod only | Yes (students admin) |
| Blog (public `/blog`) | **Static** hardcoded posts in `Blog.jsx` | Partial (admin blogs CRUD in demo/prod admin; public page not API-driven) |
| Contact form | **API** (`/api/contact`) — prod only | Yes (messages admin) |
| Certificate verification | **API** (`/api/certificate/verify/:code`) | Yes |
| Site settings (public) | **API** in demo mode; prod when DB seeded | Yes |
| Newsletter subscribe | **API** — prod only | Backend only (no admin UI) |

### Internship Management

**Admin (demo mode — fully featured UI):**

- CRUD internships, duplicate, publish states
- Per-internship applicant board with pipeline tabs (New → Interview → Rejected)
- **Active Interns** lifecycle (approved → completed → certificate issued)
- **Participants** section with certificate toggle
- Application detail: notes, status history, resume link
- CSV export

**Production DB schema:** `Internship`, `Application`, `ApplicationNote`, `Intern` models exist. Production controllers support basic CRUD/status/notes but **do not persist demo-only lifecycle fields** (`INTERNSHIP_COMPLETED`, `certificateIssued`, etc.)—see [Known Limitations](#known-limitations).

### Employee Management

**Backend (production only):** Full REST API under `/api/admin/employees` and `/api/admin/departments` with document upload endpoint.

**Admin UI:** **Not Implemented** — no Employees or Departments pages in the admin portal.

**Seed:** `prisma/seed/employees.js` exists but is **not invoked** by the active `prisma/seed.js` entrypoint.

### Buland Parwaz Program

Training/education vertical:

- Admin: course CRUD, per-course student board, global students view
- Student lifecycle (demo): **New Enrollments → Active Students → Graduates → Certificate issued**
- Public landing: `/buland-parwaz` (static course catalog)
- Certificate verification page: `/verify-certificate/:code`

### Course Management

- Admin course form: title, description, category, duration, level, price, status, enrollment flags
- Link from courses list to **per-course students** (`/admin/courses/:courseId/students`)
- Demo JSON persistence + production Prisma CRUD

### Student Management

Implemented as **Enrollment** records (not a separate Student admin CRUD UI):

- Pipeline: payment confirmation → activation → progress tracking → completion → certificate
- Detail view: progress %, attendance %, payment status, activity timeline
- Demo supports enrollment status API; production `Enrollment` model lacks `status` / `certificateIssued` columns

### Certificate Management

- Admin list, create, edit, revoke, delete (demo)
- Public verification by code
- Demo: issuing from graduate/participant flow auto-creates certificate record
- Production: `Certificate` model with relations to Student, Course, Enrollment

### Authentication

- JWT access + refresh tokens
- Super Admin via `.env` (not stored in DB)
- DB-backed admin users (production)
- Demo admin users in `demo-data.json` (plaintext passwords — **dev only**)
- Password reset flow (production DB users only)

### File Upload System

- **Implemented:** Local disk via Multer (`backend/uploads/`, served at `/uploads`)
- **Resume upload** on internship application (production route)
- **Cloudinary** package present; `UPLOAD_PROVIDER=cloudinary` env exists but **upload middleware is local-only**
- Employee document upload route exists (production); no admin UI

---

## Tech Stack

### Frontend

| Technology | Version (approx.) | Purpose |
|------------|-------------------|---------|
| React | 18.2 | UI framework |
| Vite | 5.x | Dev server & build |
| React Router | 6.20 | Routing |
| TanStack React Query | 5.x | Server state |
| Tailwind CSS | 3.3 | Styling |
| Axios | 1.18 | Admin HTTP client |
| React Hook Form | 7.80 | Forms |
| Framer Motion | 10.x | Animations |
| Recharts | 3.x | Dashboard charts |
| Lucide React | 0.294 | Icons |
| React Hot Toast | 2.x | Notifications |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ recommended | Runtime |
| Express | 4.21 | HTTP server |
| Prisma | 6.5 | ORM |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT |
| Zod | 3.24 | Validation |
| Multer | 1.4 | File uploads |
| Helmet | 8.x | Security headers |
| express-rate-limit | 7.x | Rate limiting |
| Morgan | 1.x | HTTP logging |
| cookie-parser | 1.x | Cookies (available) |
| Cloudinary SDK | 2.x | **Dependency only — not wired** |

### Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL 14+ | Primary datastore |
| Neon | Recommended hosted provider |
| Prisma Migrate | Schema versioning |

### Authentication

| Mechanism | Details |
|-----------|---------|
| JWT Access Token | `Authorization: Bearer`, default 15m |
| JWT Refresh Token | Stored client-side (`localStorage`); DB persistence for DB users |
| Super Admin | Env credentials, token type `env_super_admin` |
| RBAC | `UserRole` enum + `Permission` / `RolePermission` tables (schema); middleware uses simplified role checks |

### Validation

- **Zod** schemas in `backend/src/validators/schemas.js` and `employee.schemas.js`
- `validate()` helper wraps Zod parse → `ApiError(400)`

### Storage

| Mode | Path / Service |
|------|----------------|
| Local (default) | `backend/uploads/` |
| Cloudinary | Env vars defined; implementation **Partial** |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Frontend lint |
| Prisma Studio | DB GUI (`npm run db:studio`) |
| `concurrently` | `npm run dev:all` (frontend + backend) |
| Node `--watch` | Backend hot reload |

### Deployment

| Target | Notes |
|--------|-------|
| Frontend static | `npm run build` → `dist/` |
| Backend Node | `node backend/src/server.js` |
| Neon PostgreSQL | `DATABASE_URL` with `?sslmode=require` |
| No Docker / CI config | **Not Implemented** in repo |

### Legacy (not primary)

| Path | Notes |
|------|-------|
| `server/` | Older Express + SQLite enrollment server — **superseded by `backend/`** |

---

## Folder Structure

```text
Axiolink Systems Webpage/
├── public/                    # Static assets (favicon, logos)
├── src/                       # React frontend
│   ├── admin/                 # Admin portal (isolated from public site)
│   │   ├── api/               # Axios client + JWT interceptors
│   │   ├── components/        # Admin UI (boards, panels, dialogs)
│   │   ├── constants/         # Application & enrollment status helpers
│   │   ├── context/           # AuthContext (login, tokens, user)
│   │   ├── hooks/             # useAdminData (React Query wrapper)
│   │   ├── layouts/           # AdminLayout (sidebar, header)
│   │   ├── pages/             # Admin route pages
│   │   ├── utils/             # permissions.js (nav config)
│   │   └── AdminRoutes.jsx    # Admin route definitions
│   ├── api/                   # Public fetch clients (internships, contact, enrollment)
│   ├── assets/                # Images, logos
│   ├── components/            # Shared + public UI components
│   │   ├── buland-parwaz/     # Course cards, certificate verification widget
│   │   ├── careers/           # Internship application UI
│   │   └── ui/                # Button, Input, Card, Badge, Modal
│   ├── data/                  # Static fallback data (services, internships, courses)
│   ├── hooks/                 # usePageMeta, etc.
│   ├── pages/                 # Public pages
│   ├── App.jsx                # Root router
│   └── main.jsx               # React entry + providers
├── backend/                   # Primary API server
│   ├── data/
│   │   └── demo-data.json     # Demo mode persistence (git-tracked)
│   ├── prisma/
│   │   ├── schema.prisma      # Full PostgreSQL schema
│   │   ├── migrations/        # SQL migrations
│   │   └── seed/              # Seed modules (reference, education, etc.)
│   ├── scripts/
│   │   ├── hash-password.js   # Generate ADMIN_PASSWORD_HASH
│   │   └── clear-demo-db.js   # Clear DB demo data
│   ├── src/
│   │   ├── config/            # env.js, database.js (Prisma)
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # auth, roles, upload, errorHandler
│   │   ├── routes/            # Express routers + demo.routes.js
│   │   ├── services/          # auth, demo-data, employee, audit, etc.
│   │   ├── utils/             # helpers, validate
│   │   ├── validators/        # Zod schemas
│   │   ├── app.js             # Express app
│   │   └── server.js          # Listen
│   └── uploads/               # Local uploaded files
├── server/                    # Legacy SQLite server (optional)
├── index.html                 # Vite HTML entry
├── vite.config.js             # Port 3005, /api proxy
├── tailwind.config.js
├── package.json               # Frontend root scripts
└── README.md                  # This file
```

### Major folder purposes

| Folder | Purpose |
|--------|---------|
| `src/admin/` | Complete admin SPA module |
| `backend/src/controllers/` | HTTP layer; maps requests to services/Prisma |
| `backend/src/services/demo-data.service.js` | Demo CRUD + JSON file persistence |
| `backend/src/routes/demo.routes.js` | All admin endpoints when `USE_DEMO_DATA=true` |
| `backend/prisma/` | Schema, migrations, seed scripts |
| `backend/data/` | Demo dataset (single JSON file) |

---

## Environment Variables

Copy `backend/.env.example` → `backend/.env`.

| Variable | Required (prod) | Purpose |
|----------|-----------------|---------|
| `NODE_ENV` | Recommended | `development` \| `production` |
| `PORT` | No (default 4000) | Backend HTTP port |
| `USE_DEMO_DATA` | No | `true` = JSON demo mode; **`false` for Neon/production** |
| `DATABASE_URL` | **Yes (prod)** | Neon PostgreSQL connection string (`?sslmode=require`) |
| `JWT_ACCESS_SECRET` | **Yes (prod)** | Signs access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | **Yes (prod)** | Signs refresh tokens (min 32 chars) |
| `JWT_ACCESS_EXPIRES` | No | Default `15m` |
| `JWT_REFRESH_EXPIRES` | No | Default `7d` |
| `ADMIN_EMAIL` | **Yes (prod)** | Super Admin login email (not in DB) |
| `ADMIN_NAME` | No | Super Admin display name |
| `ADMIN_PASSWORD_HASH` | **Yes (prod)** | bcrypt hash for Super Admin password |
| `CLIENT_URL` | **Yes (prod)** | Frontend origin for CORS (e.g. `http://localhost:3005`) |
| `UPLOAD_PROVIDER` | No | `local` (default) or `cloudinary` (not fully implemented) |
| `CLOUDINARY_CLOUD_NAME` | If Cloudinary | Cloudinary account |
| `CLOUDINARY_API_KEY` | If Cloudinary | API key |
| `CLOUDINARY_API_SECRET` | If Cloudinary | API secret |

### Frontend (optional)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Override API base (empty = use Vite proxy in dev) |

### Generate Super Admin password hash

```bash
cd backend
node scripts/hash-password.js "YourSecurePassword"
# Wrap output in single quotes in .env → ADMIN_PASSWORD_HASH='...'
```

### Default demo credentials

| Account | Email | Password | Notes |
|---------|-------|----------|-------|
| Super Admin | `admin@axiolinksystems.com` | `Admin@12345` | From `.env` hash |
| Demo HR | `hr@axiolinksystems.com` | `Demo@12345` | Demo mode only |
| Demo Course Manager | `courses@axiolinksystems.com` | `Demo@12345` | Demo mode only |

---

## Database Documentation

### Prisma setup

```bash
cd backend
npm install          # runs postinstall → prisma generate
npx prisma migrate deploy   # production
npx prisma migrate dev      # development (creates migrations)
npm run seed                # reference data only (see Seed section)
```

### Provider & Neon compatibility

- **Provider:** `postgresql`
- **Neon:** Fully compatible—use pooled or direct connection string with SSL
- **No SQLite** in production schema (legacy `server/` uses SQLite separately)

### Migrations

| Migration | Description |
|-----------|-------------|
| `20250628120000_init` | Initial schema: all models, enums, indexes, FKs |

### Seed scripts

| File | Invoked by `npm run seed`? | Contents |
|------|---------------------------|----------|
| `prisma/seed.js` | **Yes (entrypoint)** | Calls `seedReference()` only if `DATABASE_URL` set |
| `prisma/seed/reference.js` | Yes | Departments, permissions, role mappings, default settings |
| `prisma/seed/education.js` | **No** | Courses, students, enrollments, certificates (orphaned) |
| `prisma/seed/recruitment.js` | **No** | Internships, applications (orphaned) |
| `prisma/seed/employees.js` | **No** | Employees (orphaned) |
| `prisma/seed/content.js` | **No** | Blogs, messages (orphaned) |
| `prisma/seed/system.js` | **No** | Notifications, audit samples (orphaned) |

### Soft delete strategy

Models with `deletedAt` use **soft delete** (query with `deletedAt: null`). Hard delete used in demo JSON mode for some entities.

### UUID & timestamps

- All primary keys: `@id @default(uuid()) @db.Uuid`
- `createdAt DateTime @default(now())`
- `updatedAt DateTime @updatedAt` on mutable entities

### Prisma models (complete list)

| Model | Domain |
|-------|--------|
| `User` | DB admin accounts |
| `RefreshToken` | JWT refresh persistence |
| `PasswordResetToken` | Password reset |
| `Permission` | RBAC permissions |
| `RolePermission` | Role ↔ permission mapping |
| `Department` | Organization departments |
| `Employee` | Staff records |
| `EmployeeDocument` | Employee file attachments |
| `Internship` | Internship listings |
| `Job` | Job listings |
| `Application` | Internship/job applications |
| `ApplicationNote` | Admin notes on applications |
| `Intern` | Active intern records (separate from Application status) |
| `Instructor` | Course instructors |
| `Course` | Buland Parwaz / training courses |
| `Student` | Student profile entity |
| `Enrollment` | Course enrollment records |
| `Certificate` | Issued certificates |
| `TeamMember` | Website team section |
| `Testimonial` | Client testimonials |
| `ContactMessage` | Contact form inbox |
| `NewsletterSubscriber` | Newsletter emails |
| `BlogPost` | Blog CMS |
| `Event` | Events |
| `EventRegistration` | Event sign-ups |
| `GalleryAlbum` | Media gallery |
| `GalleryImage` | Gallery images |
| `SiteSetting` | Key-value site config |
| `Notification` | Admin notifications |
| `AuditLog` | Audit trail |

### Key relationships

```text
Department 1──* Employee
Department 1──* Internship (optional departmentRef)
Internship 1──* Application
Internship 1──* Intern
Application 1──* ApplicationNote
Application 0..1── Intern (via applicationId unique)
Job 1──* Application

Instructor 1──* Course
Course 1──* Enrollment
Course 1──* Certificate
Student 1──* Enrollment
Student 1──* Certificate
Enrollment 1──* Certificate

User 1──* RefreshToken (Cascade delete)
User 1──* ApplicationNote
User 1──* AuditLog
User 1──* Notification

Event 1──* EventRegistration (Cascade)
GalleryAlbum 1──* GalleryImage (Cascade)
Employee 1──* EmployeeDocument (Cascade)
```

### Cascade rules (selected)

| Relation | onDelete |
|----------|----------|
| RefreshToken → User | Cascade |
| ApplicationNote → Application | Cascade |
| EmployeeDocument → Employee | Cascade |
| Enrollment → Course | Cascade |
| EventRegistration → Event | Cascade |
| GalleryImage → GalleryAlbum | Cascade |
| Most optional FKs | SetNull |

### Indexes

Comprehensive indexes on: `email`, `slug`, `status`, `deletedAt`, `createdAt`, foreign keys, `certificateCode`, composite `[userId, isRead]` on notifications.

### Schema ↔ demo feature gaps

The following exist in **demo JSON / admin UI** but are **NOT in Prisma schema**:

| Demo field / status | Entity | Prisma status |
|---------------------|--------|---------------|
| `INTERNSHIP_COMPLETED`, `WITHDRAWN` | Application | **Missing from ApplicationStatus enum** |
| `certificateIssued`, `activeInternAt`, `completedAt` | Application | **No columns** |
| `status` (NEW/ACTIVE/COMPLETED/WITHDRAWN) | Enrollment | **No column** |
| `certificateIssued`, `statusHistory` | Enrollment | **No columns** |
| Application status history | Application | **No statusHistory table** (only notes) |

---

## API Documentation

### Response format

**Success:**

```json
{ "success": true, "message": "optional", "data": { } }
```

**Paginated:**

```json
{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 100, "pages": 5 } }
```

**Error:**

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "..." }] }
```

### Health

| Method | URL | Auth | Purpose |
|--------|-----|------|---------|
| GET | `/api/health` | No | Liveness check |

---

### Authentication (`/api/auth`)

| Method | URL | Auth | Body | Response |
|--------|-----|------|------|----------|
| POST | `/login` | No | `{ email, password, rememberMe? }` | `{ user, accessToken, refreshToken }` |
| POST | `/refresh` | No | `{ refreshToken }` | `{ accessToken }` |
| POST | `/logout` | No | `{ refreshToken? }` | `{ message }` |
| POST | `/forgot-password` | No | `{ email }` | `{ message }` (+ `token` in dev) |
| POST | `/reset-password` | No | `{ token, password }` | `{ message }` |
| GET | `/me` | JWT | — | User object |
| GET | `/admin/users` | Super Admin | — | User list |
| POST | `/admin/users` | Super Admin | `{ email, password, name, role }` | Created user |

**Errors:** `401` invalid credentials, `403` insufficient role, `503` DB unavailable / Super Admin not configured

---

### Demo admin API (`USE_DEMO_DATA=true`) — `/api/admin/*`

All routes require `Authorization: Bearer <JWT>`.

#### Dashboard

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/dashboard/stats` | Aggregated stats + recent items |
| GET | `/dashboard/search?q=` | Global search (internships, applications, courses, messages, blogs) |
| GET | `/dashboard/notifications` | Notification list + unread count |

#### Internships

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/internships` | List (paginated) |
| GET | `/internships/:id` | Get one |
| POST | `/internships` | Create |
| PUT | `/internships/:id` | Update |
| DELETE | `/internships/:id` | Delete |
| POST | `/internships/:id/duplicate` | Duplicate listing |

#### Applications

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/applications` | List (`?status`, `?internshipId`, `?limit`) |
| GET | `/applications/export/csv` | CSV download |
| GET | `/applications/:id` | Detail + notes + statusHistory |
| PATCH | `/applications/:id/status` | `{ status, note? }` |
| PATCH | `/applications/:id/certificate` | `{ issued: true }` — completed interns only |
| POST | `/applications/:id/notes` | `{ content }` |
| DELETE | `/applications/:id` | Remove |

**Application statuses (demo):** `NEW`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED`, `REJECTED`, `INTERNSHIP_COMPLETED`, `WITHDRAWN`

#### Courses & Enrollments (Students)

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/courses` | List courses |
| GET | `/courses/:id` | Get course |
| POST | `/courses` | Create |
| PUT | `/courses/:id` | Update |
| DELETE | `/courses/:id` | Delete |
| GET | `/courses/enrollments/list` | List enrollments (`?courseId`, `?status`) |
| GET | `/courses/enrollments/:id` | Enrollment detail |
| PATCH | `/courses/enrollments/:id` | Update progress, attendance, payment |
| PATCH | `/courses/enrollments/:id/status` | `{ status, note? }` — NEW/ACTIVE/COMPLETED/WITHDRAWN |
| PATCH | `/courses/enrollments/:id/certificate` | Issue certificate for completed enrollment |
| DELETE | `/courses/enrollments/:id` | Remove enrollment |

#### Certificates

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/certificates` | List |
| POST | `/certificates` | Create |
| PUT | `/certificates/:id` | Update |
| POST | `/certificates/:id/revoke` | Revoke |
| DELETE | `/certificates/:id` | Delete |

#### Messages, Blogs, Settings

| Resource | CRUD prefix | Notes |
|----------|-------------|-------|
| Messages | `/messages` | PATCH status/reply |
| Blogs | `/blogs` | Full CRUD |
| Settings | `/settings`, PUT `/settings/bulk` | Key-value bulk update |

---

### Production API (`USE_DEMO_DATA=false`)

When demo mode is off, the following route groups are mounted (all under `/api` unless noted):

#### Public

| Prefix | Methods | Purpose |
|--------|---------|---------|
| `/internships` | GET | List + get by slug |
| `/internship/apply` | POST multipart | Submit application + resume |
| `/contact` | POST | Contact form |
| `/courses` | GET, POST `/enroll` | Courses + enrollment |
| `/certificate/verify/:code` | GET | Verify certificate |
| `/blogs` | GET | Public blog posts |
| `/team` | GET | Team members |
| `/jobs` | GET | Job listings |
| `/newsletter/subscribe` | POST | Subscribe |
| `/departments` | GET | Departments |
| `/settings` | GET | Public settings |

#### Admin (JWT + `canAccessAdmin`)

| Prefix | Purpose |
|--------|---------|
| `/admin/dashboard` | Stats, search, notifications |
| `/admin/internships` | Internship CRUD + duplicate |
| `/admin/applications` | Applications CRUD, status, notes, CSV, certificate stub |
| `/admin/messages` | Contact inbox |
| `/admin/courses` | Course CRUD + enrollment list |
| `/admin/certificates` | Certificate management |
| `/admin/blogs` | Blog CMS |
| `/admin/team` | Team CMS |
| `/admin/jobs` | Job CMS |
| `/admin/newsletter` | Subscriber list + CSV export |
| `/admin/departments` | Department CRUD |
| `/admin/employees` | Employee CRUD + documents |
| `/admin/settings` | Site settings |

**Production gaps vs demo admin:**

- No `/admin/courses/enrollments/:id/status` or `/certificate` routes
- Application certificate endpoint returns stub (no DB persist)
- Application lifecycle statuses beyond Prisma enum will fail validation/DB write

---

## Authentication Flow

```text
1. POST /api/auth/login { email, password }
2. Server checks (in order):
   a. Super Admin (.env ADMIN_EMAIL + bcrypt ADMIN_PASSWORD_HASH)
   b. Demo users (if USE_DEMO_DATA=true, demo-data.json)
   c. PostgreSQL User table
3. Returns accessToken (15m) + refreshToken (7d or 30d if rememberMe)
4. Frontend stores tokens in localStorage
5. Admin Axios client attaches Bearer token; on 401 retries /auth/refresh
6. Protected routes: middleware authenticate → roles canAccessAdmin
7. Logout: POST /auth/logout + clear localStorage
```

### Super Admin

- **Not stored in PostgreSQL**
- JWT payload includes `type: env_super_admin`
- Only Super Admin can `POST /api/auth/admin/users`

### DB admin users

- Roles: `ADMIN`, `HR`, `COURSE_MANAGER`, `CONTENT_MANAGER`, `VIEWER`
- Passwords bcrypt (12 rounds)
- Refresh tokens stored in `RefreshToken` table

### Role-based permissions

- **Schema:** `Permission` + `RolePermission` tables seeded with module codes
- **Runtime:** Unified admin panel—all authenticated roles use `canAccessAdmin` (no per-module UI restriction currently)
- **`canManageUsers`:** Super Admin only

### Password hashing

- bcrypt, 12 salt rounds (`auth.service.js`, `hash-password.js`)

---

## Dashboard Modules

### Dashboard — **Partial**

| Feature | Status |
|---------|--------|
| Stat cards (internships, applications, enrollments, etc.) | Completed (demo API) |
| Area chart (applications vs enrollments) | Completed (derived from stats in demo) |
| Recent applications table | Completed |
| Recent messages | Completed |
| Header notifications dropdown | **Partial** — UI exists; uses empty mock in layout; API available in demo |
| Global search page | Completed (`/admin/search`) |

### Internships — **Completed** (demo)

- List with applicant counts, CRUD, duplicate, delete confirmation
- Edit form: title, department, description, status, applications open, etc.
- Per-internship applicants route: `/admin/internships/:id/applications`

### Applications — **Completed** (demo)

- Global + per-internship boards
- Pipeline tabs, active interns cards, participants, withdrawn
- Detail view: status, notes, activity, resume download
- CSV export

### Interns — **Partial**

| Layer | Status |
|-------|--------|
| Demo UI lifecycle | Completed (via Application status `SELECTED` → `INTERNSHIP_COMPLETED`) |
| Prisma `Intern` model | Schema only — **no admin UI or API wiring** |
| Production API | Not Implemented |

### Courses — **Completed** (demo)

- Grid list with student count link
- Create/edit/delete with confirmation
- Per-course students: `/admin/courses/:courseId/students`

### Students — **Completed** (demo)

- Global student board with course filter
- New enrollments → Active students (cards) → Graduates → Certificate
- Enrollment detail with progress/attendance/payment

### Certificates — **Completed** (demo)

- List, create, edit, revoke, delete
- Auto-created when issuing from graduate flows (demo)

### Blogs — **Completed** (admin demo)

- List, create/edit with markdown preview, delete
- **Public blog page not connected to API**

### Messages — **Completed** (demo admin)

- Inbox list, detail, status update, delete
- **Contact API unavailable in demo mode** (route not mounted)

### Settings — **Completed** (demo)

- Bulk key-value editor (company, SEO, assets)

### Employees — **Not Implemented** (admin UI)

- Backend production API exists; no frontend module

### Analytics — **Partial**

- Dashboard charts and stat cards only; no dedicated analytics module

---

## Data Flow

### Admin (demo mode — current default)

```text
React Admin Page
    ↓  useAdminData / useMutation (React Query)
Axios → /api/admin/*
    ↓
demo.routes.js → demo-admin.controller.js
    ↓
demo-data.service.js (read/write demo-data.json)
    ↓
JSON file persistence (backend/data/demo-data.json)
    ↓
JSON response → React UI update
```

### Admin (production / Neon)

```text
React Admin Page
    ↓
Axios → /api/admin/*
    ↓
Route → Controller
    ↓
Prisma Client
    ↓
PostgreSQL (Neon)
    ↓
JSON response
```

### Public internship application (production)

```text
Careers page → fetchInternships() → GET /api/internships
InternshipDetail → submit multipart → POST /api/internship/apply
    ↓
application.controller → Prisma Application create
    ↓
notifyAdmins → Notification records
```

---

## Seed & Demo Data

### Demo JSON file (`backend/data/demo-data.json`)

Used when `USE_DEMO_DATA=true`. Mutations persist back to this file.

**Actual record counts** (not dashboard display stats):

| Entity | Count in JSON |
|--------|---------------|
| Internships | 12 |
| Applications | 9 |
| Courses | 9 |
| Enrollments | 8 |
| Certificates | 5 |
| Messages | 5 |
| Blogs | 6 |
| Admin users (demo) | 5 |
| Dashboard notifications | 3 |

> **Note:** Dashboard `stats` object shows marketing-scale numbers (e.g. `totalApplications: 100`) for UI demonstration—these do not match array lengths.

### PostgreSQL seed (`npm run seed`)

When `DATABASE_URL` is set, seeds **only**:

- 10 departments
- 20 permissions + role mappings
- Default site settings (company, SEO, assets)

Does **not** seed internships, courses, employees, or sample applications unless orphaned seed modules are wired in.

### Reset demo JSON

Restart backend after manual edits, or revert `demo-data.json` via git.

There is no automated demo JSON reset script.

### Reset / clear PostgreSQL demo data

```bash
cd backend
npm run clear:demo-db   # Requires DATABASE_URL; runs prisma/seed/clear.js
npm run seed            # Re-seed reference data
```

---

## File Upload Architecture

| Upload type | Route | Storage (current) | Max size |
|-------------|-------|-------------------|----------|
| Internship resume | `POST /api/internship/apply` | Local `backend/uploads/` | 10 MB |
| Employee documents | `POST /api/admin/employees/:id/documents` | Local (production) | 10 MB |
| Course/internship images | Schema fields (`*Url`, `*PublicId`) | **Manual URL entry** — no upload UI |

### Storage provider

| Provider | Status |
|----------|--------|
| Local (Multer disk) | **Completed** |
| Cloudinary | **Partial** — SDK installed, env vars documented, middleware **not implemented** |

### Future Cloudinary integration

1. Implement provider switch in `middleware/upload.js`
2. Store `publicId` in Prisma `*PublicId` fields
3. Set `UPLOAD_PROVIDER=cloudinary` in production

---

## Security Features

| Feature | Status | Implementation |
|---------|--------|----------------|
| JWT access/refresh | Completed | `jsonwebtoken`, auth middleware |
| Helmet | Completed | `app.js` |
| Rate limiting | Completed | 300 req/15min general; 30/15min on login |
| CORS | Completed | `CLIENT_URL` + Vite port fallback |
| Password hashing | Completed | bcrypt 12 rounds |
| Input validation | Completed | Zod on controllers |
| Role middleware | Partial | Roles exist; admin UI unified for all roles |
| SQL injection prevention | Completed | Prisma parameterized queries |
| XSS | Partial | React escaping; no server-side HTML sanitization for blog markdown |
| Audit logs | Partial | `AuditLog` model + `audit.service.js`; not all actions logged |
| HTTPS | Deployment concern | Not configured in repo |
| Demo plaintext passwords | **Dev only** | `demo-data.json` adminUsers — never use in production |
| CSRF | Not Implemented | Token in localStorage (not cookie-based session) |

---

## Performance Optimizations

| Optimization | Status |
|--------------|--------|
| Pagination | Completed — `paginate()` helper, list endpoints |
| Filtering | Partial — query params on some lists (status, internshipId, courseId) |
| Sorting | Partial — default `orderBy` on lists |
| DB indexes | Completed — comprehensive Prisma indexes |
| React Query staleTime | 30s default |
| Lazy loading routes | Not Implemented — single bundle |
| Prisma `$transaction` | Used on some list+count queries |
| Caching layer (Redis) | Not Implemented |

---

## Setup Guide

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL / Neon account (for production mode only)

### 1. Clone & install

```bash
git clone <repository-url>
cd "Axiolink Systems Webpage"
npm install
cd backend && npm install && cd ..
```

### 2. Environment

```bash
cp backend/.env.example backend/.env
```

**Quick start (demo mode — no database):**

```env
USE_DEMO_DATA=true
JWT_ACCESS_SECRET=dev-access-secret-min-32-characters-long
JWT_REFRESH_SECRET=dev-refresh-secret-min-32-characters-long
ADMIN_EMAIL=admin@axiolinksystems.com
ADMIN_PASSWORD_HASH='<generate with hash-password script>'
CLIENT_URL=http://localhost:3005
```

**Production / Neon mode:**

```env
USE_DEMO_DATA=false
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/axiolink?sslmode=require
# ... all secrets filled
```

### 3. Database (production mode only)

```bash
cd backend
npx prisma migrate deploy
npm run seed
npx prisma generate
```

### 4. Run development

**Both frontend + backend:**

```bash
npm run dev:all
```

**Or separately:**

```bash
npm run dev:backend   # http://localhost:4000
npm run dev           # http://localhost:3005
```

### 5. Access

| URL | Purpose |
|-----|---------|
| http://localhost:3005 | Public website |
| http://localhost:3005/admin | Admin portal |
| http://localhost:3005/admin/login | Admin login |
| http://localhost:4000/api/health | API health |

### 6. Production build

```bash
npm run build          # → dist/
cd backend && npm start
```

Serve `dist/` via static host (Nginx, Vercel, Netlify); proxy `/api` to backend.

---

## Deployment Guide

### Frontend

1. `npm run build`
2. Deploy `dist/` to static hosting
3. Set `VITE_API_URL=https://api.yourdomain.com` if API is on separate origin
4. Configure SPA fallback to `index.html`

### Backend

1. Set `NODE_ENV=production`, `USE_DEMO_DATA=false`
2. Configure all required env vars on host (Railway, Render, Fly.io, VPS)
3. Run `npx prisma migrate deploy && npm run seed`
4. Start with `node src/server.js` or process manager (PM2)
5. Ensure `uploads/` directory is writable or switch to Cloudinary

### Neon PostgreSQL

1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string → `DATABASE_URL`
3. Use pooled connection for serverless if applicable
4. Run migrations from CI or deploy hook

### Environment checklist

- [ ] Strong JWT secrets
- [ ] Super Admin password hash
- [ ] `CLIENT_URL` matches production frontend origin
- [ ] `USE_DEMO_DATA=false`
- [ ] SSL enabled on Neon connection

---

## Known Limitations

1. **Demo mode is the default** — Full admin features depend on JSON file, not PostgreSQL.
2. **Schema drift** — Demo lifecycle fields (intern + student statuses, certificate flags, status history) are **not in Prisma schema**.
3. **Production admin missing enrollment lifecycle endpoints** that demo mode has.
4. **Application certificate endpoint (production)** returns stub without persisting.
5. **Employee admin UI** not built despite backend API.
6. **Intern model** unused in admin UI.
7. **Public blog & Buland Parwaz pages** use static frontend data, not CMS API.
8. **Contact & newsletter** public routes **not mounted in demo mode**.
9. **Cloudinary** not implemented in upload middleware.
10. **Seed entrypoint** only loads reference data — rich seed modules orphaned.
11. **RBAC permissions** seeded but not enforced per-module in middleware/UI.
12. **Admin header notifications** not wired to API (mock empty).
13. **No Docker, CI/CD, or automated tests** in repository.
14. **Legacy `server/`** folder may cause confusion — not part of primary architecture.
15. **Dashboard stat numbers** in demo JSON are illustrative, not tied to actual record counts.

---

## Future Roadmap

| Module | Description |
|--------|-------------|
| CRM | Lead pipeline, client accounts |
| Payroll | Employee compensation |
| Finance | Invoicing, revenue tracking |
| Inventory | Asset/equipment tracking |
| Client Management | Project clients portal |
| Project Management | Delivery tracking |
| AI Features | Application screening, chat support |
| LMS Expansion | Quizzes, modules, video progress |
| Multi-Tenant Support | Separate org workspaces |
| Cloudinary uploads | Production file storage |
| Public CMS integration | Wire blog & courses to API |
| Employee admin UI | Full HR module frontend |
| Email notifications | Transactional email (SMTP/Resend) |
| CI/CD | GitHub Actions, automated migrations |

---

## Final Verification Checklist

| Item | Status |
|------|--------|
| Frontend completed | **Completed** |
| Backend completed | **Partial** (demo complete; prod gaps) |
| REST APIs completed | **Partial** (demo admin full; prod missing lifecycle APIs) |
| Prisma schema completed | **Completed** (but missing demo lifecycle fields) |
| Database models completed | **Completed** |
| Relationships completed | **Completed** |
| Migrations created | **Completed** (`20250628120000_init`) |
| Seed script created | **Partial** (reference only active) |
| Authentication completed | **Completed** |
| JWT implemented | **Completed** |
| Role-based authorization completed | **Partial** (middleware simplified; permissions not enforced per module) |
| File upload system completed | **Partial** (local resumes only) |
| Validation completed | **Completed** (Zod) |
| Employee module completed | **Partial** (API only) |
| Internship module completed | **Completed** (demo UI + prod CRUD) |
| Application lifecycle completed | **Partial** (demo only; schema mismatch) |
| Course module completed | **Completed** (demo) |
| Student module completed | **Partial** (demo lifecycle; prod schema gap) |
| Certificate module completed | **Completed** (demo) |
| Blog CMS completed | **Partial** (admin yes; public static) |
| Messages completed | **Partial** (admin demo; public contact not in demo) |
| Notifications completed | **Partial** (API exists; header UI not wired) |
| Dashboard analytics completed | **Partial** |
| Settings completed | **Completed** (demo) |
| Environment variables configured | **Completed** (`.env.example`) |
| Neon PostgreSQL ready | **Partial** (schema ready; feature parity not complete) |
| Production deployment ready | **Partial** (requires Neon migration + `USE_DEMO_DATA=false` + gap fixes) |

---

## AI Technical Review

### Current implementation status

This project is a **functional full-stack application with a polished admin portal operating primarily in JSON demo mode** (`USE_DEMO_DATA=true`). The public marketing site, unified admin UI, internship application flow (API-driven careers), and Buland Parwaz admin tooling are **implemented and usable locally**.

The **PostgreSQL / Neon layer is architecturally prepared** (Prisma schema, initial migration, env validation, auth service with DB paths) but is **not the active data layer** in default configuration. Switching to production mode will **not** yield feature parity with the demo admin without additional migration work.

### Remaining work before production

1. Set `USE_DEMO_DATA=false` and verify every admin screen against PostgreSQL controllers
2. Align Prisma schema with demo lifecycle features OR strip demo-only statuses from production UI
3. Wire public blog and Buland Parwaz pages to `/api/blogs` and `/api/courses`
4. Build Employee admin UI or remove from scope
5. Implement Cloudinary (or S3) upload provider
6. Wire admin notification bell to `/admin/dashboard/notifications`
7. Activate full seed (`education.js`, `recruitment.js`, `employees.js`) or document manual data entry
8. Add CI/CD, health checks, logging, and backup strategy
9. Remove or secure demo plaintext admin passwords in JSON
10. Add automated tests (API integration, auth, critical flows)

### Remaining work before connecting Neon PostgreSQL

1. Provision Neon database; set `DATABASE_URL` with SSL
2. Run `npx prisma migrate deploy`
3. Run `npm run seed` (reference data)
4. Generate Super Admin hash; configure JWT secrets
5. **Add Prisma migration** for:
   - Extended `ApplicationStatus` enum (`INTERNSHIP_COMPLETED`, `WITHDRAWN`) OR map demo statuses to `Intern` model
   - Enrollment `status` enum + `certificateIssued` + timestamp fields
   - Optional `ApplicationStatusHistory` table
6. Port demo service logic (`updateApplicationStatus`, `markEnrollmentCertificateIssued`, etc.) to Prisma-based services
7. Mount equivalent production routes for enrollment status/certificate PATCH endpoints
8. Test all admin mutations against real DB constraints (FK, cascades, soft deletes)

### Missing schemas (vs demo features)

- `Application.certificateIssued`, `activeInternAt`, `completedAt`, `withdrawnAt`
- `ApplicationStatus`: `INTERNSHIP_COMPLETED`, `WITHDRAWN`
- `ApplicationStatusHistory` (demo uses embedded JSON array)
- `Enrollment.status` (NEW/ACTIVE/COMPLETED/WITHDRAWN)
- `Enrollment.certificateIssued`, lifecycle timestamps, `statusHistory`

### Missing APIs (production vs demo)

- `PATCH /admin/courses/enrollments/:id/status`
- `PATCH /admin/courses/enrollments/:id/certificate`
- `DELETE /admin/courses/enrollments/:id`
- `GET/PATCH /admin/courses/enrollments/:id` (single enrollment detail)
- Fully persistent `PATCH /admin/applications/:id/certificate`
- Intern CRUD API usage (model exists, unused)

### Missing security features

- Cloudinary credential handling in production
- CSRF strategy for cookie-based auth (if adopted)
- Rate limit tuning per environment
- Security headers audit in production reverse proxy
- Demo mode guard to prevent `USE_DEMO_DATA=true` in production

### Missing validations

- Production enrollment update schema (partial body validation)
- File type validation on uploads (MIME whitelist)
- Stricter role enforcement using `Permission` table

### Missing migrations

- One init migration exists; **no migration for lifecycle extensions**

### Missing documentation (before this file)

- Comprehensive root README (this document)
- API OpenAPI/Swagger spec — **Not Implemented**
- Architecture decision records

### Missing deployment configuration

- Dockerfile / docker-compose
- GitHub Actions / CI pipeline
- Production environment templates for frontend (`VITE_API_URL`)
- Database backup/runbook

### Summary verdict for reviewers

| Question | Answer |
|----------|--------|
| Is the frontend production-quality? | **Mostly yes** — admin UI complete; public blog/courses wired to API |
| Is the backend production-ready? | **Largely yes** for core lifecycles — see [PRODUCTION_IMPLEMENTATION_REPORT.md](./PRODUCTION_IMPLEMENTATION_REPORT.md) |
| Is it Neon-ready? | **Yes** — run `prisma migrate deploy` + `npm run seed` |
| Can a reviewer trust demo mode as production behavior? | **Mostly yes** for applications, enrollments, certificates, blogs, courses |
| Recommended next step | Deploy to Neon with `USE_DEMO_DATA=false`, verify E2E, add PDF/Excel exports + test suite |

---

## Production Upgrade (June 2025)

See **[PRODUCTION_IMPLEMENTATION_REPORT.md](./PRODUCTION_IMPLEMENTATION_REPORT.md)** for the full changelog.

**Highlights:**
- Prisma migration `20250622120000_enterprise_lifecycle` — application/enrollment/certificate/employee lifecycle fields + history tables
- Production services: `application.service.js`, `enrollment.service.js`, `certificate.service.js`, `intern.service.js`
- API parity: enrollment status/certificate, application certificate persistence, intern routes, CSV exports
- Admin: Employees, Departments, live notification bell
- Public: Blog + Buland Parwaz courses from API (demo + production)
- Seed: full orchestration via `npm run seed`
- Security: demo-in-production guard, upload MIME validation, Cloudinary switch (`UPLOAD_PROVIDER`)
- RBAC: `requirePermission()` middleware + Permission table (extend to all routes)

**Deploy:**
```bash
cd backend && npx prisma migrate deploy && npm run seed && npm start
# Set USE_DEMO_DATA=false and DATABASE_URL to your Neon connection string
```

---

## License & Contact

Proprietary — Axiolink Systems Pvt Ltd.

**Public contact:** [contact.axiolink@gmail.com](mailto:contact.axiolink@gmail.com) · [+92 370 5834161](tel:+923705834161)

For technical questions about this codebase, refer to `backend/README.md` for backend-specific quick reference.

---

*Document generated from repository audit. Last reviewed against codebase structure, `USE_DEMO_DATA` demo routes, Prisma schema, and admin frontend modules.*
