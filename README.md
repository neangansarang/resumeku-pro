# RESUMEKU

[![Deploy to GitHub Pages](https://github.com/neangansarang/resumeku-pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/neangansarang/resumeku-pro/actions/workflows/deploy.yml)

Personal CV & Blog website — vanilla HTML, CSS, and JavaScript. Built as a single-page application with page-switching navigation, a two-column CV layout, and an expandable blog section.

<img width="1774" alt="image" src="https://github.com/user-attachments/assets/787999b0-9eca-4d61-9afd-f45fb04372be" />

## Features

- **Curriculum Vitae** — Two-column layout with sidebar (photo, contact, skills) and main content (experience, education, certifications, projects)
- **Blog** — Card grid with inline article detail panel, powered by a client-side data array
- **Fade transitions** — Smooth page switching animation
- **Responsive design** — Works across desktop viewports
- **No framework** — Pure vanilla HTML/CSS/JS with zero build tooling

## Tech Stack

- HTML5
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter, Lora)
- Font Awesome 6.5

## Quick Start

```bash
git clone https://github.com/neangansarang/resumeku-pro.git
cd resume-asep
open index.html
```

No build step required — just open `index.html` in any browser.

## Project Structure

```
resume-asep/
├── index.html              Entry point
├── css/style.css           All stylesheets
├── js/script.js            JavaScript logic & blog data
├── src/images/             Profile photo & blog thumbnails
├── .github/workflows/      CI/CD pipeline
├── SKILL.md                Maintenance guide
└── ARCHITECTURE.md         Architecture documentation
```

## Deployment

Deployed automatically to **GitHub Pages** via GitHub Actions on every push to `main`.

**Live URL:** [https://neangansarang.github.io/resumeku-pro/](https://neangansarang.github.io/resumeku-pro/)

### One-time repo setup

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

---

Copyright &copy; Asep Septiadi. All rights reserved.
