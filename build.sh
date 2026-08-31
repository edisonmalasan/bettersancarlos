#!/bin/bash
# BetterSanCarlos — Production Build Script
# Usage:
#   bash build.sh            — bump patch, build Next.js app
#   bash build.sh --no-bump  — keep current version, build Next.js app
#   bash build.sh minor      — bump minor, build Next.js app
#   bash build.sh major      — bump major, build Next.js app

set -e

BUMP_TYPE="patch"
SKIP_BUMP=false

for arg in "$@"; do
    case $arg in
        --no-bump) SKIP_BUMP=true ;;
        major|minor|patch) BUMP_TYPE=$arg ;;
    esac
done

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   BetterSanCarlos — Production Build          ║"
echo "╚══════════════════════════════════════════╝"

# ── 1. Version (single source of truth: version.json) ────────────────────────
echo ""
echo "▶ [1/5] Version management..."
if [ "$SKIP_BUMP" = false ]; then
    node scripts/bump-version.js "$BUMP_TYPE"
else
    echo "  Skipping bump (--no-bump). Current: $(node -e "console.log(require('./version.json').version)")"
fi

VERSION=$(node -e "console.log(require('./version.json').version)")

# ── 2. Install dependencies ────────────────────────────────────────────────────
echo ""
echo "▶ [2/5] Installing dependencies..."
if [ -f "bun.lockb" ] || command -v bun >/dev/null 2>&1; then
    bun install
else
    npm install
fi

# ── 3. Build Next.js app ─────────────────────────────────────────────────────
echo ""
echo "▶ [3/5] Building Next.js app..."
if command -v bun >/dev/null 2>&1; then
    bun run build
else
    npm run build
fi

# ── 4. Prepare dist from Next.js export ──────────────────────────────────────
echo ""
echo "▶ [4/5] Preparing dist/..."
rm -rf dist
mkdir -p dist
cp -r out/* dist/
cp .serve/serve.json dist/serve.json

# ── 5. Minify root-level HTML files ─────────────────────────────────────────
echo ""
echo "▶ [5/5] Minifying HTML..."
find dist -name "*.html" -not -path "dist/_next/*" -type f | while read -r file; do
    npx --yes html-minifier-terser \
        --collapse-whitespace \
        --remove-comments \
        --remove-optional-tags \
        --remove-redundant-attributes \
        --remove-script-type-attributes \
        --remove-style-link-type-attributes \
        --minify-css true \
        --minify-js true \
        -o "$file" "$file" 2>/dev/null || true
done
echo "  HTML minified."

# ── 6. cPanel file permissions (755 dirs / 644 files) ────────────────────────
echo ""
echo "▶ [6/6] Setting cPanel file permissions..."
find dist -type d -exec chmod 755 {} \;
find dist -type f -exec chmod 644 {} \;
echo "  Directories: 755 | Files: 644"

# ── Summary ───────────────────────────────────────────────────────────────────
DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "N/A")

echo ""
echo "╔══════════════════════════════════════════╗"
printf  "║  ✓ Build complete!  v%-20s║\n" "${VERSION}"
echo "╠══════════════════════════════════════════╣"
printf  "║  Dist:   %-31s║\n" "${DIST_SIZE}"
echo "╠══════════════════════════════════════════╣"
echo "║  Upload dist/ → cPanel public_html/      ║"
echo "║  Preview: cd dist && npx serve -s .       ║"
echo "╚══════════════════════════════════════════╝"
echo ""
