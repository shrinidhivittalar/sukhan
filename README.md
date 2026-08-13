# Sukhan Urdu Learning Studio

An interactive ten-level Urdu learning experience with source-guided study
paths, an in-page PDF library, script tracing, quizzes, and curated listening
activities — behind real email-and-password authentication.

## Architecture

| Piece | Runs on | Directory |
| --- | --- | --- |
| Next.js 16 app (UI + session gate) | Vercel | `app/` |
| Express + better-auth API | Render | `server/` |
| Postgres | Neon | — |
| Transactional email | SMTP (Gmail) | — |

The frontend never talks to Postgres. It forwards the session cookie to the
auth server, which remains the single source of truth for identity.

### ⚠️ The two hosts must share a parent domain

The session cookie is issued by the auth server and has to be readable by the
Next.js server. Browsers only allow that across a **shared parent domain**:

```
https://sukhan.example.com   → Vercel     (frontend)
https://auth.example.com     → Render     (auth server)
COOKIE_DOMAIN=.example.com
```

`sukhan.vercel.app` + `sukhan.onrender.com` are different root domains, so the
cookie will be silently discarded and every request will look signed-out. Local
development is unaffected: both sides are `localhost`, and cookies ignore ports.

## Local development

Two processes. Start the auth server first.

```bash
# terminal 1 — auth server on :3001
cd server
cp .env.example .env      # fill in DATABASE_URL, BETTER_AUTH_SECRET, SMTP_*
npm install
npm run auth:migrate      # creates the better-auth tables
npm run dev

# terminal 2 — Next.js on :3000
npm install
npm run dev               # reads .env.local
```

`.env.local` for the frontend:

```
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
AUTH_URL=http://localhost:3001
```

## Authentication

- Email + password, with **verification required before first sign-in**.
- Verification and password-reset links expire after 1 hour; reset links are
  single-use.
- Sessions last 30 days, stored server-side, carried by an `httpOnly` cookie
  (`sameSite=lax` in dev, `sameSite=none; secure; partitioned` in production).
- Rate limits are persisted in Postgres: 8 sign-ins/min, 6 sign-ups/hour,
  5 reset requests/hour.
- Sign-in failures and password-reset requests return identical responses
  whether or not the address exists, so the endpoints cannot be used to
  enumerate accounts.
- Per-account progress: `localStorage` keys are namespaced by user id, so two
  people on one device do not inherit each other's completed volumes.

### Routes

| Path | Access |
| --- | --- |
| `/login`, `/signup` | public; redirect to `/` when already signed in |
| `/forgot-password`, `/reset-password` | public |
| `/` | requires a session, otherwise redirects to `/login` |

## Deployment

### Render (`server/`)

- Root directory `server`, build `npm install && npm run build`, start `npm start`.
- Environment: `NODE_ENV=production`, `DATABASE_URL`, `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_URL=https://auth.example.com`, `APP_URL=https://sukhan.example.com`,
  `COOKIE_DOMAIN=.example.com`, and the five `SMTP_*` values.
- Attach the custom domain `auth.example.com`.

### Vercel (repository root)

- Environment: `NEXT_PUBLIC_AUTH_URL` and `AUTH_URL`, both
  `https://auth.example.com`.
- Attach the custom domain `sukhan.example.com`.

## Verification

```bash
npm run build     # type-checks and compiles the Next.js app
npm test          # asserts all ten volumes of study content and their PDFs
cd server && npm run build
```

## Notes

`_cloudflare-legacy/` holds the Cloudflare Workers scaffolding (vinext, wrangler,
D1) this project used before moving to Vercel. Nothing imports it; it is kept
only for reference and can be deleted.
