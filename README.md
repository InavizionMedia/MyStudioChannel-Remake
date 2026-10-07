# MyStudioChannel-Remake
**Branch policy:** work happens on the latest version branch — list all branches first, never assume the GitHub default is current. Working line: `main`.

> **Your Content. Your Channel. Your Studio.** — a cinematic rebuild of My Studio Channel's creator-platform site.

[![GitHub Pages](https://github.com/InavizionMedia/MyStudioChannel-Remake/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/InavizionMedia/MyStudioChannel-Remake/actions/workflows/pages/pages-build-deployment)
![Last commit](https://img.shields.io/github/last-commit/InavizionMedia/MyStudioChannel-Remake)
![Repo size](https://img.shields.io/github/repo-size/InavizionMedia/MyStudioChannel-Remake)
![Static site](https://img.shields.io/badge/site-static-blue)

**Live preview:** https://inavizionmedia.github.io/MyStudioChannel-Remake/

![MyStudioChannel remake — dark cinematic hero](assets/screenshot.png?v=20261007d)

## What's inside

A from-scratch remake of [mystudiochannel.com](https://mystudiochannel.com/) — Jon's "My Studio Channel" creator-platforms site. It sells studio-style websites for creators: "the look and structure of a major network — powered by a custom plugin, built once and owned by you."

This build applies the winning patterns from the **DigitalStudioz Baseline bake-off** (Trinity's entry won Jon's verdict): the loader curtain + progress reveal, word-stagger hero typography, ghost display headings, scroll parallax, fullscreen menu overlay, consultation modal — all rebuilt in MSC's own near-black/gold identity with generated cinematic imagery throughout.

All copy is the real thing, pulled verbatim from the live site and the private source repo (`InavizionMedia/MyStudioChannel-Original-Site`): the 4-slide hero carousel, stats band (21+ / 100% / 24/7 / $0), packages ($5,800 / $10,800 Most Popular / $18,800), the 5 demos, 4 real testimonials, 4-step process, experience/lineage, FAQ with real answers, and contact details.

## Design language

- Near-black grounds, warm gold/amber accents (carried over from the current site's identity)
- Big confident display type, ghost numerals, generous whitespace
- Broadcast-studio imagery: control rooms, desks, stage lighting — gold on black
- Dark-mode first — no light theme planned

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Single self-contained `index.html` (exported from the Muse web artifact) |
| Styling | Hand-written CSS, custom properties |
| Motion | Vanilla JS spring/reveal helpers (Baseline-pattern) |
| Imagery | AI-generated cinematic plates, inlined |
| Hosting | GitHub Pages (this repo, `main`) |

The source site (`InavizionMedia/MyStudioChannel-Original-Site`, private) is Next.js + Payload CMS. The remake is a static rebuild — no CMS, no build step. Demo only.

## Project structure

```
MyStudioChannel-Remake/
├── index.html          # the remake
├── assets/
│   └── screenshot.png  # dark-mode hero shot, refreshed on every build
├── docs/
│   └── reference.md    # source-site notes + bake-off context
├── .nojekyll
└── README.md
```

## Workflow

Branch-based changes, no direct pushes to `main` for feature work — except Jon's explicit live-feedback loops. No PRs unless Jon asks. Screenshots and the README hero stay current with every build change.
