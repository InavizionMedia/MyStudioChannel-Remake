# MyStudioChannel-Remake

> **Your Content. Your Channel. Your Studio.** — a rebuild of My Studio Channel's creator-platform site.

[![GitHub Pages](https://github.com/agentzlab/MyStudioChannel-Remake/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/agentzlab/MyStudioChannel-Remake/actions/workflows/pages/pages-build-deployment)
![Last commit](https://img.shields.io/github/last-commit/agentzlab/MyStudioChannel-Remake)
![Repo size](https://img.shields.io/github/repo-size/agentzlab/MyStudioChannel-Remake)
![Static site](https://img.shields.io/badge/site-static-blue)

**Live preview:** https://agentzlab.github.io/MyStudioChannel-Remake/

## Hero

*Screenshot lands with the first build — the hero shot always represents the current state of the page, and right now this repo is the launchpad, not the site yet.*

## What's inside

A from-scratch remake of [mystudiochannel.com](https://mystudiochannel.com/) — Jon's "My Studio Channel" creator-platforms site. The current site sells studio-style websites for creators ("the look and structure of a major network — powered by a custom plugin, built once and owned by you").

The remake direction is being decided by a **bake-off**: Trinity and Ravyn are each building a demo from the Baseline site template, and Jon picks the winner. The winning patterns get applied here. See `docs/reference.md` for the source-site notes and bake-off context.

## Design language

- Near-black grounds, warm gold/amber accents (carried over from the current site's identity)
- Big confident display type, generous whitespace
- Dark-mode first — no light theme planned

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Single static `index.html` (remake target) |
| Styling | Hand-written CSS, no framework |
| Motion | Vanilla JS + rAF springs |
| Hosting | GitHub Pages (this repo, `main`) |

The source site (`jonbeatz/MyStudioChannel`, private) is Next.js + Payload CMS. The remake is a static rebuild — no CMS, no build step.

## Project structure

```
MyStudioChannel-Remake/
├── index.html          # the remake (lands after the bake-off)
├── assets/
│   └── screenshot.png  # dark-mode hero shot, refreshed on every build
├── docs/
│   └── reference.md    # source-site notes + bake-off context
├── .nojekyll
└── README.md
```

## Workflow

Branch-based changes, no direct pushes to `main` for feature work — except Jon's explicit live-feedback loops. No PRs unless Jon asks. Screenshots and the README hero stay current with every build change.
