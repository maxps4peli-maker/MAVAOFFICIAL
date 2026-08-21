const MAVA_LANG_KEY = 'mava-lang';

async function loadDictionary(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  return res.json();
}

function applyDictionary(dict) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = key.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), dict);
    if (value) el.textContent = value;
  });
}

async function setLang(lang) {
  localStorage.setItem(MAVA_LANG_KEY, lang);
  document.documentElement.setAttribute('lang', lang);

  const dict = await loadDictionary(lang);
  applyDictionary(dict);

  document.querySelectorAll('.lang-toggle span[data-lang]').forEach((span) => {
    span.classList.toggle('is-active', span.dataset.lang === lang);
  });

  // Lets reveal.js re-split [data-reveal="lines"] headings against the
  // newly-translated text (applyDictionary overwrites their textContent,
  // which would otherwise wipe the line-mask spans it built).
  document.dispatchEvent(new CustomEvent('lang:changed'));
}

document.addEventListener('partials:loaded', () => {
  const saved = localStorage.getItem(MAVA_LANG_KEY) || 'en';
  setLang(saved);

  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const current = localStorage.getItem(MAVA_LANG_KEY) || 'en';
    setLang(current === 'en' ? 'fi' : 'en');
  });
});
