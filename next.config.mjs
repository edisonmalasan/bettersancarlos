import { spawnSync } from 'node:child_process';
import withSerwistInit from '@serwist/next';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ||
  crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  // Do not precache the JSON data folder or symlinks if present
  exclude: [/\/_next\/dynamic/, /\.map$/, /^data\//, /^assets\/js\/(translations|main)\.js$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = withSerwist({
  output: 'export',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  env: {
    SITE_URL: process.env.SITE_URL || 'https://bettersancarlos.vercel.app',
  },
});

export default nextConfig;
