async function includePartials() {
  const targets = Array.from(document.querySelectorAll('[data-include]'));

  await Promise.all(targets.map(async (el) => {
    const url = el.getAttribute('data-include');
    const res = await fetch(url);
    el.outerHTML = await res.text();
  }));

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new CustomEvent('partials:loaded'));
}

includePartials();
