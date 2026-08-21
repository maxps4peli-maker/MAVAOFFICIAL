document.addEventListener('partials:loaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.utils.toArray('[data-animate]').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });
});
