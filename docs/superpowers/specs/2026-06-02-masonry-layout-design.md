# Masonry Layout Showcase - Design Spec

## Overview

A single-page masonry layout showcase for a portfolio site, designed to demonstrate front-end development skills to potential clients. The page uses Isotope.js to power a full-screen, interactive masonry grid with a floating control panel for real-time customization.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Page structure | Full-screen masonry + floating control panel | Immersive, feels like a real product rather than a demo |
| Visual theme | Dark/light theme switching with CSS custom properties | Consistent with existing portfolio projects (e-commerce site) |
| Masonry library | Isotope.js + imagesLoaded | Supports filtering, sorting, layout mode switching, and animated transitions |
| Content | Real content (Unsplash images + crafted fake data) | Looks like a finished product, more convincing than placeholder content |
| File structure | Single `index.html` (inline CSS + JS) | Matches the pattern of other projects in the repo |

## Page Structure

### Top Title Overlay

- Semi-transparent floating title bar at the top of the viewport
- Displays "Masonry Layout Showcase"
- Auto-hides on scroll down, reappears on scroll up
- Contains a minimal title only, no navigation

### Full-Screen Masonry Content Area

- Occupies the entire viewport height
- Content is scrollable vertically
- No traditional header or footer

### Floating Control Panel (bottom-right)

- Default state: collapsed into a small icon button (gear/palette icon)
- Expanded state: glassmorphism-styled panel with controls
- Smooth expand/collapse transition animation
- Responsive: becomes a bottom drawer on mobile

## Control Panel Features

### Theme Toggle

- Toggle switch for dark/light mode
- Default: follows system `prefers-color-scheme`
- Manual override persists to `localStorage`

### Content Type Switcher

- Three pill buttons: **Gallery** / **Cards** / **Mixed**
- Switching triggers Isotope layout refresh with transition animation

### Column Count Adjuster

- Slider control, range: 2-5 columns
- Adjusts CSS grid column width, triggers Isotope re-layout
- Responsive: mobile (<640px) forces 1-2 columns regardless of slider

### Layout Mode Switcher

- Three pill buttons: **Masonry** / **FitRows** / **Grid**
- Switches Isotope layout mode with animated transition

## Content Modes

### Gallery Mode

- Unsplash random images of varying dimensions
- On hover: overlay appears with image title + category tag
- Categories: Nature, Architecture, People, Technology, Food, Travel

### Cards Mode

- Project cards with varying heights, containing:
  - Project name (h3)
  - Short description (1-3 sentences)
  - Category tag (Design / Photography / Development / Branding)
  - Date
- Styled with glassmorphism in dark mode, clean white cards in light mode

### Mixed Mode

- Combination of Gallery and Cards content
- Some items are image-focused, others are text-focused
- Demonstrates how masonry handles heterogeneous content

## Data Model

Each content item has:

```typescript
interface MasonryItem {
  id: string;
  type: "image" | "card";
  title: string;
  category: string;
  date: string;
  imageUrl?: string;
  description?: string;
  aspectRatio?: string;
}

// Mixed mode = show both "image" and "card" items together
// It is NOT a separate item type, just a display filter
```

Predefined dataset of ~20-30 items embedded in JS as a const array.

## Theming

### CSS Custom Properties

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent: #4a90d9;
  --border: rgba(0, 0, 0, 0.08);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  --panel-bg: rgba(255, 255, 255, 0.85);
  --radius: 12px;
}

[data-theme="dark"] {
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: rgba(255, 255, 255, 0.06);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0b0;
  --accent: #6c9fd8;
  --border: rgba(255, 255, 255, 0.08);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  --panel-bg: rgba(30, 30, 50, 0.85);
}
```

### Theme Switching Logic

1. On page load, check `localStorage` for saved theme
2. If none, use `window.matchMedia('(prefers-color-scheme: dark)')` to detect system preference
3. Set `document.documentElement.setAttribute('data-theme', theme)`
4. Save to `localStorage` on manual toggle

## Technical Implementation

### Dependencies (CDN)

- Isotope.js: `https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js`
- imagesLoaded: `https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js`

### File Structure

```
masonry-layout/
├── index.html    (single file with inline <style> and <script>)
└── 需求.md       (original requirements, kept as-is)
```

### Responsive Breakpoints

| Breakpoint | Columns | Control Panel |
|-----------|---------|---------------|
| >= 1024px | User-configurable (2-5) | Floating panel (bottom-right) |
| 640-1023px | 2 columns | Floating panel (bottom-right, narrower) |
| < 640px | 1 column | Bottom drawer (full-width) |

### Performance Considerations

- Images use `loading="lazy"` and `decoding="async"`
- Isotope initialized after imagesLoaded completes
- Debounced resize handler for column recalculation
- CSS `will-change: transform` on masonry items for smooth animations

### Accessibility

- Theme toggle respects `prefers-reduced-motion` (disables animations)
- All controls have `aria-label` attributes
- Keyboard navigable: Tab through control panel, Enter/Space to activate
- Sufficient color contrast in both themes (WCAG AA)
- Focus visible styles on all interactive elements

## Conventions

Follow existing project patterns from `e-commerce-websit`:
- CSS Custom Properties for all design tokens
- Glassmorphism aesthetic (backdrop-filter, semi-transparent backgrounds)
- IIFE-wrapped JavaScript
- Semantic HTML (`<main>`, `<section>`, `<article>`)
- Pill-shaped buttons (`border-radius: 999px`)
- `requestAnimationFrame` for scroll-based logic
