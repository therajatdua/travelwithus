# TravelWithUs — Full Developer Guide (Prototype → Production)

This is the **single source of truth** for this repository.

It replaces `Deployment.md` and documents:
- complete architecture (frontend + backend)
- components and routes
- auth/RBAC/AI/booking flows
- setup + run + deploy
- full migration timeline
- all major errors encountered and exactly how they were fixed

---

## 1) Project Snapshot

TravelWithUs is a travel platform built with:
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- **Backend:** Express 5, TypeScript, Firebase Admin, Gemini (`@google/genai`)
- **Auth/DB:** Firebase Auth + Firestore
- **AI:** Gemini itinerary + chat assistant (Travyy)

Current status:
- premium landing page
- protected admin analytics dashboard
- strict AI error policy (no fake itinerary fallback)
- booking flow with confirmation route
- production hardening (helmet, rate limit, guarded middleware)

---

## 2) Repository Structure

```text
TravelWithUs/
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (auth)/login/page.tsx
│  │  │  ├─ admin/dashboard/page.tsx
│  │  │  ├─ auth/callback/route.ts
│  │  │  ├─ bookings/[id]/confirmation/page.tsx
│  │  │  ├─ packages/[city]/page.tsx
│  │  │  ├─ packages/[city]/book/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  ├─ blog/page.tsx
│  │  │  ├─ careers/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  ├─ cookies/page.tsx
│  │  │  ├─ how-it-works/page.tsx
│  │  │  ├─ pricing/page.tsx
│  │  │  ├─ privacy/page.tsx
│  │  │  ├─ terms/page.tsx
│  │  │  ├─ favicon.ico
│  │  │  ├─ globals.css
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ components/
│  │  │  ├─ admin/AIHealthBadge.tsx
│  │  │  ├─ atoms/ (Button, InputField, Typography, Card, ScrollReveal, ScrollProgress)
│  │  │  ├─ home/HeroSearchWidget.tsx
│  │  │  ├─ molecules/ (AccommodationCard, ItineraryTimeline, AuthWallOverlay, ...)
│  │  │  └─ organisms/ (Header, Footer, BookingForm, AuthModal, ChatBot, ...)
│  │  ├─ context/ (AuthContext.tsx, ThemeContext.tsx)
│  │  ├─ hooks/useBooking.ts
│  │  ├─ lib/ (constants.ts, mockData.ts, firebase/*)
│  │  ├─ middleware.ts
│  │  └─ types/index.ts
│  ├─ .env.example
│  ├─ next.config.ts
│  ├─ package.json
│  └─ vercel.json
├─ server/
│  ├─ controllers/ (booking.ts, chat.ts, packages.ts)
│  ├─ routes/ (bookings.ts, chat.ts, packages.ts)
│  ├─ middlewares/ (auth.ts, errorHandler.ts, logger.ts)
│  ├─ services/ai.ts
│  ├─ lib/firebase.ts
│  ├─ index.ts
│  ├─ seed-firestore.ts
│  ├─ .env.example
│  └─ package.json
└─ README.md
```

---

## 3) Component Inventory (Frontend)

### Atoms
- `Button`
- `InputField`
- `Typography`
- `Card`
- `ScrollReveal`
- `ScrollProgress`

### Molecules
- `AccommodationCard`
- `AuthWallOverlay`
- `ItineraryTimeline`
- `PackageCard`
- `Card`

### Organisms
- `Header` (theme toggle, auth CTAs, nav)
- `Footer`
- `HeroSection`
- `DestinationGrid`
- `PackageGrid`
- `PackageHero`
- `BookingForm` (step flow, RHF + Zod)
- `AuthModal`
- `ChatBot` (Travyy)

### Admin-specific
- `AIHealthBadge`

---

## 4) Environment Setup

## 4.1 Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

## 4.2 Backend (`server/.env`)

