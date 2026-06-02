# Masonry Layout Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page masonry layout showcase using Isotope.js with a floating control panel for theme, content type, columns, and layout mode switching.

**Architecture:** Single `index.html` file with inline `<style>` and `<script>`. Isotope.js and imagesLoaded loaded via CDN. CSS custom properties for theming. IIFE-wrapped vanilla JS for all interactivity.

**Tech Stack:** HTML5, CSS3 (custom properties, glassmorphism), Vanilla JavaScript, Isotope.js, imagesLoaded, Unsplash Source API for images.

**Spec:** `docs/superpowers/specs/2026-06-02-masonry-layout-design.md`

---

## File Structure

```
masonry-layout/
├── index.html    (single file — all HTML, CSS, JS inline)
└── 需求.md       (existing, do not modify)
```

The entire implementation lives in `masonry-layout/index.html`. It contains:
- `<head>`: meta tags, CDN script tags, inline `<style>` with all CSS
- `<body>`: semantic HTML structure
- End of `<body>`: inline `<script>` with all JS logic

---

### Task 1: HTML Skeleton + CSS Custom Properties + Theme Logic

**Files:**
- Create: `masonry-layout/index.html`

Build the complete HTML structure, all CSS, and the theme switching logic. The page should render with styled cards (placeholder content for now) and a working dark/light theme toggle.

- [ ] **Step 1: Create the HTML file with head, meta, and CDN scripts**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masonry Layout Showcase</title>
  <meta name="description" content="A responsive masonry layout showcase built with Isotope.js, featuring dark/light themes, multiple content types, and interactive controls.">
  <script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js"></script>
  <script src="https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"></script>
  <style>
    /* CSS goes here */
  </style>
</head>
<body>
  <!-- HTML goes here -->
  <script>
    // JS goes here
  </script>
</body>
</html>
```

- [ ] **Step 2: Add CSS custom properties and reset/base styles**

Inside `<style>`, add:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent: #4a90d9;
  --accent-hover: #357abd;
  --border: rgba(0, 0, 0, 0.08);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  --panel-bg: rgba(255, 255, 255, 0.85);
  --panel-border: rgba(0, 0, 0, 0.1);
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --radius: 12px;
  --radius-sm: 8px;
  --transition: 0.3s ease;
  --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

[data-theme="dark"] {
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: rgba(255, 255, 255, 0.06);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0b0;
  --accent: #6c9fd8;
  --accent-hover: #5a8dc0;
  --border: rgba(255, 255, 255, 0.08);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  --panel-bg: rgba(30, 30, 50, 0.85);
  --panel-border: rgba(255, 255, 255, 0.1);
  --overlay-bg: rgba(0, 0, 0, 0.7);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color var(--transition), color var(--transition);
  min-height: 100vh;
  overflow-x: hidden;
}
```

- [ ] **Step 3: Add title overlay CSS and HTML**

CSS:

```css
.title-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px;
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--panel-border);
  text-align: center;
  transform: translateY(0);
  transition: transform 0.4s ease;
}

.title-overlay.hidden {
  transform: translateY(-100%);
}

.title-overlay h1 {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}
```

HTML (inside `<body>` before masonry):

```html
<div class="title-overlay" id="titleOverlay">
  <h1>Masonry Layout Showcase</h1>
</div>
```

- [ ] **Step 4: Add masonry grid CSS**

```css
.masonry-grid {
  padding: 80px 24px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.masonry-item {
  width: calc(25% - 12px);
  margin-bottom: 16px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition), background-color var(--transition);
}

.masonry-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1023px) {
  .masonry-item {
    width: calc(50% - 8px);
  }
}

@media (max-width: 639px) {
  .masonry-item {
    width: 100%;
  }
  .masonry-grid {
    padding: 70px 12px 12px;
  }
}
```

- [ ] **Step 5: Add card styles for image cards and text cards**

```css
.masonry-item.image-card img {
  width: 100%;
  display: block;
  transition: transform 0.5s ease;
}

.masonry-item.image-card:hover img {
  transform: scale(1.03);
}

.masonry-item.image-card .image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--transition), transform var(--transition);
}

.masonry-item.image-card {
  position: relative;
}

.masonry-item.image-card:hover .image-overlay {
  opacity: 1;
  transform: translateY(0);
}

.masonry-item.image-card .image-overlay h3 {
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.masonry-item.image-card .image-overlay .tag {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
}

.masonry-item.text-card {
  padding: 20px;
}

.masonry-item.text-card h3 {
  font-size: 1rem;
  margin-bottom: 8px;
  line-height: 1.3;
}

.masonry-item.text-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.masonry-item .card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.masonry-item .card-meta .tag {
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
}

.masonry-item .card-meta .date {
  font-size: 0.7rem;
  color: var(--text-secondary);
}
```

