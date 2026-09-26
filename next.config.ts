import type { NextConfig } from 'next';

// Бэкенда нет: приложение собирается в статику и ходит в GREEN-API напрямую из браузера.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
