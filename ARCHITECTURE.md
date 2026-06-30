# Architecture — RESUMEKU

## Overview

RESUMEKU is a **vanilla Single-Page Application (SPA)** built entirely with HTML, CSS, and JavaScript. There is no framework, bundler, or build step — the site runs directly from static files.

The application has two pages (CV and Blog) that are switched client-side by showing/hiding `<div>` sections. Blog content is stored as a JavaScript array and rendered dynamically.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6.5 (CDN) |
| Fonts | Google Fonts — Inter (sans-serif), Lora (serif) |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Directory Structure

```
resume-asep/
├── index.html                 Root HTML document
├── css/
│   └── style.css              All styles (single file)
├── js/
│   └── script.js              All JavaScript (blog data, DOM manipulation)
├── src/
│   └── images/
│       ├── photo_profile.jpg  Profile photograph
│       ├── blog-react.svg     Blog thumbnail — React
│       ├── blog-docker.svg    Blog thumbnail — Docker
│       ├── blog-security.svg  Blog thumbnail — Security
│       ├── blog-design.svg    Blog thumbnail — Design System
│       ├── blog-career.svg    Blog thumbnail — Career
│       └── blog-ai.svg        Blog thumbnail — AI & Tech
├── .github/
│   └── workflows/
│       └── deploy.yml         GitHub Actions deploy workflow
├── README.md                  Project overview
├── SKILL.md                   Maintenance & contribution guide
└── ARCHITECTURE.md            This document
```

---

## Component Hierarchy

```
body
├── .navbar                          Sticky top navigation
│   ├── .nav-brand                   Logo "AS"
│   └── .nav-links
│       ├── .nav-link (CV)           Switch to CV page
│       └── .nav-link (Blog)         Switch to Blog page
│
└── .page.active (#page-cv / #page-blog)
    │
    ├── #page-cv
    │   └── .book-wrapper            Flex container
    │       ├── .cv-card             CSS Grid: 248px | 1fr
    │       │   ├── .sidebar         Left column (248px)
    │       │   │   ├── .profile-photo-wrap
    │       │   │   │   └── img.profile-photo
    │       │   │   ├── .sidebar-name
    │       │   │   ├── .sidebar-title
    │       │   │   ├── .contact-section
    │       │   │   │   └── .contact-item × N
    │       │   │   ├── .social-section
    │       │   │   │   └── .social-grid > .social-item × N
    │       │   │   ├── .skills-section
    │       │   │   │   └── .skill-item × N (label + bar)
    │       │   │   └── .abilities-section
    │       │   │       └── .ability-tag × N
    │       │   │
    │       │   └── .cv-main          Right column (1fr)
    │       │       ├── .main-header  Name + role
    │       │       ├── .profile-text About me
    │       │       ├── .exp-item × N Work experience
    │       │       ├── .edu-item × N Education
    │       │       ├── .cert-grid    Certifications (2-col grid)
    │       │       └── .project-grid Projects (2-col grid)
    │       │
    │       └── .cv-card-right       Right card (flex: 1)
    │           ├── .achieve-item × N Awards
    │           ├── .skill-item × N  Language skills
    │           └── .interest-tag × N Interests
    │
    └── #page-blog
        └── .blog-page
            ├── .blog-header         Title + subtitle
            └── .blog-layout         Flex container
                ├── .blog-grid       Post cards (rendered by JS)
                └── .post-detail-wrap
                    └── .post-detail  Article detail panel
                        ├── .post-detail-close     Close button
                        ├── .post-detail-category
                        ├── .post-detail-title
                        ├── .post-detail-meta
                        └── .post-detail-body      Article content

```

---

## Data Flow

### Page Switching

```
User clicks nav-link
       │
       ▼
switchPage(pageId, event)
       │
       ├── Remove .active from all .page and .nav-link
       ├── Add .active to target page and nav-link
       └── CSS animation .fadeIn plays (opacity + translateY)
```

### Blog Rendering

```
DOMContentLoaded
       │
       ▼
renderBlog()
       │
       ├── Iterates posts[] array
       ├── Creates HTML card for each post
       └── Appends to #blog-grid
```

