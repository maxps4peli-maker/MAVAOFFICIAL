/*
 * Home hero — project 01 (Jensai) media only. Self-contained: touches
 * nothing outside .hero-shot. A plain time-based, looping GSAP tween with no
 * scrollTrigger config at all — independent of hero.js's pinned-scroll
 * ScrollTrigger (which only ever animates .hero__media's own yPercent, a
 * different element than the nested .hero-shot__img this file animates), so
 * it can never re-drive or interfere with the pin.
 *
 * Gate mirrors reveal.js's own motionAllowed check (prefers-reduced-motion +
 * gsap + ScrollTrigger) rather than depending on the js-reveal class it sets:
 * reveal.js isn't loaded on index.html at all (the Home hero has always used
 * its own separate hero.js pin/slide system, never the data-reveal utility),
 * so that class is never actually added on this page.
 */
function initHeroShot() {
  const wrapper = document.querySelector('.hero-shot');
  const img = document.querySelector('.hero-shot__img');
  if (!wrapper || !img) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionAllowed = !prefersReducedMotion && window.gsap && window.ScrollTrigger;

  // Static desktop fallback and the mobile cover-crop are both pure CSS
  // (see .hero-shot__img in home.css) — nothing to animate here.
  if (!motionAllowed) return;

  function isDesktop() {
    return window.matchMedia('(min-width: 861px)').matches;
  }

  let tween = null;

  function start() {
    if (!isDesktop()) return;

    const distance = img.getBoundingClientRect().height - wrapper.getBoundingClientRect().height;
    if (distance <= 20) return;

    tween = gsap.to(img, {
      y: -distance,
      duration: 20,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      repeatDelay: 1.2,
    });
  }

  function stop() {
    if (tween) {
      tween.kill();
      tween = null;
    }
    gsap.set(img, { y: 0 });
  }

  function refresh() {
    stop();
    start();
  }

  if (img.complete) {
    refresh();
  } else {
    img.addEventListener('load', refresh, { once: true });
    img.addEventListener('error', refresh, { once: true });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 200);
  });
}

document.addEventListener('partials:loaded', initHeroShot);