- [ ] **Step 6: Add floating control panel CSS and HTML**

CSS:

```css
.control-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--panel-border);
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--text-primary);
  transition: transform var(--transition), box-shadow var(--transition);
}

.control-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.control-panel {
  position: fixed;
  bottom: 84px;
  right: 24px;
  z-index: 200;
  width: 280px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid var(--panel-border);
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(16px) scale(0.95);
  pointer-events: none;
  transition: opacity var(--transition), transform var(--transition);
}

.control-panel.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.control-panel h3 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 10px;
  margin-top: 16px;
}

.control-panel h3:first-child {
  margin-top: 0;
}

.control-group {
  margin-bottom: 16px;
}

.control-group:last-child {
  margin-bottom: 0;
}

/* Theme toggle switch */
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-switch span {
  font-size: 0.85rem;
}

.toggle-track {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: background var(--transition);
}

.toggle-track.active {
  background: var(--accent);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--transition);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-track.active .toggle-thumb {
  transform: translateX(20px);
}

/* Pill buttons */
.pill-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pill-btn {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all var(--transition);
  font-family: var(--font-sans);
}

.pill-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.pill-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* Range slider */
.range-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
  margin-top: 8px;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.range-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: none;
}

.range-value {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 4px;
  text-align: right;
}

@media (max-width: 639px) {
  .control-panel {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    border-radius: var(--radius) var(--radius) 0 0;
    max-height: 50vh;
  }

  .control-toggle {
    bottom: 16px;
    right: 16px;
  }
}
```

HTML (inside `<body>` after the masonry grid):

```html
<button class="control-toggle" id="controlToggle" aria-label="Toggle control panel">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
</button>

<div class="control-panel" id="controlPanel">
  <h3>Theme</h3>
  <div class="control-group">
    <div class="theme-switch">
      <span id="themeLabel">Light</span>
      <div class="toggle-track" id="themeToggle" role="switch" aria-checked="false" aria-label="Toggle dark mode" tabindex="0">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  </div>

  <h3>Content</h3>
  <div class="control-group">
    <div class="pill-group" id="contentPills">
      <button class="pill-btn active" data-content="gallery">Gallery</button>
      <button class="pill-btn" data-content="cards">Cards</button>
      <button class="pill-btn" data-content="mixed">Mixed</button>
    </div>
  </div>

  <h3>Columns</h3>
  <div class="control-group">
    <input type="range" class="range-slider" id="columnSlider" min="2" max="5" value="4" aria-label="Number of columns">
    <div class="range-value"><span id="columnValue">4</span> columns</div>
  </div>

  <h3>Layout</h3>
  <div class="control-group">
    <div class="pill-group" id="layoutPills">
      <button class="pill-btn active" data-layout="masonry">Masonry</button>
      <button class="pill-btn" data-layout="fitRows">FitRows</button>
      <button class="pill-btn" data-layout="fitWidth">Grid</button>
    </div>
  </div>
</div>
```

- [ ] **Step 7: Add theme switching JavaScript**

Inside `<script>`, add:

```javascript
(function () {
  var html = document.documentElement;
  var savedTheme = localStorage.getItem('masonry-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    var toggle = document.getElementById('themeToggle');
    var label = document.getElementById('themeLabel');
    if (theme === 'dark') {
      toggle.classList.add('active');
      toggle.setAttribute('aria-checked', 'true');
      label.textContent = 'Dark';
    } else {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-checked', 'false');
      label.textContent = 'Light';
    }
  }

  applyTheme(currentTheme);

  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('masonry-theme', next);
  });

  document.getElementById('themeToggle').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
})();
```

- [ ] **Step 8: Add control panel toggle JavaScript**

Wrap in a new IIFE after theme script:

```javascript
(function () {
  var toggle = document.getElementById('controlToggle');
  var panel = document.getElementById('controlPanel');
  var isOpen = false;

  toggle.addEventListener('click', function () {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
  });
})();
```