### Blog Detail

```
User clicks "Baca Artikel" on a card
       │
       ▼
openPost(index)
       │
       ├── Sets .post-detail content from posts[index]
       ├── Adds .open class to .post-detail-wrap
       ├── Hides other blog cards (display: none)
       └── Shows detail panel (slide-in)

User clicks close (X) button
       │
       ▼
closePost()
       │
       ├── Removes .open from .post-detail-wrap
       ├── Restores all blog cards
       └── Scrolls back to grid
```

### Blog Data Structure

```javascript
const posts = [
  {
    img: 'src/images/blog-xxx.svg',
    category: 'Tutorial',
    title: 'Judul Artikel',
    excerpt: 'Ringkasan...',
    date: '10 Juni 2025',
    readTime: '8 menit',
    content: `<p>HTML content...</p>`
  }
  // ...
];
```

All blog content is defined in `js/script.js`. To add an article, append a new object to the `posts` array.

---

## Styling Architecture

### CSS Custom Properties (Theme)

All colors are defined as CSS variables in `:root` using a **Stone + Sage** palette:

| Variable | Usage |
|----------|-------|
| `--stone-50` to `--stone-900` | Neutral warm-gray scale |
| `--sage`, `--sage-light`, `--sage-mid` | Green-gray accent |
| `--sidebar-bg` | Sidebar background |
| `--text`, `--muted`, `--border` | Semantic aliases |
| `--shadow` | Card shadows |

To change the theme, update the variable values in `:root`.

### Layout Techniques

| Technique | Usage |
|-----------|-------|
| CSS Grid | `.cv-card` (two columns), `.cert-grid`, `.project-grid`, `.social-grid` |
| Flexbox | `.book-wrapper`, `.cv-main`, `.exp-header`, `.blog-layout`, `.navbar` |
| Sticky positioning | `.navbar` (`top: 20px`) |

### Visual Effects

| Effect | Implementation |
|--------|---------------|
| Page fade transition | `@keyframes fadeIn` (opacity 0→1, translateY 10px→0) |
| Page-fold corner | `.cv-card::after` with `clip-path: polygon` |
| Watermark background | SVG data URI in `body` background-image |
| Skill bars | `.skill-fill` with inline `width:%` |
| Pill badges | `.edu-year`, `.exp-period` (border, radius, padding) |
| Section dividers | `::after` pseudo-element on `.main-section-title` / `.sidebar-section-title` |

---

## External Dependencies

| Dependency | Purpose | Loaded Via |
|------------|---------|------------|
| **Inter** (Google Font) | Primary sans-serif font | `<link>` in `<head>` |
| **Lora** (Google Font) | Serif accent font | `<link>` in `<head>` |
| **Font Awesome 6.5** | Icons | CDN stylesheet |
| **Google Fonts API** | Font serving | External HTTP |

**Note:** Internet connection is required for fonts and icons to render correctly.

---

## CI/CD Pipeline

### Trigger

- **Automatic:** Every push to `main` branch
- **Manual:** Via `workflow_dispatch` from GitHub Actions tab

### Steps

1. **actions/checkout@v4** — Clone repository
2. **actions/configure-pages@v5** — Configure GitHub Pages environment
3. **actions/upload-pages-artifact@v3** — Upload entire project as deploy artifact
4. **actions/deploy-pages@v4** — Deploy artifact to GitHub Pages

### Why no build step?

The project is pure static files (HTML/CSS/JS). No bundler, transpiler, or preprocessor is involved. The raw files are deployed as-is.

### Infrastructure

- **Host:** GitHub Pages (free static hosting)
- **Domain:** `https://neangansarang.github.io/resumeku-pro/`
- **Artifact storage:** GitHub Actions artifact (ephemeral per workflow run)

---

## Maintenance Principles

1. **No framework lock-in** — Easy to migrate or extend since there are zero dependencies beyond CDN fonts/icons
2. **CSS variables-first** — Change theme globally by editing `:root` variables
3. **Data-driven blog** — Adding articles requires only appending to a JS array; no HTML changes needed
4. **Separation of concerns** — HTML (structure), CSS (presentation), JS (behavior) in separate files
