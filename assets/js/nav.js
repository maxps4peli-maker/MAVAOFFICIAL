document.addEventListener('partials:loaded', () => {
  const nav = document.getElementById('site-nav');
  const burger = document.getElementById('nav-burger');
  const links = document.querySelector('.site-nav__links');

  if (!nav) return;

  burger?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  links?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  const setScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
});
