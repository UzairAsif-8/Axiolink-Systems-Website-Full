# =============================================================================
# Axiolink Systems — Backend API
# =============================================================================

Production Node.js REST API. Connect Neon PostgreSQL via `DATABASE_URL` — no code changes needed.

## Setup (5 steps)

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_ACCESS_SECRET=<random-32+-chars>
JWT_REFRESH_SECRET=<random-32+-chars>
ADMIN_EMAIL=admin@axiolinksystems.com
ADMIN_PASSWORD_HASH=<from hash-password script>
CLIENT_URL=http://localhost:3005
```

```bash
node scripts/hash-password.js YourPassword
npx prisma migrate deploy    # or: npm run db:push (dev only)
npm run seed
npm run dev
```

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # All models, UUID PKs, relations
│   ├── seed.js             # Departments, permissions, site settings
│   └── migrations/         # Version-controlled SQL migrations
├── scripts/
│   └── hash-password.js    # Generate ADMIN_PASSWORD_HASH
├── src/
│   ├── config/             # env.js, database.js
│   ├── controllers/        # Thin HTTP handlers
│   ├── services/           # Business logic
│   ├── routes/             # Route definitions
│   ├── middleware/         # auth, roles, upload, errors
│   ├── validators/         # Zod schemas
│   └── utils/              # helpers, validate
├── uploads/                # Local file storage (dev)
├── .env.example
└── package.json
```

---

## Authentication Flow

### Super Admin (environment-based)

1. NOT stored in PostgreSQL
2. Login with `ADMIN_EMAIL` + password (verified against `ADMIN_PASSWORD_HASH`)
3. Receives JWT with `type: env_super_admin`
4. Can create other admin users via `POST /api/auth/admin/users`

### Database Users

Roles: `ADMIN`, `HR`, `COURSE_MANAGER`, `CONTENT_MANAGER`, `VIEWER`

Stored in `User` table with bcrypt password. Refresh tokens in `RefreshToken` table.

### Generate password hash

```bash
npm run hash-password -- YourSecurePassword
```

---

## API Response Format

**Success:**
```json
{ "success": true, "message": "...", "data": { } }
```

**Error:**
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "..." }] }
```

---

## Endpoints

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | JWT |
| GET | `/api/auth/admin/users` | Super Admin |
| POST | `/api/auth/admin/users` | Super Admin |

### Public Website
| Prefix | Description |
|--------|-------------|
| `/api/internships` | Internship listings |
| `/api/internship/apply` | Submit application (multipart) |
| `/api/contact` | Contact form |
| `/api/courses` | Courses + enrollment |
| `/api/certificate/verify/:code` | Certificate verification |
| `/api/blogs` | Blog posts |
| `/api/departments` | Departments |
| `/api/jobs` | Job listings |
| `/api/newsletter/subscribe` | Newsletter |
| `/api/settings` | Public site settings |

### Admin (JWT required)
| Prefix | Description |
|--------|-------------|
| `/api/admin/dashboard` | Stats, search, notifications |
| `/api/admin/internships` | Internship CRUD |
| `/api/admin/applications` | Application management |
| `/api/admin/employees` | Employee CRUD + documents |
| `/api/admin/departments` | Department CRUD |
| `/api/admin/courses` | Course CRUD |
| `/api/admin/certificates` | Certificate management |
| `/api/admin/messages` | Contact inbox |
| `/api/admin/blogs` | Blog CMS |
| `/api/admin/settings` | Site configuration |

---

## Database Commands

```bash
npm run db:generate        # Generate Prisma client
npx prisma migrate dev     # Create migration (development)
npx prisma migrate deploy  # Apply migrations (production)
npm run db:push            # Push schema without migration (dev shortcut)
npm run seed               # Seed reference data
npm run db:studio          # GUI browser
npm run db:setup           # migrate deploy + seed
```

---

## File Storage

Set `UPLOAD_PROVIDER=cloudinary` and configure `CLOUDINARY_*` env vars for production.

Supported uploads: resumes, employee documents, course thumbnails, certificates.

---

## Audit Logging

All significant admin actions are logged to `AuditLog`:
- ADMIN_LOGIN, USER_CREATED
- EMPLOYEE_CREATED/UPDATED/DELETED
- DEPARTMENT_CREATED/UPDATED/DELETED
- Internship publish, certificate issue, etc.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `DATABASE_URL is not configured` | Add Neon connection string to `.env` |
| `Super Admin credentials are not configured` | Set ADMIN_EMAIL + ADMIN_PASSWORD_HASH |
| `Invalid credentials` | Re-generate hash; ensure email matches exactly |
| Prisma migration failed | Check Neon connectivity; run `migrate deploy` |
| JWT errors | Ensure JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are set |

---

## Production Checklist

- [ ] `NODE_ENV=production`
- [ ] Strong JWT secrets (32+ random characters)
- [ ] Neon DATABASE_URL with SSL
- [ ] ADMIN_PASSWORD_HASH from strong password
- [ ] Render **Pre-Deploy Command**: `npx prisma migrate deploy` (run once per deploy — not in Build or Start)
- [ ] Render **Start Command**: `npm start` (starts the server only)
- [ ] `npm run seed` (one-time or when seed data changes)
- [ ] Cloudinary configured (required for CV / payment slip uploads — see below)
- [ ] CLIENT_URL set to production frontend URL

---

## Cloudinary (CV & document uploads)

Application resumes, job CVs, course payment slips, and course images use `uploadFile()`. In production, files **must** go to Cloudinary — Render's local disk is wiped on every redeploy.

### Render environment variables

| Variable | Value |
|----------|--------|
| `UPLOAD_PROVIDER` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | From [Cloudinary Dashboard](https://console.cloudinary.com) → Settings |
| `CLOUDINARY_API_KEY` | Same page |
| `CLOUDINARY_API_SECRET` | Same page (keep secret) |

If all three `CLOUDINARY_*` vars are set, production auto-enables Cloudinary even without `UPLOAD_PROVIDER`.

After deploy, logs should show: `✓ File uploads → Cloudinary (your-cloud-name)`.

New resume URLs look like `https://res.cloudinary.com/.../resumes/...` — not `onrender.com/uploads/...`.

---

## Render deployment

Run Prisma migrations **once** per deploy using Render's pre-deploy step. Do not run `prisma migrate deploy` in both the build and start commands — that causes PostgreSQL advisory lock timeouts (`P1002`).

| Render setting | Recommended value |
|----------------|-------------------|
| Root Directory | `backend` (if repo includes frontend) |
| Build Command | `npm install` |
| Pre-Deploy Command | `npx prisma migrate deploy` |
| Start Command | `npm start` |

`postinstall` runs `prisma generate` after `npm install`, so the Prisma Client is ready before the app starts. See `render.yaml` for a blueprint example.
