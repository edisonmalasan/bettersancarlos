# Announcement: Next.js + TypeScript Migration Complete

## Summary

Better San Carlos has completed its migration to a single Next.js + TypeScript application at the repository root. The legacy static HTML version and the separate `react-app/` workspace have been retired. The `main` branch now contains the active Next.js codebase.

## Open Source Availability

This repository is open source under the **MIT License** and **CC BY 4.0** and is freely available for use, modification, redistribution, and publication by any individual or organization that wishes to implement it in their respective local government unit (LGU) across the Philippines.

We encourage other municipalities to adopt and customize this project in support of transparency, accessibility, modernization, and public service delivery to their communities.

## Background

Better San Carlos was originally built with static HTML, CSS, and vanilla JavaScript to ensure maximum accessibility and simplicity. As the project has grown and more contributors have joined, we received feedback requesting modern tooling support.

The current Next.js + TypeScript application addresses these requests while preserving the original content, design values, and civic-first focus.

## What This Means for Contributors

### New Default Workflow

All contributions now target the `main` branch Next.js app. The previous parallel branches and directories are no longer maintained.

### Getting Started

```bash
git clone https://github.com/BetterSanCarlos/bettersancarlos.git
cd bettersancarlos
bun install
bun dev
```

Open http://localhost:3000 in your browser.

## Version Comparison

| Aspect          | Legacy Static HTML  | Next.js + TypeScript         |
| --------------- | ------------------- | ---------------------------- |
| Technology      | HTML5, CSS3, JS     | Next.js 15, React 18, TS     |
| Build Required  | No                  | Yes (bun)                    |
| Type Safety     | No                  | Yes                          |
| Component Reuse | Manual              | Built-in                     |
| PWA             | Legacy sw.js        | Serwist                      |
| Status          | Retired             | Active                       |

## Timeline

| Phase      | Timeframe  | Description                                                   |
| ---------- | ---------- | ------------------------------------------------------------- |
| Completed  | July 2026  | Static HTML and `react-app/` merged to root Next.js app       |
| Completed  | July 2026  | Bun runtime + Serwist PWA adopted                             |
| Ongoing    | Now        | Content and branding alignment for San Carlos City, Pangasinan            |

## Providing Feedback

We welcome feedback on the new architecture. Please:

- Open an issue on GitHub
- Join the discussion in our Discord community
- Email volunteer@bettersancarlos.vercel.app with questions

## Acknowledgments

Thank you to all contributors who have helped build Better San Carlos. Your continued participation is valued and appreciated. Shout out to Gat. @jasontorres for the support!

Edison
Better San Carlos
