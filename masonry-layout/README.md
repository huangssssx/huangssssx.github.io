# Masonry Layout Showcase

A responsive masonry grid showcase built with [Isotope.js](https://isotope.metafizzy.co/), featuring a monopo saigon-inspired dark aesthetic with organic gradient backgrounds, frosted glass UI, and scroll-triggered lazy loading.

**[Live Demo](https://huangssssx.github.io/masonry-layout/)** · [GitHub Repository](https://github.com/huangssssx/huangssssx.github.io) · [README as HTML](https://huangssssx.github.io/masonry-layout/README.html)

## Features

- **Masonry / FitRows / Grid** layout modes powered by Isotope.js
- **Responsive images** with AVIF, WebP, and JPEG in 800px and 1200px variants via `<picture>`
- **Scroll-triggered pagination** — loads content in batches of 16 as the user scrolls
- **Ambient gradient toggle** — switch between immersive gradient background and minimal dark mode
- **Adjustable columns** (2–5) via a slider control
- **Three content modes** — Gallery (images only), Cards (text only), Mixed (interleaved)
- **Scroll-reveal animation** for newly loaded items with staggered fade-up
- **Auto-hiding header** on scroll down

## Design System

Inspired by the [monopo saigon](https://monopo.vn) aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Midnight Canvas | `#000000` | Page background |
| Frost White | `#ffffff` | Primary text, borders |
| Whisper Gray | `#6d6d6d` | Secondary text |
| Deep Ocean Gradient | `linear-gradient(90deg, rgb(160,224,171), rgb(255,172,46) 50%, rgb(165,45,37))` | Ambient background |
| Accent | `#a0e0ab` | Tags, active states, spinner |

- No `box-shadow` — depth comes from translucent backgrounds and gradient atmosphere
- Cards use `rgba(255, 255, 255, 0.04)` with `backdrop-filter` for frosted glass
- Buttons use pill radius (`75px`) with transparent or semi-transparent fills

## Project Structure

```
masonry-layout/
├── index.html                  # Single-file app (HTML + CSS + JS)
├── README.md
└── assets/
    ├── js/
    │   ├── isotope.pkgd.min.js
    │   └── imagesloaded.pkgd.min.js
    └── images/
        ├── img-1.jpg … img-48.jpg
        └── responsive/
            ├── img-{n}-800.avif
            ├── img-{n}-800.webp
            ├── img-{n}-800.jpg
            ├── img-{n}-1200.avif
            ├── img-{n}-1200.webp
            └── img-{n}-1200.jpg
```

## Content Data

The page ships with **96 items** (48 images + 48 text cards) defined inline as a JavaScript array. Each image entry references responsive sources through a `<picture>` element with AVIF → WebP → JPEG fallback.

Text card descriptions intentionally vary in length — from single-sentence summaries to multi-paragraph case studies — to produce visual rhythm in the masonry layout.

## Lazy Loading

| Parameter | Value |
|-----------|-------|
| Page size | 16 items |
| Trigger distance | 300px from bottom |
| Loading delay | 800ms (simulated) |
| New item animation | Staggered fade-up (`translateY(2rem)` → `0`) |

When all items are loaded, a subtle "No more content" message appears.

## Responsive Behavior

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| < 640px | 2 | 8px |
| 640–1023px | 2 | 8px |
| ≥ 1024px | User-controlled (2–5) | 16px |

## Accessibility

- `color-scheme: dark` for native dark form controls
- `aria-label` and `role="switch"` on the ambient toggle
- `:focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` disables all animations and transitions
- Semantic `<article>` elements for each card

## Dependencies

- [Isotope.js](https://isotope.metafizzy.co/) v3 — layout engine
- [imagesLoaded](https://imagesloaded.desandro.com/) — ensures images are loaded before layout

Both are bundled locally in `assets/js/`. No build step required.

## License

This project is for portfolio demonstration purposes. Image assets are sourced from [picsum.photos](https://picsum.photos/) and may be subject to their respective licenses.
