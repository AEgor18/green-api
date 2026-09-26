import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/shared/ui/**',
        'src/test/**',
        'src/app/**/*.tsx',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.test.*',
      ],
    },
  },
});
