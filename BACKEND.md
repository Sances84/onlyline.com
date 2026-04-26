# 🚀 Backend Setup Guide

Your stats are now fetched from a secure Node.js backend instead of the client!

## Why This is Better
- ✓ API key is never exposed to anyone viewing your page
- ✓ Stats are cached on disk, survives server restarts indefinitely
- ✓ No localStorage = no client-side data leaks
- ✓ Backend handles all API communication securely

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy the example
cp .env.example .env.local

# Edit .env.local and add your real Penguin Clicker project ID
# (Only you should have this file)
```

### 3. Run the Server
```bash
npm start
```

Server will be running on `http://localhost:3000`

### 4. Test It
```bash
curl http://localhost:3000/api/penguin-stats
```

You should get a response like:
```json
{
  "loves": 42,
  "votes": 100,
  "views": 5000,
  "cached": false,
  "timestamp": 1777228745000
}
```

## How Your Website Uses It

Your `penguin-clicker-stats.js` now simply calls:
```javascript
fetch("/api/penguin-stats")
```

No API key needed in the browser!

## Caching Behavior

- **First request**: Fetches from Penguin Mod API, saves to disk
- **Next 20 minutes**: Returns cached data from disk
- **After 20 minutes**: Fetches fresh data
- **API down**: Returns stale cache (doesn't break your site)

Cache is stored in: `penguin-stats-cache.json`

## Production Deployment

### Option 1: Vercel (Recommended - Free)
```bash
npm i -g vercel
vercel
```
Set `PENGUIN_CLICKER_API` in Vercel settings.

### Option 2: Heroku
```bash
heroku create your-app
heroku config:set PENGUIN_CLICKER_API="your-api-url"
git push heroku main
```

### Option 3: Self-hosted (Any Node.js Host)
1. Set environment variable: `PENGUIN_CLICKER_API`
2. Deploy `server.js`
3. Update HTML to point to your server

## Endpoints

### `GET /api/penguin-stats`
Get cached or fresh stats
- Returns: `{ loves, votes, views, cached, stale }`

### `DELETE /api/penguin-stats/cache`
Manually clear the cache (optional)

## Troubleshooting

### "Missing PENGUIN_CLICKER_API"
- Make sure `.env.local` exists and has your API URL
- Check your project ID is correct

### Stats won't update
- Delete `penguin-stats-cache.json`
- Restart the server

### Port already in use
```bash
PORT=3001 npm start
```

## Never Forget
1. ✓ `.env*` files are in `.gitignore` - good!
2. ✓ `penguin-stats-cache.json` is in `.gitignore` - good!
3. ✓ Only commit `package.json`, `server.js`, and `assets/js/`
4. ✓ Never commit your actual API key!

Questions? See `SECURITY.md` for more details.
