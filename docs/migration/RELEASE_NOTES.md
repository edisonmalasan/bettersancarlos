# Release Notes: Next.js + TypeScript Migration

**Version:** 1.1.20  
**Branch:** main  
**Date:** July 2026

## Overview

This release completes the migration of Better San Carlos to a single Next.js + TypeScript application at the repository root. The legacy static HTML site, the separate `react-app/` directory, and the Python development server have been retired.

## Technology Stack

| Component  | Technology                       |
| ---------- | -------------------------------- |
| Framework  | Next.js 15 (App Router)          |
| Language   | TypeScript                       |
| UI Library | React 18                         |
| Runtime    | Bun                              |
| PWA        | Serwist                          |
| Styling    | CSS (shared legacy stylesheets)  |
| Icons      | Bootstrap Icons                  |
| State      | React Context API                |

## Features

All features from the original static HTML version remain available:

- Municipal Services Directory with search functionality
- Government Officials directory
- Budget and Financial Transparency reports
- Legislative documents (Ordinances and Resolutions)
- Municipal Statistics and demographic data
- Real-time weather and currency information
- Multi-language support (English, Filipino, Cebuano)
- WCAG 2.1 accessibility compliance

## New Capabilities

| Feature                | Description                                  |
| ---------------------- | -------------------------------------------- |
| Type Safety            | TypeScript catches errors at compile time    |
| Component Architecture | Reusable components reduce duplication       |
| Static Export          | Clean URLs, no `.html` extensions            |
| Bun Runtime            | Faster installs and faster dev server        |
| Serwist PWA            | Modern service worker with offline fallback  |

## Installation

```bash
git clone https://github.com/BetterSanCarlos/bettersancarlos.git
cd bettersancarlos
bun install
bun dev
```

## Production Build

```bash
bash build.sh
npx serve -s dist -p 8080
```

## Documentation

- [MIGRATION.md](../../MIGRATION.md) - Migration guide for contributors
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines

## Feedback

Report issues or provide feedback:

- GitHub Issues
- Discord community
- Email: volunteer@bettersancarlos.vercel.app

## Contributors

Thank you to all contributors who helped develop this version.

---

Edison
Better San Carlos