- [ ] **Step 9: Add title overlay scroll behavior**

```javascript
(function () {
  var overlay = document.getElementById('titleOverlay');
  var lastScrollY = 0;
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        var currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          overlay.classList.add('hidden');
        } else {
          overlay.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  });
})();
```

- [ ] **Step 10: Add placeholder masonry items for testing**

Add 8 placeholder items inside a `<main class="masonry-grid" id="masonryGrid">` element:

```html
<main class="masonry-grid" id="masonryGrid">
  <article class="masonry-item image-card" data-type="image" data-category="nature">
    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop" alt="Mountain landscape" loading="lazy" decoding="async">
    <div class="image-overlay">
      <h3>Mountain Vista</h3>
      <span class="tag">Nature</span>
    </div>
  </article>
  <article class="masonry-item text-card" data-type="card" data-category="design">
    <h3>Brand Identity System</h3>
    <p>A complete visual identity system designed for a luxury hospitality brand, including logo, typography, color palette, and brand guidelines.</p>
    <div class="card-meta">
      <span class="tag">Design</span>
      <span class="date">Mar 2025</span>
    </div>
  </article>
  <article class="masonry-item image-card" data-type="image" data-category="architecture">
    <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=500&fit=crop" alt="Modern building" loading="lazy" decoding="async">
    <div class="image-overlay">
      <h3>Urban Geometry</h3>
      <span class="tag">Architecture</span>
    </div>
  </article>
  <article class="masonry-item text-card" data-type="card" data-category="development">
    <h3>E-Commerce Platform</h3>
    <p>Full-stack e-commerce solution with real-time inventory management, payment processing, and analytics dashboard.</p>
    <div class="card-meta">
      <span class="tag">Development</span>
      <span class="date">Jan 2025</span>
    </div>
  </article>
  <article class="masonry-item image-card" data-type="image" data-category="people">
    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" alt="Portrait" loading="lazy" decoding="async">
    <div class="image-overlay">
      <h3>Portrait Study</h3>
      <span class="tag">People</span>
    </div>
  </article>
  <article class="masonry-item text-card" data-type="card" data-category="branding">
    <h3>Startup Rebrand</h3>
    <p>Complete rebranding for a tech startup transitioning from B2C to B2B market positioning. New visual language, tone of voice, and messaging framework.</p>
    <div class="card-meta">
      <span class="tag">Branding</span>
      <span class="date">Feb 2025</span>
    </div>
  </article>
  <article class="masonry-item image-card" data-type="image" data-category="food">
    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=350&fit=crop" alt="Food photography" loading="lazy" decoding="async">
    <div class="image-overlay">
      <h3>Culinary Art</h3>
      <span class="tag">Food</span>
    </div>
  </article>
  <article class="masonry-item image-card" data-type="image" data-category="travel">
    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=260&fit=crop" alt="Beach sunset" loading="lazy" decoding="async">
    <div class="image-overlay">
      <h3>Coastal Serenity</h3>
      <span class="tag">Travel</span>
    </div>
  </article>
</main>
```

- [ ] **Step 11: Verify in browser**

Open `masonry-layout/index.html` in a browser. Check:
- Page renders with styled cards
- Theme toggle works (dark/light)
- Control panel opens/closes
- Title overlay hides/shows on scroll
- Responsive layout on different widths

- [ ] **Step 12: Commit**

```bash
git add masonry-layout/index.html
git commit -m "feat: add masonry layout HTML skeleton with theme and control panel"
```

---

### Task 2: Isotope Initialization + Full Data Set

**Files:**
- Modify: `masonry-layout/index.html` (inline `<script>`)

Replace the placeholder items with the full data set (~24 items), initialize Isotope with imagesLoaded, and wire up column width calculation.

- [ ] **Step 1: Create the data array**

Replace placeholder HTML items with a JS data-driven approach. Add this IIFE:

```javascript
(function () {
  var DATA = [
    { id: 'img-1', type: 'image', title: 'Mountain Vista', category: 'Nature', date: '2025-05-10', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop' },
    { id: 'img-2', type: 'image', title: 'Urban Geometry', category: 'Architecture', date: '2025-04-22', imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=750&fit=crop' },
    { id: 'img-3', type: 'image', title: 'Portrait Study', category: 'People', date: '2025-03-15', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop' },
    { id: 'img-4', type: 'image', title: 'Culinary Art', category: 'Food', date: '2025-02-28', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop' },
    { id: 'img-5', type: 'image', title: 'Coastal Serenity', category: 'Travel', date: '2025-01-14', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=380&fit=crop' },
    { id: 'img-6', type: 'image', title: 'Forest Canopy', category: 'Nature', date: '2024-12-20', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=500&fit=crop' },
    { id: 'img-7', type: 'image', title: 'Glass Tower', category: 'Architecture', date: '2024-11-08', imageUrl: 'https://images.unsplash.com/photo-1487958449943-2422127b0935?w=600&h=900&fit=crop' },
    { id: 'img-8', type: 'image', title: 'Street Moments', category: 'People', date: '2024-10-30', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=350&fit=crop' },
    { id: 'img-9', type: 'image', title: 'Artisan Bread', category: 'Food', date: '2024-09-12', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=550&fit=crop' },
    { id: 'img-10', type: 'image', title: 'Alpine Sunrise', category: 'Travel', date: '2024-08-25', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=700&fit=crop' },
    { id: 'img-11', type: 'image', title: 'Autumn Path', category: 'Nature', date: '2024-07-18', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=420&fit=crop' },
    { id: 'img-12', type: 'image', title: 'Skyline Dusk', category: 'Architecture', date: '2024-06-05', imageUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&h=400&fit=crop' },
    { id: 'card-1', type: 'card', title: 'Brand Identity System', category: 'Design', date: '2025-03-20', description: 'A complete visual identity system designed for a luxury hospitality brand, including logo, typography, color palette, and comprehensive brand guidelines.' },
    { id: 'card-2', type: 'card', title: 'E-Commerce Platform', category: 'Development', date: '2025-01-15', description: 'Full-stack e-commerce solution with real-time inventory management, secure payment processing, and a powerful analytics dashboard for business insights.' },
    { id: 'card-3', type: 'card', title: 'Startup Rebrand', category: 'Branding', date: '2025-02-10', description: 'Complete rebranding for a tech startup transitioning from B2C to B2B market. New visual language, tone of voice, and messaging framework across all touchpoints.' },
    { id: 'card-4', type: 'card', title: 'Mobile Banking App', category: 'Development', date: '2024-12-01', description: 'Intuitive mobile banking experience with biometric authentication, real-time transaction tracking, and smart savings goals. Built with accessibility-first principles.' },
    { id: 'card-5', type: 'card', title: 'Photography Portfolio', category: 'Design', date: '2024-11-20', description: 'Minimalist portfolio website for a professional photographer. Features smooth transitions, lazy-loaded galleries, and a custom CMS for easy content management.' },
    { id: 'card-6', type: 'card', title: 'Restaurant Branding', category: 'Branding', date: '2024-10-08', description: 'Holistic brand experience for a modern Asian fusion restaurant. Menu design, signage, packaging, and social media templates unified under one cohesive visual system.' },
    { id: 'card-7', type: 'card', title: 'Weather Dashboard', category: 'Development', date: '2024-09-15', description: 'Real-time weather dashboard with interactive maps, 7-day forecasts, and severe weather alerts. Responsive design with offline capability via service worker.' },
    { id: 'card-8', type: 'card', title: 'Annual Report Design', category: 'Design', date: '2024-08-22', description: 'Data-driven annual report combining infographics, photography, and clean typography. Designed for both print and interactive PDF formats.' },
    { id: 'card-9', type: 'card', title: 'Fitness Brand Launch', category: 'Branding', date: '2024-07-10', description: 'Full brand launch for a premium fitness brand. Strategy, visual identity, packaging design, and go-to-market campaign materials for digital and physical channels.' },
    { id: 'card-10', type: 'card', title: 'Task Management Tool', category: 'Development', date: '2024-06-28', description: 'Collaborative project management tool with Kanban boards, time tracking, and team analytics. Drag-and-drop interface with real-time sync across devices.' },
    { id: 'card-11', type: 'card', title: 'Music Festival Poster', category: 'Design', date: '2024-05-15', description: 'Vibrant poster series for an international music festival. Bold typography meets psychedelic illustration, inspired by vintage concert posters with a modern twist.' },
    { id: 'card-12', type: 'card', title: 'SaaS Product Naming', category: 'Branding', date: '2024-04-03', description: 'Strategic naming and brand positioning for a B2B SaaS product. Market research, competitor analysis, name generation, and trademark screening.' }
  ];

  window.MasonryData = DATA;
})();
```

