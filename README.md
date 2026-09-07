# BackToOwner — Admin Dashboard

React + Vite admin console, wired to the [`Backend`](../Backend) API (Node.js + Express + SQLite).

## Setup

```bash
# 1. Start the API first (separate repo/folder)
cd ../Backend
npm install && npm run seed && npm run dev   # http://localhost:5000

# 2. Then the dashboard
cd AdminDashBoard
npm install
copy .env.example .env     # (or `cp` on macOS/Linux) — VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

Sign in with the admin account seeded by the backend:
- email: `admin@backtoowner.com`
- password: `Admin@12345`

## What's wired up

Every view now talks to the real API via `src/api/*` (see `src/controllers/*` for the
data-fetching hooks) instead of `src/data/mockData.js`:

- **Login** — JWT session (`src/controllers/useAuthController.js`), persisted in `localStorage`, restored on refresh.
- **Reports** (Dashboard feed, Items List, item detail/status changes, CSV export).
- **Categories** (create / edit / delete, with usage-count guard against deletion).
- **AI Smart Matches** — lists `pending_admin_approval` matches and approves/rejects them against the API. There's no real matching engine behind this yet (see below), so the list is empty until a match is created via `POST /api/matches`.
- **Users** — read-only directory of registered users from `GET /api/users`.
- **Notifications & Geo-Broadcast** — list, mark-read, and dispatch broadcasts through the API.
- **Analytics** — KPI cards and both charts (report volume, category breakdown) are computed from `GET /api/stats/overview` and `/api/stats/breakdown`.

`src/data/mockData.js` is no longer imported anywhere live — it's left in place only for reference.

## Known simplifications

- **No real matching AI.** The "Run Auto-Match Scanner" button is still a cosmetic animation; nothing calls a matcher. Match pairs only appear if something calls `POST /api/matches` (e.g. from a future automated job, or manually while testing).
- **Trend deltas & average resolution time** (the little "+4.2%" style badges, `Avg Recovery Time`) aren't computed by the backend — it doesn't keep historical snapshots — so those specific fields keep `StatsModel`'s cosmetic placeholder values while every counted metric (items returned, active cases, success rate, pending matches, rewards, users) is real.
- **Reporter/finder contact** is a single free-text field on the admin side (`reporter.contact` / `finder.contact`), not a full linked user profile — the Admin Backend and the mobile App-Backend are separate databases (separate repos), so a report logged/managed by an admin isn't automatically the same record as one filed through the mobile app.

## Project structure

```
src/
  api/            fetch client + one module per resource (auth, reports, categories, matches, notifications, users, stats)
  controllers/    React hooks bridging API <-> views (one per resource, plus useAuthController)
  utils/format.js timeAgo / date / money formatting for API responses
  views/          page-level components (LoginView is new)
  components/     shared presentational components
  models/         thin domain wrapper classes (ReportModel, CategoryModel, ...)
```
