# MAVA — website

Plain static HTML/CSS/JS site for MAVA, a Helsinki-based web design studio. No build step, no framework.

## Stack

- HTML/CSS/JS, no bundler
- [GSAP](https://gsap.com/) + ScrollTrigger (CDN) for scroll animation
- [Lenis](https://lenis.darkroom.engineering/) (CDN) for smooth scroll
- [Fontshare](https://www.fontshare.com/) CDN for fonts (Clash Display + General Sans)

## Running locally

The nav and footer are shared HTML fragments (`partials/nav.html`, `partials/footer.html`) that get loaded into every page with `fetch()`. Browsers block `fetch()` on files opened directly (`file://`), so you need a tiny local server — opening `index.html` by double-clicking will show a blank nav/footer.

Easiest options:

- **VS Code**: install the "Live Server" extension, right-click `index.html` → "Open with Live Server".
- **Python** (if installed): `python -m http.server 5500`, then open `http://localhost:5500`.
- **Node** (if installed): `npx serve .`

## Structure

```
mava-web/
├── index.html / work.html / studio.html / contact.html   pages
├── partials/          nav.html, footer.html — injected via assets/js/include-partials.js
├── assets/css/        tokens.css (design tokens), base.css, layout.css (nav/footer/marquee),
│                       one stylesheet per page
├── assets/js/         include-partials, nav, time-widget, lang-toggle, lenis-init, animations
├── assets/img/        placeholder media — swap in real photos/video here
└── i18n/               en.json (default) / fi.json — text swapped by data-i18n attributes
```

## Notes

- Logo: currently a text wordmark in `partials/nav.html` — swap for `<img src="assets/img/logo.svg" alt="MAVA">` once the logo file is added (marked with a TODO comment in that file).
- Language toggle: click EN/FI in the nav, swaps text on any element with a `data-i18n="key.path"` attribute, matched against `i18n/en.json` / `i18n/fi.json`. Preference is remembered via `localStorage`.
- All four pages are currently placeholders — real sections (hero, work grid, founders, contact form, etc.) still need to be built out.
