# Better San Carlos

A civic-tech initiative providing transparent access to municipal services, programs, and public funds of LGU San Carlos City, Pangasinan, Philippines.

![Version](https://img.shields.io/badge/version-1.1.20-green)
![License](https://img.shields.io/badge/license-MIT%20%7C%20CC%20BY%204.0-blue)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Architecture

Better San Carlos is a Next.js 15 + TypeScript application. The legacy static HTML version and separate `react-app/` workspace have been retired; `main` now contains the single active codebase.

## Open Source for LGUs

This repository is open source under the **MIT License** and **CC BY 4.0** and is freely available for use, modification, redistribution, and publication by any individual or organization that wishes to implement it in their respective local government unit (LGU) across the Philippines.

We encourage adoption by other municipalities in support of:

- **Transparency** - Making government information accessible to citizens
- **Accessibility** - Ensuring services are available to all, including persons with disabilities
- **Modernization** - Bringing local government services to digital platforms
- **Public Service** - Improving the delivery of government services to the community

To adapt this project for your LGU, fork the repository and customize the content, styling, and data sources to match your municipality's requirements.

## About

Better San Carlos is a volunteer-driven, open-source project that empowers the people of San Carlos City, Pangasinan with easy access to local government information. The platform aggregates public data from official government portals and presents it in a user-friendly, accessible format.

**Cost to the People of San Carlos City, Pangasinan = ₱0**

## Live Demo

Visit the live website: [https://bettersancarlos.vercel.app](https://bettersancarlos.vercel.app)

## Technology Stack

| Category            | Technologies                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| **Frontend**        | HTML5, CSS3, JavaScript (ES6+)                                         |
| **Styling**         | Custom CSS, CSS Variables, Flexbox, CSS Grid, Responsive Design        |
| **Icons**           | Bootstrap Icons (CDN)                                                  |
| **Fonts**           | Google Fonts (Inter)                                                   |
| **Maps**            | Leaflet.js, OpenStreetMap                                              |
| **Charts**          | Chart.js (Canvas-based)                                                |
| **Animations**      | Lottie (dotlottie-player web component)                                |
| **Data Format**     | JSON                                                                   |
| **APIs**            | Open-Meteo (Weather), ExchangeRate API (Currency)                      |
| **Build Tools**     | Node.js, npm, Bash, Babel (@babel/preset-env)                          |
| **Minification**    | html-minifier-terser, clean-css-cli, terser                            |
| **Code Formatting** | Prettier (auto-format on commit via git pre-commit hook)               |
| **Version Control** | Git, GitHub                                                            |
| **Runtime**         | Bun                                                                    |
| **Server**          | Next.js static export + Apache (.htaccess)                             |
| **Hosting**         | cPanel (Production), Vercel/Node-compatible static hosting             |
| **PWA**             | Serwist service worker, install prompt, offline fallback               |
| **SEO**             | Open Graph, Twitter Cards, XML Sitemap, robots.txt                     |
| **Security**        | HTTPS, CSP Headers, HSTS, X-Frame-Options                              |
| **Analytics**       | Google Analytics (gtag.js)                                             |
| **Accessibility**   | WCAG 2.1, ARIA, Semantic HTML                                          |
| **Performance**     | GZIP Compression, Browser Caching, Asset Minification                  |

## Key Features

| Feature                          | Description                                                                                                                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Municipal Services Directory** | Comprehensive guide to all LGU services with requirements, fees, and processing times                                                                                                                             |
| **Government Officials**         | Directory of elected officials and department heads with contact information                                                                                                                                      |
| **Budget Transparency**          | Financial reports, income/expenditure breakdowns, and infrastructure projects                                                                                                                                     |
| **Legislative Documents**        | Searchable database of ordinances and resolutions from Sangguniang Bayan                                                                                                                                          |
| **Municipal Statistics**         | Demographics, economic data, and competitive index rankings                                                                                                                                                       |
| **Appointment Services**         | Online appointment scheduling integration with the Mayor's Office (OASYS), featuring branded Lottie animation                                                                                                     |
| **San Carlos Quiz**                  | Interactive quiz about San Carlos City, Pangasinan history and culture, linked from homepage CTA and footer across all pages                                                                                       |
| **Real-time Information**        | Live weather updates, currency exchange rates, and Philippine time                                                                                                                                                |
| **Emergency Hotline Marquee**    | Clickable scrolling marquee for emergency contacts on tablet and mobile viewports, with pause-on-hover/focus accessibility                                                                                        |
| **Progressive Web App**          | Installable PWA with "Install App" prompt, seamless auto-updates via skipWaiting (no manual refresh), versioned service worker caching (static + runtime), offline fallback page with emergency hotlines, push notification foundation |
| **Auto Version Management**      | Dynamic version display from `version.json`, auto-bumped on every git commit via pre-commit hook, synced across all 51+ HTML files, `package.json`, and React app                                                 |
| **Multi-language Support**       | Full i18n coverage in English, Filipino, and Cebuano (5,546 keys per language with perfect parity)                                                                                                                |
| **Clean URLs**                   | SEO-friendly URLs without `.html` extensions, powered by Apache mod_rewrite                                                                                                                                       |
| **Brief History of San Carlos City, Pangasinan** | Interactive timeline with fully translated cards in all three languages                                                                                                                                       |
| **Mobile Navigation**            | Responsive menu with GPU-accelerated open/close transitions, body scroll lock, animation guard against rapid toggles, debounced resize handling, touch-safe hover scoping, click-outside-to-close, and focus trap |
| **Accessibility**                | WCAG 2.1 compliant with skip links, ARIA labels, keyboard navigation, and semantic HTML                                                                                                                           |
| **SEO Optimized**                | Meta tags, Open Graph, Twitter Cards, structured data, and XML sitemap                                                                                                                                            |
| **Performance**                  | 90%+ size reduction through minification, GZIP compression, Babel transpilation, and browser caching                                                                                                              |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/BetterSanCarlos/bettersancarlos.git

# Navigate to project directory
cd bettersancarlos

# Install dependencies
bun install

# Start development server
bun dev

# Open in browser
# http://localhost:3000
```

## Installation

### Prerequisites

| Requirement | Version | Purpose                            |
| ----------- | ------- | ---------------------------------- |
| Bun         | v1.3+   | Runtime and package manager        |
| Git         | Latest  | Version control                    |

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/BetterSanCarlos/bettersancarlos.git
cd bettersancarlos
```

2. **Install dependencies**

```bash
bun install
```

3. **Start the development server**

```bash
bun dev
```

4. **Open in browser**
   - Development: http://localhost:3000
   - Production preview: http://localhost:8080 (after `bash build.sh`)

## Usage

### Development Commands

| Command                      | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| `npm run dev`                | Start local development server (port 8000)                            |
| `npm run build`              | Build minified production files to `dist/` (auto-bumps patch version) |
| `npm run build -- --no-bump` | Build without incrementing the version number                         |
| `npm run build:minor`        | Bump minor version and build                                          |
| `npm run build:major`        | Bump major version and build                                          |
| `npm run serve:dist`         | Serve production build (port 8080)                                    |
| `npm run version:check`      | Display current version                                               |
| `npm run version:patch`      | Bump patch version only                                               |
| `npm run version:minor`      | Bump minor version only                                               |
| `npm run version:major`      | Bump major version only                                               |
| `npm run format`             | Format all files with Prettier                                        |
| `npm run format:check`       | Check formatting without writing changes                              |

### Production Deployment

1. **Build production files**

```bash
npm run build
```

2. **Output location**
   - Minified files are generated in the `dist/` folder
   - Original size: ~17MB → Minified: ~3.9MB

3. **Deploy to server**
   - Upload contents of `dist/` to your web server's `public_html` directory
   - Ensure `.htaccess` is included for clean URLs, CSP headers, and security

### File Permissions (cPanel)

| Type        | Permission | Numeric |
| ----------- | ---------- | ------- |
| Files       | rw-r--r--  | 644     |
| Directories | rwxr-xr-x  | 755     |

## Multi-language Support (i18n)

The site supports three languages with full translation coverage:

| Language | Code  | Status                |
| -------- | ----- | --------------------- |
| English  | `en`  | Complete (5,546 keys) |
| Filipino | `fil` | Complete (5,546 keys) |
| Cebuano  | `ceb` | Complete (5,546 keys) |

The static site uses a `TranslationEngine` in `assets/js/translations.js` with `data-i18n` attributes on HTML elements. The React version uses a `LanguageContext` provider with a `t()` function. Both systems support fallback to English for any missing keys.

## Three-Version Architecture

The project maintains three synchronized versions:

| Version                | Location        | Purpose                              |
| ---------------------- | --------------- | ------------------------------------ |
| **Static Legacy**      | Root HTML files | Source of truth for all 52 pages     |
| **React + TypeScript** | `react-app/`    | Modern component-based homepage      |
| **Production Dist**    | `dist/`         | Minified build for cPanel deployment |

All CSS, images, animations, and translations are kept in sync. The build script (`build.sh`) generates the production `dist/` from the Next.js static export.

## Project Structure

```
bettersancarlos/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   └── contexts/         # React Context providers
├── public/               # Static assets and JSON data
│   ├── assets/           # Stylesheets, images, animations
│   └── data/             # Municipal data files
├── package.json
├── next.config.mjs
└── tsconfig.json
│   ├── ordinances.json   # Legislative ordinances
│   └── resolutions.json  # Legislative resolutions
├── react-app/            # React + TypeScript version
│   ├── src/
│   │   ├── app/          # Next.js app router (layout, page)
│   │   ├── components/   # React components (Header, Footer, HotlineBar, InfoBar, SearchAutocomplete, PWAManager)
│   │   └── contexts/     # LanguageContext (i18n provider)
│   └── public/           # Static assets, manifest, version.json (synced with root)
├── services/             # Service category pages (11 pages)
├── service-details/      # Individual service pages (22 pages)
├── government/           # Government directory pages
├── legislative/          # Legislative framework pages
├── budget/               # Budget transparency page
├── statistics/           # Municipal statistics page
├── news/                 # News and announcements page
├── contact/              # Contact information page
├── faq/                  # Frequently asked questions
├── sitemap/              # HTML sitemap page
├── scripts/              # Build, version, and translation scripts
│   └── bump-version.js   # Cross-platform Node.js version bump script
├── dist/                 # Production build output (gitignored)
├── index.html            # Homepage
├── sw.js                 # Service worker (versioned caching, offline support)
├── manifest.webmanifest  # PWA web app manifest
├── offline.html          # Offline fallback page with emergency hotlines
├── serve.py              # Local dev server with clean URL rewriting
├── .htaccess             # Apache configuration (CSP, rewrites, caching)
├── .prettierrc           # Prettier code formatting configuration
├── .prettierignore       # Prettier ignore patterns
├── version.json          # Version tracking (auto-bumped on commit)
├── build.sh              # Build automation script
├── babel.config.json     # Babel transpilation configuration
├── package.json          # Node.js configuration
└── README.md             # Project documentation
```

## Recent Changes

### v1.1.15 — Header, PWA, Version Automation & Code Quality

#### PWA Install Prompt & Seamless Updates

- Added "Install App" prompt banner using the `beforeinstallprompt` API with Install/Dismiss buttons, respecting standalone mode and session dismissal
- Replaced manual-refresh update flow with seamless `skipWaiting` + `controllerchange` auto-reload pattern
- Service worker now accepts `SKIP_WAITING` message from clients to activate waiting worker on demand
- Install banner goes full-width (no border-radius, no margins) on mobile viewports (<=575px) with slide-up animation
- Created `PWAManager.tsx` React component handling both install prompt and SW update lifecycle
- Added `.pwa-install-banner` CSS styles to both static and React versions

#### Footer Mobile Alignment

- Added `text-align: center` for `.footer-tagline` in the <=575px mobile breakpoint, overriding the tablet `text-align: left` rule
- Synced footer CSS fix to React version

#### CI/CD Cleanup

- Removed CodeQL Advanced workflow (`.github/workflows/codeql.yml`) as it is no longer required

#### Responsive Header & Hotline Marquee

- Standardized header vertical spacing (padding, min-height, logo size) across desktop (12px/48px), tablet (10px/40px), mobile (8px/36px), and small mobile (6px/32px) breakpoints
- Raised tablet breakpoint from 991px to 1024px to properly capture iPad Pro portrait (1024px) and iPad Air landscape
- Converted emergency hotline bar into a clickable scrolling marquee on all tablet and mobile viewports (≤1024px) with pause-on-hover/focus for accessibility
- Centered hamburger menu icon between logo and language toggle on tablet viewports using flexbox ordering (logo → hamburger → lang toggle)
- Tablet footer: left-aligned BetterSanCarlos logo, tagline, and social icons to match the visual hierarchy of the brand column

#### Progressive Web App (PWA)

- Replaced legacy `sw.js` with Serwist-generated service worker via `@serwist/next`
- Precaches the app shell and uses runtime caching with offline fallback to `~offline`
- Manifest generated by Next.js metadata API at `/manifest.json`
- Service worker source at `src/app/sw.ts`

#### Automatic Version Management

- `scripts/bump-version.js` updates `version.json` and `package.json`
- Footer version displayed dynamically at runtime via `version.js` fetching from `/version.json`

#### React / Next.js App

- Single Next.js 15 application now lives at repository root
- Replaced legacy static HTML and separate `react-app/` directory
- Development server uses `bun dev` on port 3000
- Static export produces clean URLs under `out/`; `build.sh` packages the final `dist/`

#### Code Quality & Tooling

- Migrated package manager from npm to Bun
- Next.js static export with clean URLs
- Serwist PWA integration

### Previous Changes

*Historical release notes for the original static HTML and legacy React app have been archived in the git history.*

### Cross-Version Sync

- All CSS files synced between legacy and React: `footer.css`, `style.css`, `responsive.css`, `accessibility.css`
- All image and animation assets synced between legacy and React
- React LanguageContext updated with matching translation keys for homepage sections

## Contributing

We welcome contributions from everyone! Whether you're a developer, designer, data researcher, content writer, translator, or a concerned citizen of San Carlos City, Pangasinan, your participation helps shape this project for all.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make** your changes
4. **Test** thoroughly on multiple browsers
5. **Commit** with a descriptive message
   ```bash
   git commit -m "Add: description of your changes"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open** a Pull Request with detailed description

### Contribution Areas

| Area                   | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| **Bug Fixes**          | Report issues or submit fixes for existing bugs               |
| **Features**           | Propose or implement new functionality                        |
| **Content**            | Update service information, add missing municipal data        |
| **Translations**       | Help translate content to Filipino or Cebuano                 |
| **Design**             | Improve UI/UX, accessibility, and visual consistency          |
| **Data**               | Verify and update municipal statistics and records            |
| **Documentation**      | Enhance README, code comments, and guides                     |
| **API Integration**    | Propose or implement API connections for real-time data feeds |
| **Data Visualization** | Enhance charts, graphs, and interactive presentations         |

### Code Style Guidelines

| Guideline         | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| **Formatting**    | Prettier auto-formats on commit; run `bun run format` to format manually |
| **HTML**          | Use semantic HTML5 elements; validate before committing                  |
| **CSS**           | Follow BEM naming conventions; use CSS custom properties                 |
| **JavaScript**    | Keep vanilla JS unless proposing framework for data visualization        |
| **Naming**        | Use meaningful, descriptive variable and function names                  |
| **Comments**      | Add comments for complex logic and non-obvious implementations           |
| **Accessibility** | Ensure WCAG 2.1 compliance (alt text, ARIA, keyboard navigation)         |
| **Performance**   | Optimize images; minimize DOM manipulation                               |
| **Testing**       | Test on Chrome, Firefox, Safari, Edge; test mobile responsiveness        |
| **Validation**    | Validate HTML/CSS before pull requests                                   |

## Data Sources

All public information is sourced from official government portals:

| Source                             | URL                                                                       | Data Type                 |
| ---------------------------------- | ------------------------------------------------------------------------- | ------------------------- |
| LGU San Carlos Official Website        | [sancarlospangasinan.gov.ph](https://sancarlospangasinan.gov.ph/)                                           | Services, Officials       |
| Sangguniang Bayan ng San Carlos        | [sangguniangbayan.sancarlospangasinan.gov.ph](https://sangguniangbayan.sancarlospangasinan.gov.ph/)         | Ordinances, Resolutions   |
| Bureau of Local Government Finance | [blgf.gov.ph](https://blgf.gov.ph/)                                       | Budget, Financial Reports |
| Philippine Statistics Authority    | [psa.gov.ph](https://psa.gov.ph/)                                         | Demographics, Census      |
| DTI CMCI Portal                    | [cmci.dti.gov.ph](https://cmci.dti.gov.ph/)                               | Competitive Index         |

## License

This project is dual-licensed:

| License     | Applies To  | Details                                |
| ----------- | ----------- | -------------------------------------- |
| MIT License | Source Code | Free to use, modify, and distribute    |
| CC BY 4.0   | Content     | Attribution required for content reuse |

See [LICENSE](LICENSE) for full details.

## Contact

| Channel  | Link                                                                      |
| -------- | ------------------------------------------------------------------------- |
| Website  | [bettersancarlos.vercel.app](https://bettersancarlos.vercel.app)                              |
| Email    | volunteer@bettersancarlos                                                |
| Facebook | [@bettersancarlos](https://www.facebook.com/bettersancarlos)            |
| LinkedIn | [BetterSanCarlos](https://www.linkedin.com/company/bettersancarlos/)            |
| Discord  | [Join Community](https://discord.com/invite/qeSu7RJkjQ)                   |
| GitHub   | [BetterSanCarlos/bettersancarlos](https://github.com/BetterSanCarlos/bettersancarlos) |

## Acknowledgments

- [BetterGov.ph](https://bettergov.ph) for the civic-tech initiative in the Philippines
- [Abakada.org](https://abakada.org) for supporting civic technology efforts
- LGU San Carlos for public data availability and transparency
- All volunteers and contributors who dedicate their time
- Open-source community for the tools and libraries used
- Citizens of San Carlos for their feedback and support

---

Made for the people of San Carlos City, Pangasinan

## Developer

[Edison](https://edisonmalasan.me/) is a UAE-based full-stack developer and IT professional specializing in web development, design, cloud services, and cybersecurity. He is the developer behind Better San Carlos, [Abakada.org](https://abakada.org), and the founder of the small cloud-based solutions initiative, [HelloPinas.com](https://hellopinas.com). Edison actively contributes to civic-tech efforts like [BetterGov.ph](https://bettergov.ph) and is an individual participant in the [OpenJS Foundation](https://openjsf.org/).
