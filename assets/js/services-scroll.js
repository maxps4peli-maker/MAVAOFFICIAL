/*
 * Studio page — Services section only. Self-contained: touches nothing
 * outside [data-services-scroll]. Mirrors hero.js's gating pattern exactly
 * (same prefers-reduced-motion / min-width:861px / GSAP-availability checks,
 * same "JS-added class gates all the special CSS" approach) — when any of
 * those checks fail, this function returns immediately and the section stays
 * in its un-gated base CSS state: a plain vertical stack of cards, revealed
 * by the existing data-reveal utility, never pinned or horizontalized.
 */
function initServicesScroll() {
  const section = document.querySelector('[data-services-scroll]');
  if (!section) return;

  const viewport = section.querySelector('.services-scroll__viewport');
  const track = section.querySelector('.services-scroll__track');
  const progressFill = section.querySelector('.services-scroll__progress-fill');
  if (!viewport || !track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canPin = window.matchMedia('(min-width: 861px)').matches;

  if (prefersReducedMotion || !canPin || !window.gsap || !window.ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Switches .services-scroll__track from the fallback's vertical stack to
  // a horizontal row (see studio.css) — done before measuring scrollWidth
  // below so that measurement reflects the row layout, not the stack.
  section.classList.add('services-scroll--active');

  // Cards are fixed-width (not text-driven), so this stays accurate without
  // waiting on webfonts; invalidateOnRefresh below still covers real resizes.
  const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const trackTween = gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${getDistance()}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    animation: trackTween,
    onUpdate: (self) => {
      if (progressFill) {
        progressFill.style.transform = `scaleX(${self.progress})`;
      }
    },
  });
}

document.addEventListener('partials:loaded', initServicesScroll);
