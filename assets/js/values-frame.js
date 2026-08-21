/*
 * Studio page — Values section only. Self-contained: touches nothing
 * outside .value-card. reveal.js's revealItems()/revealGroups() (the path
 * that drives .value-card's fade+rise, since it's a plain data-reveal item
 * inside a data-reveal-group) only ever set inline opacity/transform via
 * GSAP — no class gets added to the element on reveal, so there's no
 * existing hook for the CSS-drawn frame in studio.css to key off. This
 * mirrors the SAME js-reveal gate reveal.js itself uses (see base.css)
 * without touching reveal.js: if that class never landed, motion isn't
 * allowed or GSAP never loaded, so there's nothing to observe or draw —
 * the frame's own CSS fallback (studio.css) already shows it fully drawn
 * in that case.
 *
 * Observes each card individually rather than the whole grid at once: on
 * the mobile single-column layout the 4 cards enter the viewport at
 * meaningfully different scroll positions, so a single group-level trigger
 * would mark all four "drawn" as soon as the first one appears, well
 * before the user has scrolled down to actually see the later ones.
 */
function initValuesFrame() {
  if (!document.documentElement.classList.contains('js-reveal')) return;

  const cards = document.querySelectorAll('.value-card');
  if (!cards.length) return;

  if (!window.IntersectionObserver) {
    cards.forEach((card) => card.classList.add('is-drawn'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -15% 0px' }
  );

  cards.forEach((card) => observer.observe(card));
}

initValuesFrame();
