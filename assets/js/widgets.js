const delay = ms => new Promise(res => setTimeout(res, ms));

function renderWidget(id, src, href, text) {
  const container = document.getElementById(id);
  if (!container) return;

  const iframe = document.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.width = '552';
  iframe.height = '167';
  iframe.src = src;
  iframe.loading = 'lazy';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.style.marginBottom = '8px';

  container.innerHTML = '';
  container.appendChild(iframe);
  const fallback = document.createElement('p');
  fallback.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  container.appendChild(fallback);
}

async function loadWidgets(widgetIds) {
  for (const widget of widgetIds) {
    renderWidget(widget.id, widget.src, widget.href, widget.text);
    await delay(1500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadWidgets([
    {
      id: "widget-4511223",
      src: "https://itch.io/embed/4511223",
      href: "https://ilya14.itch.io/ilya14-algodoo-phunlets-part-1",
      text: "The Ilya14's Algodoo Phunlets pack №1 by Ilya14"
    },
    {
      id: "widget-4510734",
      src: "https://itch.io/embed/4510734",
      href: "https://ilya14.itch.io/drawing-app",
      text: "The Drawing App by Ilya14"
    },
    {
      id: "widget-4511050",
      src: "https://itch.io/embed/4511050",
      href: "https://ilya14.itch.io/mushroom-ai",
      text: "Mushroom AI Architecture by Ilya14"
    }
  ]);
});