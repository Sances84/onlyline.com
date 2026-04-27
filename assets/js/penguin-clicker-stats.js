const projectID = 8439985638;

// Direct reference to PenguinMod project without API key exposure
function initPenguinClickerStats() {
  const container = document.getElementById("penguin-clicker-stats");
  if (!container) return;

  container.innerHTML = `
    <strong>Penguin Clicker</strong><br>
    Project ID: <strong>${projectID}</strong><br>
    <a href="https://studio.penguinmod.com/#${projectID}" target="_blank" rel="noopener noreferrer">Play Project</a>
  `;
}

document.addEventListener("DOMContentLoaded", initPenguinClickerStats);