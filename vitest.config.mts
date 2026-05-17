import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'ionic-reference/**'],
    globals: true,
    include: ['src/**/*.spec.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: [
      {
        find: /^@ionic\/core\/components$/,
        replacement: fileURLToPath(new URL('./node_modules/@ionic/core/components/index.js', import.meta.url)),
      },
    ],
  },
});
