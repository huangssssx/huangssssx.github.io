# Animal Island Homepage - Design Spec

## Overview

A personal homepage built with animal-island-ui (Animal Crossing style), deployed as an independent showcase project on GitHub Pages under `animal-island/` subdirectory. Linked from the existing `main-websit/` portfolio.

## Tech Stack

- React 18 + Vite + TypeScript
- animal-island-ui npm package
- Deployment: Vite build output as static files, GitHub Pages subdirectory `animal-island/`
- GSAP for scroll animations (gsap-skills already installed)

## Page Structure (Single Page, 3 Sections)

### Global

- `Cursor` wraps entire page (game hand cursor)
- Font: Nunito + Noto Sans SC (Google Fonts)
- Colors: animal-island-ui design tokens
  - Background: `#f8f8f0` (cream)
  - Text: `#794f27` / `#725d42` (warm brown)
  - Primary: `#19c8b9` (mint teal)
  - Focus: `#ffcc00` (game yellow)

### Section 1: Hero

- Full-viewport background: green gradient `#7DC395` (island grass)
- `Typewriter` component: "Welcome to My Island" with typing animation
- Subtitle: personal intro text
- Entrance animation: `animal-zoom-in` fade-in
- `Title` ribbon decoration

### Section 2: Projects Showcase

- `Title` ribbon as section heading (green color scheme, "My Projects")
- 3 project cards using `Card` component with NookPhone palette colors:
  - Masonry Layout (color: `app-blue`)
  - Landing Page (color: `app-green`)
  - Northstar E-commerce (color: `app-orange`)
- Each card: project name, description, tech tags, link button (`Button` primary)
- Desktop: 3-column grid, Mobile: stacked
- `Divider` separator below

### Section 3: Skills (NookPhone)

- `Title` ribbon heading: "My Tools"
- `Phone` NookPhone component centered
- 9 App icons mapped to skills:
  - Camera -> TypeScript
  - App -> React
  - Critterpedia -> CSS
  - DIY -> Node.js
  - Shopping -> Git
  - Variant -> Vite
  - Design -> Figma
  - Map -> Docker
  - Chat -> Python

## File Structure

```
animal-island/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   └── sections/
│       ├── Hero.tsx
│       ├── Projects.tsx
│       └── Skills.tsx
└── dist/           (build output)
```

## Responsive

- Desktop: full layout, Phone component at full size (527x788px)
- Tablet: 2-column project grid
- Mobile: stacked cards, Phone scaled down via CSS transform

## Integration with Main Site

- `main-websit/index.html` projects section gets a new card linking to `../animal-island/`
- Animal Crossing themed card to distinguish from other projects
