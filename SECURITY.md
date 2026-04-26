# 🔒 Security Architecture

## The Problem
- ~~API URLs expose project IDs to anyone viewing page source~~ ✓ FIXED
- ~~Storing secrets in localStorage~~ ✓ REMOVED
- ~~API keys visible in git history~~ ✓ CLEANED

## The Solution: Secure Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Website (Frontend)                       │
│  penguin-clicker-stats.js calls /api/penguin-stats endpoint     │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ↓ (no API key exposed)
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Server (Backend)                      │
│  - Stores API key in .env (never committed!)                    │
│  - Caches stats to disk (penguin-stats-cache.json)              │
│  - Updates every 20 minutes                                      │
│  - Returns data to frontend                                      │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ↓ (only from server, never exposed)
┌─────────────────────────────────────────────────────────────────┐
│           Penguin Mod API (External Service)                     │
│  https://projects.penguinmod.com/api/v1/projects/getproject...  │
└─────────────────────────────────────────────────────────────────┘
```

## Setup

### Local Development
1. Copy `.env.example` → `.env.local`
2. Add your Penguin Clicker project ID
3. Install & run:
   ```bash
   npm install
   npm start
   ```
4. Server runs on `http://localhost:3000`
5. Stats cached to `penguin-stats-cache.json` (never commit this!)

### Production (GitHub Pages + Node.js)
If using Vercel, Heroku, or similar:
1. Set `PENGUIN_CLICKER_API` in platform secrets
2. Deploy the Node.js `server.js`
3. Point your HTML to the server endpoint

For static-only GitHub Pages, you'll need a backend service (Vercel serverless is free).

## API Endpoints

### Get Stats (with caching)
```
GET /api/penguin-stats
Response: { loves, votes, views, cached, stale }
```

### Clear Cache (manual)
```
DELETE /api/penguin-stats/cache
```

## What's Protected
✓ API key stored on server only (in `.env`)
✓ Never exposed to browser/page source
✓ Stats cached to disk - survives server restarts
✓ No localStorage = no client-side exposure
✓ Client only calls `/api/penguin-stats` endpoint

## Files to Keep Secret
- `.env` - Contains PENGUIN_CLICKER_API ⚠️ NEVER COMMIT
- `penguin-stats-cache.json` - Cache file (gets recreated)

## Always Remember
1. ✓ Never hardcode API keys in JavaScript
2. ✓ Always use `require('dotenv').config()`
3. ✓ Keep `.env*` in `.gitignore`
4. ✓ Use backend for sensitive operations
5. ✓ Test with (different/dummy) values locally
