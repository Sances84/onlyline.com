const STATS_API = "/api/penguin-stats";
const UPDATE_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
const START_DATE_ISO = "2026-04-26T13:00:00";

function renderStats(container, stats) {
  const cacheStatus = stats.cached ? '(cached' + (stats.stale ? ', stale)' : ')') : '(live)';
  container.innerHTML = `
    <strong>Penguin Clicker stats</strong> <small>${cacheStatus}</small><br>
    loves: <strong>${stats.loves}</strong><br>
    votes: <strong>${stats.votes}</strong><br>
    views: <strong>${stats.views}</strong><br>
    <small>Updated every 20 minutes. Powered by secure backend.</small>
  `;
}

function renderError(container, errorMessage) {
  container.innerHTML = `
    <strong>Penguin Clicker stats</strong><br>
    <span style="color:#b00;">Unable to load stats.</span><br>
    <small>${errorMessage}</small>
  `;
}

async function fetchStatsFromBackend(container) {
  try {
    const response = await fetch(STATS_API);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const stats = await response.json();
    renderStats(container, stats);
  } catch (error) {
    renderError(container, String(error));
  }
}

function scheduleUpdates(container) {
  setInterval(() => fetchStatsFromBackend(container), UPDATE_INTERVAL_MS);
}

function scheduleStartAt13(container) {
  const now = new Date();
  const startDate = new Date(START_DATE_ISO);

  if (now < startDate) {
    container.innerHTML = `Waiting for stats to start...`;
    const delay = startDate.getTime() - now.getTime();
    setTimeout(() => {
      fetchStatsFromBackend(container);
      scheduleUpdates(container);
    }, delay);
  } else {
    fetchStatsFromBackend(container);
    scheduleUpdates(container);
  }
}

function initPenguinClickerStats() {
  const container = document.getElementById("penguin-clicker-stats");
  if (!container) return;

  container.innerHTML = "Loading Penguin Clicker stats...";
  scheduleStartAt13(container);
}

document.addEventListener("DOMContentLoaded", initPenguinClickerStats);
