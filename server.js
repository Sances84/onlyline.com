const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CACHE_FILE = path.join(__dirname, 'penguin-stats-cache.json');
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes
const API_URL = process.env.PENGUIN_CLICKER_API;

function getCachedStats() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const age = Date.now() - data.timestamp;
      
      if (age < CACHE_DURATION) {
        console.log(`✓ Serving cached stats (${Math.round(age / 1000)}s old)`);
        return { ...data, cached: true, age };
      }
    }
  } catch (error) {
    console.warn('⚠ Cache read error:', error.message);
  }
  return null;
}

function saveCachedStats(stats) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({
      ...stats,
      timestamp: Date.now()
    }, null, 2));
    console.log('✓ Stats cached to disk');
  } catch (error) {
    console.warn('⚠ Cache write error:', error.message);
  }
}

function fetchStats(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API returned ${res.statusCode}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          const project = json?.project ?? json;
          const stats = project?.stats ?? {};
          
          resolve({
            loves: Number(project?.loves ?? project?.likes ?? project?.favoriteCount ?? stats?.loves ?? 0),
            votes: Number(project?.votes ?? project?.voteCount ?? stats?.votes ?? 0),
            views: Number(project?.views ?? project?.viewCount ?? stats?.views ?? 0)
          });
        } catch (err) {
          reject(new Error('Failed to parse API response'));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Fetch failed: ${err.message}`));
    });
  });
}

async function getStats() {
  if (!API_URL) {
    throw new Error('PENGUIN_CLICKER_API environment variable is not set');
  }
  // Try cache first
  const cached = getCachedStats();
  if (cached) return cached;

  // Fetch fresh data
  try {
    const stats = await fetchStats(API_URL);
    saveCachedStats(stats);
    console.log('✓ Fresh stats fetched and cached');
    return { ...stats, cached: false };
  } catch (error) {
    // Return old cache if available, even if expired
    try {
      const oldCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.warn('⚠ Using stale cache due to fetch error:', error.message);
      return { ...oldCache, cached: true, stale: true };
    } catch {
      throw error;
    }
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/penguin-stats' && req.method === 'GET') {
    try {
      const stats = await getStats();
      res.writeHead(200);
      res.end(JSON.stringify(stats));
    } catch (error) {
      console.error('❌ Error:', error.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.url === '/api/penguin-stats/cache' && req.method === 'DELETE') {
    // Manual cache clear endpoint (optional)
    try {
      if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
      }
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Cache cleared' }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/penguin-stats`);
  console.log(`🗑️  Clear cache: DELETE http://localhost:${PORT}/api/penguin-stats/cache`);
});
