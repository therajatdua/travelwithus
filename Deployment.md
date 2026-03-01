# TravelWithUs – Deployment Guide

> Complete guide for deploying the frontend (Vercel) and backend (Render) to production.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Git | any |
| Supabase project | ✅ (schema applied) |
| Google Gemini API key | from [aistudio.google.com](https://aistudio.google.com) |

---

## 1. Supabase Setup

### 1a. Apply the schema

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

Verify tables: `profiles`, `packages`, `bookings` should all appear in the Table Editor.

### 1b. Promote yourself to admin

After creating your first account via the app's login page, run this in the SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE user_id = '<your-supabase-user-id>';
```

Find your user ID under **Authentication → Users**.

### 1c. Disable email confirmation (dev only)

If you want to skip email confirmation during development:

**Authentication → Providers → Email** → toggle off **"Confirm email"**.

---

## 2. Backend – Deploy to Render

### 2a. Environment Variables

Create a `.env` in `server/` (or set these in Render's dashboard):

```env
PORT=5001
NODE_ENV=production

# Gemini AI
AI_API_KEY=<your-gemini-key-from-aistudio.google.com>

# Supabase (service role key - server side only, never expose to frontend)
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### 2b. Render Settings

| Field | Value |
|-------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/index.js` |
| Root Directory | `server` |
| Node Version | 18 |

### 2c. Health check

After deploy, verify:
```
GET https://<your-render-url>/api/health
GET https://<your-render-url>/api/ai/health
```

The AI health endpoint should return `{ "ok": true, "latencyMs": ... }` when the Gemini key is valid.

---

## 3. Frontend – Deploy to Vercel

### 3a. Environment Variables

Set in **Vercel Dashboard → Project → Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
NEXT_PUBLIC_API_URL=https://<your-render-url>
```

> ⚠️ Only use the **anon** (public) key for `NEXT_PUBLIC_SUPABASE_ANON_KEY` — never the service role key.

### 3b. Vercel Settings

| Field | Value |
|-------|-------|
| Framework | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Node Version | 18 |

### 3c. Supabase Auth Redirect URL

In Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://<your-vercel-url>`
- **Redirect URLs**: add `https://<your-vercel-url>/auth/callback`

---

## 4. Post-Deployment Checklist

- [ ] `/api/health` returns `200` on backend
- [ ] `/api/ai/health` returns `{ ok: true }` on backend
- [ ] Frontend loads at Vercel URL
- [ ] Sign up with a real email works (confirmation email arrives)
- [ ] Login redirects admin → `/admin/dashboard`
- [ ] Login redirects user → `/`
- [ ] Admin dashboard shows real counts from Supabase
- [ ] AI health badge in admin dashboard shows green "online"
- [ ] Package search on home page redirects to `/packages?...`

---

## 5. Local Development

```bash
# Terminal 1 – Backend
cd server
npm install
npm run dev           # starts on :5001

# Terminal 2 – Frontend
cd frontend
cp .env.local.example .env.local   # fill in keys
npm install
npm run dev           # starts on :3000
```

---

## 6. Key Architecture Notes

- **Auth**: Supabase email/password. Sessions stored in HTTP-only cookies via `@supabase/ssr`.
- **RBAC**: `profiles.role` column (`admin` | `user`). Guard runs in both Next.js middleware AND the `(admin)/layout.tsx` Server Component.
- **AI**: Google Gemini 2.5 Flash via `@google/genai`. No fallback — returns `503` if key is invalid or Gemini is down.
- **DB**: All tables protected by Row Level Security (RLS). Admins have full access; users see only their own rows.