```env
PORT=5001
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
AI_API_KEY=...
AI_MODEL=gemini-2.5-flash
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> If `PORT=5000` conflicts on macOS (AirTunes), use `PORT=5001`.

---

## 5) Local Run Commands

### Terminal 1 (Backend)
```bash
cd server
npm install
npm run dev
```

### Terminal 2 (Frontend)
```bash
cd frontend
npm install
npm run dev
```

### Build checks
```bash
cd frontend && npm run build
cd server && npx tsc
```

---

## 6) Runtime Flows

## 6.1 Authentication Flow
1. User signs in/up via Firebase client SDK.
2. `AuthContext` writes `__session` cookie.
3. `frontend/src/middleware.ts` protects:
   - `/admin/:path*`
   - `/packages/:city/book`
4. Admin RBAC enforced in admin layout by checking Firestore profile role.

## 6.2 RBAC Data Contract
Firestore profile document:
```ts
{
  uid: string;
  email: string;
  role: "admin" | "user";
  full_name?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
```

## 6.3 Booking Flow
1. `BookingForm` validates with RHF + Zod.
2. `useBooking` sends POST `/api/bookings` with Firebase Bearer token.
3. Backend validates token (`authenticateUser`) + body (`validateRequest`).
4. Booking saved in Firestore with AI itinerary payload.
5. Frontend redirects to `/bookings/[id]/confirmation`.

## 6.4 AI Health + Generation
- `GET /api/ai/health` sends strict ping prompt and validates response.
- If AI unavailable: returns `503`.
- Generation errors return `502` (bad gateway style from upstream AI).
- No hardcoded fake itinerary from server.

## 6.5 Chatbot Behavior
- Primary path: `/api/chat` live AI response.
- If backend returns `502/503` or malformed response, frontend chatbot now uses **graceful local fallback tips** (still useful UX, no crash).

---

## 7) API Endpoints

### Backend core
- `GET /api/health`
- `GET /api/ai/health`
- `GET /api/packages`
- `GET /api/packages/:themeKey`
- `POST /api/bookings` (auth)
- `GET /api/bookings` (auth)
- `GET /api/bookings/:id` (auth)
- `POST /api/chat`

---

## 8) Production Hardening Applied

- `helmet()` enabled
- rate limit enabled (`100 req / 15 min`)
- CORS origin uses `NEXT_PUBLIC_SITE_URL` first, then `FRONTEND_URL`
- admin route protection (middleware + role checks)
- AI error discipline (502/503, no server-side fake data)

---

## 9) Timeline of Major Changes

1. Firebase credentials were wired into env.
2. Firestore seed script added (`server/seed-firestore.ts`).
3. Footer 404 pages created (`about`, `pricing`, `privacy`, etc.).
4. Home page redesigned to premium visual style.
5. Search widget upgraded to glassmorphism.
6. Admin dashboard reworked to analytics-oriented view.
7. Login/admin redirect flow fixed.
8. Vercel config added and deployment issues resolved.
9. AI strict error model enforced in backend.
10. Booking confirmation route introduced.
11. Theme toggle simplified to Light/Dark only, with system-default first-load.
12. Landing page light-mode readability fixed.
13. Chatbot 502 UX fixed with graceful fallback responses.
14. Header logo wired to `favicon.ico` and tab icon explicitly configured.

---

## 10) Error Logbook (What broke + How fixed)

## A) Next dev lock file error
**Error**
- `Unable to acquire lock at .next/dev/lock`

**Cause**
- stale dev process holding lock.

**Fix**
- kill old port holders, restart dev.

---

## B) Footer links returning 404
**Error**
- `/about`, `/pricing`, `/privacy`, etc. not found.

**Fix**
- created all missing route pages under `frontend/src/app/*/page.tsx`.

---

## C) Landing page compile break (dangling JSX)
**Error**
- `FLOAT_MARKERS` undefined / orphan JSX after refactor.

**Cause**
- partial replace left old component tail in file.

**Fix**
- cleaned `frontend/src/app/page.tsx` to one valid component body.

---

## D) Firebase Admin OAuth token DNS failure
**Error**
- `ENOTFOUND oauth2.googleapis.com`

**Fix path used**
- avoided relying on that failing promotion path in production flow.
- implemented role/guard using Firestore profile checks in app flow.

---

## E) Frontend build failure on Google Fonts
**Error**
- `next/font: Failed to fetch Geist` (local network/DNS condition).

**Fix**
- removed runtime Google font dependency from layout, kept system-safe rendering.

---

## F) Backend TypeScript error `string | string[]`
**Error**
- Firestore `.doc(id)` rejected union type.

**Fix**
- strict narrowing before use:
```ts
const rawId = req.params.id;
const id = Array.isArray(rawId) ? rawId[0] : rawId;
if (typeof id !== "string" || !id.trim()) { ... }
```

---

## G) Port 5000 returned AirTunes 403 on macOS
**Error**
- `Server: AirTunes` and HTTP 403 from `localhost:5000`.

**Cause**
- system service conflict.

**Fix**
- run backend on `PORT=5001`.

---

## H) Chatbot console error `HTTP 502`
**Error**
- Frontend threw at `if (!res.ok) throw new Error(...)`.

**Fix**
- patched `ChatBot.tsx` with graceful fallback reply generation on non-2xx/network failures.

---

## I) Theme toggle confusion (Auto button)
**Issue**
- auto mode button UX not desired.

**Fix**
- removed auto mode from toggle.
- default still follows system on first load.
- toggle now cycles only Light ↔ Dark.

---

## J) Light mode landing page low visibility
**Cause**
- hero background/overlay stacking used negative z-index in a way that made content wash out.

**Fix**
- `isolate` section context + non-negative layer z-index in `page.tsx`.

---

## K) Git push failures (DNS/SSH)
**Errors seen during migration**
- `Could not resolve host: github.com`
- `Permission denied (publickey)`

**Fixes used**
- retried via HTTPS/SSH, corrected remote config, then successful push once network/auth path stabilized.

---

## 11) Deployment (Current Recommended)

## Frontend (Vercel)
- Root: `frontend`
- Build: `npm run build`
- Output: `.next`
- Env: all `NEXT_PUBLIC_*` Firebase keys + `NEXT_PUBLIC_API_URL`

## Backend (Render/Railway/Fly/etc)
- Root: `server`
- Build: `npm run build`
- Start: `npm run start`
- Env: Firebase Admin vars + AI key + CORS origin

---

## 12) New Developer Onboarding Checklist

1. Clone repo.
2. Configure `server/.env` and `frontend/.env.local`.
3. Start backend/frontend.
4. Run build checks.
5. Create test user via `/login`.
6. Promote role to `admin` in Firestore profile document.
7. Validate:
   - `/api/health`
   - `/api/ai/health`
   - `/admin/dashboard` guard behavior
   - booking flow with confirmation route
   - chatbot response path under AI outage

---

## 13) Maintenance Notes

- Keep frontend and backend ports explicit to avoid local conflicts.
- Keep AI failures explicit (`502/503`) and user-facing friendly.
- If changing auth internals, keep middleware + role checks in sync.
- Replace `frontend/src/app/favicon.ico` to update both tab icon and header logo.

---

## 14) Support / Ownership

For major architectural changes, update this README in the same PR.
This file is intended to be complete enough for a new developer to start contributing in under one day.
