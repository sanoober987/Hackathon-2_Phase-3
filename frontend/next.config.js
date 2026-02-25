/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Webpack file watcher: stable settings for WSL2 / Windows ──────────────
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Polling mode: essential when project is on Windows FS accessed via WSL2.
      // inotify does NOT work reliably across the 9p/DrvFs boundary.
      config.watchOptions = {
        poll: 1000,          // check for changes every 1 second
        aggregateTimeout: 300, // debounce rebuild trigger by 300ms
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