- [ ] **Step 2: Add function to render items into the grid**

```javascript
(function () {
  function createItemElement(item) {
    var article = document.createElement('article');
    article.className = 'masonry-item ' + (item.type === 'image' ? 'image-card' : 'text-card');
    article.setAttribute('data-type', item.type);
    article.setAttribute('data-category', item.category.toLowerCase());

    if (item.type === 'image') {
      article.innerHTML =
        '<img src="' + item.imageUrl + '" alt="' + item.title + '" loading="lazy" decoding="async">' +
        '<div class="image-overlay">' +
        '<h3>' + item.title + '</h3>' +
        '<span class="tag">' + item.category + '</span>' +
        '</div>';
    } else {
      article.innerHTML =
        '<h3>' + item.title + '</h3>' +
        '<p>' + item.description + '</p>' +
        '<div class="card-meta">' +
        '<span class="tag">' + item.category + '</span>' +
        '<span class="date">' + formatDate(item.date) + '</span>' +
        '</div>';
    }

    return article;
  }

  function formatDate(dateStr) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var parts = dateStr.split('-');
    return months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }

  window.createItemElement = createItemElement;
})();
```

- [ ] **Step 3: Add Isotope initialization with imagesLoaded**

```javascript
(function () {
  var grid = document.getElementById('masonryGrid');
  var data = window.MasonryData;
  var iso = null;
  var currentContent = 'gallery';
  var currentLayout = 'masonry';

  function getColumnWidth() {
    var slider = document.getElementById('columnSlider');
    var cols = parseInt(slider.value, 10);
    var gap = 16;
    return (grid.offsetWidth - gap * (cols - 1)) / cols;
  }

  function getFilteredItems(mode) {
    if (mode === 'gallery') return data.filter(function (d) { return d.type === 'image'; });
    if (mode === 'cards') return data.filter(function (d) { return d.type === 'card'; });
    return data;
  }

  function renderGrid(items) {
    grid.innerHTML = '';
    items.forEach(function (item) {
      grid.appendChild(window.createItemElement(item));
    });
  }

  function updateColumnWidth() {
    var slider = document.getElementById('columnSlider');
    var cols = parseInt(slider.value, 10);
    var items = grid.querySelectorAll('.masonry-item');
    var gap = 16;
    var width = (grid.offsetWidth - gap * (cols - 1)) / cols;
    items.forEach(function (el) {
      el.style.width = width + 'px';
    });
    if (iso) iso.layout();
  }

  function initIsotope() {
    renderGrid(getFilteredItems(currentContent));
    updateColumnWidth();

    imagesLoaded(grid, function () {
      iso = new Isotope(grid, {
        itemSelector: '.masonry-item',
        layoutMode: currentLayout,
        masonry: {
          columnWidth: '.masonry-item',
          gutter: 16
        },
        percentPosition: false,
        transitionDuration: '0.4s'
      });
    });
  }

  window.MasonryApp = {
    iso: function () { return iso; },
    grid: grid,
    data: data,
    getCurrentContent: function () { return currentContent; },
    getCurrentLayout: function () { return currentLayout; },
    getColumnWidth: getColumnWidth,
    getFilteredItems: getFilteredItems,
    renderGrid: renderGrid,
    updateColumnWidth: updateColumnWidth,
    initIsotope: initIsotope,
    setContent: function (c) { currentContent = c; },
    setLayout: function (l) { currentLayout = l; },
    setIso: function (i) { iso = i; }
  };

  initIsotope();
})();
```

- [ ] **Step 4: Remove the placeholder HTML items**

Delete the `<article>` elements from the `<main>` tag, leaving only:

```html
<main class="masonry-grid" id="masonryGrid"></main>
```

- [ ] **Step 5: Verify in browser**

Refresh `masonry-layout/index.html`. Check:
- 12 image cards + 12 text cards render
- Isotope masonry layout works after images load
- Theme toggle still works

- [ ] **Step 6: Commit**

```bash
git add masonry-layout/index.html
git commit -m "feat: add Isotope initialization with full data set"
```

---

### Task 3: Control Panel Interactivity

**Files:**
- Modify: `masonry-layout/index.html` (inline `<script>`)

