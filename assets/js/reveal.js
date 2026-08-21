/*
 * Site-wide scroll-reveal utility (data-reveal). Runs synchronously (not on
 * partials:loaded) so js-reveal lands on <html> before first paint — every
 * hidden "before" style in CSS is scoped under that class (see base.css), so
 * with no JS, a blocked/failed GSAP CDN load, or prefers-reduced-motion,
 * every [data-reveal] element is just plain static content. Never gate
 * visibility on JS alone.
 *
 * data-reveal        — fade + ~24px rise, own ScrollTrigger.
 * data-reveal-group   wraps sibling [data-reveal] items that should reveal
 *                     together with a gentle stagger instead of each firing
 *                     independently.
 * data-reveal="lines" — splits text into visual lines, each masked and
 *                     rising up from behind an overflow-hidden band.
 */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionAllowed = !prefersReducedMotion && window.gsap && window.ScrollTrigger;

  if (!motionAllowed) return;

  document.documentElement.classList.add('js-reveal');
  gsap.registerPlugin(ScrollTrigger);

  const EASE_FADE = 'expo.out';
  const EASE_LINES = 'power4.out';
  const DURATION_FADE = 0.7;
  const DURATION_LINES = 0.9;
  const STAGGER_ITEMS = 0.08;
  const STAGGER_LINES = 0.12;
  const START = 'top 85%';

  function revealGroups() {
    document.querySelectorAll('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.querySelectorAll(':scope > [data-reveal]'));
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: DURATION_FADE,
        ease: EASE_FADE,
        stagger: STAGGER_ITEMS,
        scrollTrigger: { trigger: group, start: START },
      });
    });
  }

  function revealItems() {
    document.querySelectorAll('[data-reveal]:not([data-reveal="lines"])').forEach((el) => {
      if (el.closest('[data-reveal-group]')) return;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DURATION_FADE,
        ease: EASE_FADE,
        scrollTrigger: { trigger: el, start: START },
      });
    });
  }

  // Wraps each word in a span, groups spans that land on the same offsetTop
  // into a line, then rebuilds the element as one overflow-hidden mask per
  // line wrapping an inner span (the thing that actually translates up).
  // Adjacent line-mask spans have no whitespace text node between them, so
  // el.textContent would glue the last word of one line to the first word of
  // the next on any re-split. splitLines therefore always takes the source
  // text explicitly — see getSourceText, its only caller — never reading it
  // back off a DOM that may already be split.
  function splitLines(el, text) {
    const words = text.trim().split(/\s+/);

    el.textContent = '';
    const wordSpans = words.map((word, i) => {
      const span = document.createElement('span');
      span.className = 'reveal-word';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return span;
    });

    const lines = [];
    let currentTop = null;
    let currentLine = [];

    wordSpans.forEach((span) => {
      const top = span.offsetTop;
      if (currentTop !== null && Math.abs(top - currentTop) > 1) {
        lines.push(currentLine.join(' '));
        currentLine = [];
      }
      currentLine.push(span.textContent);
      currentTop = top;
    });
    if (currentLine.length) lines.push(currentLine.join(' '));

    el.textContent = '';
    return lines.map((line) => {
      const mask = document.createElement('span');
      mask.className = 'reveal-line-mask';
      const inner = document.createElement('span');
      inner.className = 'reveal-line-inner';
      inner.textContent = line;
      mask.appendChild(inner);
      el.appendChild(mask);
      return inner;
    });
  }

  // Caches the pre-split plain text the first time an element is seen, so
  // later re-splits (resize, a second trigger racing the first one on
  // initial load) always read the clean original instead of the live DOM.
  // The lang:changed handler deletes the cache first, since applyDictionary
  // has just written fresh translated text into that same element.
  function getSourceText(el) {
    if (!el.dataset.revealText) {
      el.dataset.revealText = el.textContent.trim();
    }
    return el.dataset.revealText;
  }

  // Shared by the initial build, the resize handler, and the lang:changed
  // handler. Already-revealed headings (dataset.revealed) snap straight to
  // their visible state on re-split instead of replaying the rise — only
  // not-yet-seen headings get a fresh ScrollTrigger.
  function setupLinesReveal(el) {
    const inners = splitLines(el, getSourceText(el));
    el.classList.add('is-split');

    if (el._revealTrigger) {
      el._revealTrigger.kill();
      el._revealTrigger = null;
    }

    if (el.dataset.revealed === 'true') {
      gsap.set(inners, { yPercent: 0 });
      return;
    }

    gsap.set(inners, { yPercent: 100 });
    el._revealTrigger = ScrollTrigger.create({
      trigger: el,
      start: START,
      once: true,
      onEnter: () => {
        el.dataset.revealed = 'true';
        gsap.to(inners, {
          yPercent: 0,
          duration: DURATION_LINES,
          ease: EASE_LINES,
          stagger: STAGGER_LINES,
        });
      },
    });
  }

  function revealLines() {
    const headings = document.querySelectorAll('[data-reveal="lines"]');
    if (!headings.length) return;

    function build() {
      headings.forEach(setupLinesReveal);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
    } else {
      build();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        headings.forEach(setupLinesReveal);
        ScrollTrigger.refresh();
      }, 200);
    });

    document.addEventListener('lang:changed', () => {
      headings.forEach((el) => {
        // applyDictionary just wrote fresh translated text into el — drop
        // the cached source so getSourceText re-captures it, instead of
        // reusing the now-stale previous-language cache.
        delete el.dataset.revealText;
        setupLinesReveal(el);
      });
      ScrollTrigger.refresh();
    });
  }

  revealGroups();
  revealItems();
  revealLines();
})();
