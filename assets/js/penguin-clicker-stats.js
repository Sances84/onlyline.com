const PENGUIN_CLICKER_API = window.PENGUINCLICKERSTATS || null;
const STORAGE_KEY = "penguinClickerStats_v1";
const UPDATE_INTERVAL_MS = 20 * 60 * 1000; // 3 times per hour
const START_DATE_ISO = "2026-04-26T13:00:00";

function getStatNumber(value) {
  return Number(value ?? 0) || 0;
}

if (!PENGUIN_CLICKER_API) {
  console.error("Missing PENGUINCLICKERSTATS secret. Set window.PENGUINCLICKERSTATS before loading this script.");
}

function extractStats(data) {
  const project = data?.project ?? data;
  const stats = project?.stats ?? {};

  const loves = getStatNumber(project?.loves ?? project?.likes ?? project?.favoriteCount ?? stats?.loves ?? 0);
  const votes = getStatNumber(project?.votes ?? project?.voteCount ?? stats?.votes ?? 0);
  const views = getStatNumber(project?.views ?? project?.viewCount ?? stats?.views ?? 0);

  return { loves, votes, views };
}

function formatLocalTime(isoString) {
  if (!isoString) return "unknown";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function renderStats(container, stats) {
  container.innerHTML = `
    <strong>Penguin Clicker stats</strong><br>
    loves: <strong>${stats.a}</strong><br>
    votes: <strong>${stats.b}</strong><br>
    views: <strong>${stats.c}</strong><br>
    requested at: <strong>${formatLocalTime(stats.date)}</strong><br>
    <small>Updated every 20 minutes after first fetch.</small>
  `;
}

function renderError(container, errorMessage) {
  container.innerHTML = `
    <strong>Penguin Clicker stats</strong><br>
    <span style="color:#b00;">Unable to load stats.</span><br>
    ${errorMessage}
  `;
}

function loadCachedStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn("Unable to save Penguin Clicker stats to localStorage", error);
  }
}

async function fetchAndRender(container) {
  try {
    if (!PENGUIN_CLICKER_API) {
      throw new Error("Missing PENGUINCLICKERSTATS secret. Set window.PENGUINCLICKERSTATS before loading this script.");
    }
    const response = await fetch(PENGUIN_CLICKER_API, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const json = await response.json();
    const { loves, votes, views } = extractStats(json);
    const stats = {
      a: loves,
      b: votes,
      c: views,
      date: new Date().toISOString(),
    };
    saveStats(stats);
    renderStats(container, stats);
  } catch (error) {
    const cached = loadCachedStats();
    if (cached) {
      renderStats(container, cached);
    } else {
      renderError(container, String(error));
    }
  }
}

function scheduleUpdates(container) {
  setInterval(() => fetchAndRender(container), UPDATE_INTERVAL_MS);
}

function scheduleStartAt13(container) {
  const now = new Date();
  const startDate = new Date(START_DATE_ISO);

  if (now < startDate) {
    const delay = startDate.getTime() - now.getTime();
    container.innerHTML = `Waiting for stats start at ${formatLocalTime(startDate.toISOString())}...`;
    setTimeout(() => {
      fetchAndRender(container);
      scheduleUpdates(container);
    }, delay);
  } else {
    fetchAndRender(container);
    scheduleUpdates(container);
  }
}

function initPenguinClickerStats() {
  const container = document.getElementById("penguin-clicker-stats");
  if (!container) return;

  const cachedStats = loadCachedStats();
  if (cachedStats) {
    renderStats(container, cachedStats);
  } else {
    container.innerHTML = "Loading Penguin Clicker stats...";
  }

  scheduleStartAt13(container);
}

document.addEventListener("DOMContentLoaded", initPenguinClickerStats);