Wire up the content type switcher, column slider, and layout mode switcher to Isotope.

- [ ] **Step 1: Add content type switching logic**

```javascript
(function () {
  var pills = document.querySelectorAll('#contentPills .pill-btn');

  pills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pills.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var mode = btn.getAttribute('data-content');
      var app = window.MasonryApp;
      app.setContent(mode);

      var items = app.getFilteredItems(mode);
      app.renderGrid(items);
      app.updateColumnWidth();

      imagesLoaded(app.grid, function () {
        var iso = app.iso();
        if (iso) {
          iso.destroy();
        }
        var newIso = new Isotope(app.grid, {
          itemSelector: '.masonry-item',
          layoutMode: app.getCurrentLayout(),
          masonry: {
            columnWidth: '.masonry-item',
            gutter: 16
          },
          percentPosition: false,
          transitionDuration: '0.4s'
        });
        app.setIso(newIso);
      });
    });
  });
})();
```

- [ ] **Step 2: Add column slider logic**

```javascript
(function () {
  var slider = document.getElementById('columnSlider');
  var valueDisplay = document.getElementById('columnValue');

  slider.addEventListener('input', function () {
    valueDisplay.textContent = slider.value;
    var app = window.MasonryApp;
    app.updateColumnWidth();
  });
})();
```

- [ ] **Step 3: Add layout mode switching logic**

```javascript
(function () {
  var pills = document.querySelectorAll('#layoutPills .pill-btn');

  pills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pills.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var layoutMode = btn.getAttribute('data-layout');
      var app = window.MasonryApp;
      app.setLayout(layoutMode);

      var iso = app.iso();
      if (iso) {
        var opts = {
          transitionDuration: '0.4s'
        };
        if (layoutMode === 'masonry') {
          opts.masonry = { columnWidth: '.masonry-item', gutter: 16 };
        }
        iso.arrange(opts);
        if (iso.options) {
          iso.options.layoutMode = layoutMode;
        }
        iso.layout();
      }
    });
  });
})();
```

- [ ] **Step 4: Verify all controls work**

Refresh and test:
- Content pills switch between Gallery/Cards/Mixed
- Column slider adjusts column count (2-5)
- Layout pills switch between Masonry/FitRows/Grid
- Theme toggle still works
- Control panel opens/closes

- [ ] **Step 5: Commit**

```bash
git add masonry-layout/index.html
git commit -m "feat: wire up content, column, and layout controls to Isotope"
```

---

### Task 4: Responsive Behavior + Debounced Resize

**Files:**
- Modify: `masonry-layout/index.html` (inline `<script>` and `<style>`)

- [ ] **Step 1: Add debounced resize handler**

```javascript
(function () {
  var app = window.MasonryApp;

  function handleResize() {
    app.updateColumnWidth();
    var iso = app.iso();
    if (iso) iso.layout();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 200);
  });
})();
```

- [ ] **Step 2: Add responsive column overrides in CSS**

Add to existing media queries inside `<style>`:

```css
@media (max-width: 1023px) {
  .masonry-item {
    width: calc(50% - 8px) !important;
  }
}

@media (max-width: 639px) {
  .masonry-item {
    width: 100% !important;
  }
}
```

Note: The `!important` ensures responsive overrides take precedence over inline styles set by the slider.

- [ ] **Step 3: Verify responsiveness**

Resize browser window and verify:
- <=639px: 1 column, control panel becomes bottom drawer
- 640-1023px: 2 columns
- >=1024px: slider-controlled columns (2-5)

- [ ] **Step 4: Commit**

```bash
git add masonry-layout/index.html
git commit -m "feat: add responsive behavior and debounced resize"
```

---

### Task 5: Accessibility + Performance Polish

**Files:**
- Modify: `masonry-layout/index.html` (inline `<style>` and `<script>`)

- [ ] **Step 1: Add reduced-motion support**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Add focus-visible styles**

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.pill-btn:focus-visible,
.control-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Add will-change for smooth Isotope animations**

```css
.masonry-item {
  will-change: transform;
}
```

- [ ] **Step 4: Verify accessibility**

- Tab through controls: all focusable
- Enter/Space activates toggle and pills
- Reduced motion disables animations
- Color contrast passes WCAG AA in both themes

- [ ] **Step 5: Final commit**

```bash
git add masonry-layout/index.html
git commit -m "feat: add accessibility and performance polish"
```
