function initHero() {
  const section = document.querySelector('[data-hero]');
  if (!section) return;

  const stack = section.querySelector('.hero__media-stack');
  const projects = Array.from(section.querySelectorAll('.hero__project'));
  const indexEl = document.getElementById('hero-index');
  const total = projects.length;

  function setIndex(i) {
    if (indexEl) {
      indexEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
  }

  setIndex(0);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canPin = window.matchMedia('(min-width: 861px)').matches;

  if (prefersReducedMotion || !canPin || !window.gsap || !window.ScrollTrigger || total < 2) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Pull each project's media square and text meta out of its article and
  // into two dedicated stacks, so the square can mask + slide independently
  // of the text crossfade beneath it. The (now-empty) articles are dropped —
  // this only ever runs on desktop with GSAP available; the unpinned fallback
  // markup (mobile, reduced motion, no GSAP) never reaches this code path.
  const mediaViewport = document.createElement('div');
  mediaViewport.className = 'hero__media-viewport';
  const scrim = document.createElement('div');
  scrim.className = 'hero__scrim';
  const metaViewport = document.createElement('div');
  metaViewport.className = 'hero__meta-viewport';

  const mediaEls = projects.map((article) => article.querySelector('.hero__media'));
  const metaEls = projects.map((article) => article.querySelector('.hero__project-meta'));

  mediaEls.forEach((el) => mediaViewport.appendChild(el));
  metaEls.forEach((el) => metaViewport.appendChild(el));
  projects.forEach((article) => article.remove());

  stack.append(mediaViewport, scrim, metaViewport);
  section.classList.add('hero--pinned');

  gsap.set(mediaEls, { yPercent: (i) => (i === 0 ? 0 : 100) });
  gsap.set(metaEls, { autoAlpha: (i) => (i === 0 ? 1 : 0) });

  const tl = gsap.timeline({ paused: true });
  for (let i = 0; i < total - 1; i += 1) {
    tl.to(mediaEls[i], { yPercent: -100, duration: 1, ease: 'none' }, i);
    tl.to(mediaEls[i + 1], { yPercent: 0, duration: 1, ease: 'none' }, i);
    tl.to(metaEls[i], { autoAlpha: 0, duration: 1, ease: 'none' }, i);
    tl.to(metaEls[i + 1], { autoAlpha: 1, duration: 1, ease: 'none' }, i);
  }

  let currentIndex = 0;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * (total - 1)}`,
    pin: true,
    scrub: 1,
    animation: tl,
    onUpdate: (self) => {
      const idx = Math.min(total - 1, Math.round(self.progress * (total - 1)));
      if (idx !== currentIndex) {
        currentIndex = idx;
        setIndex(idx);
      }
    },
  });
}

document.addEventListener('partials:loaded', initHero);
