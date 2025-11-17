import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/types': resolve(__dirname, './src/types'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/certus': resolve(__dirname, './src/certus'),
      '@/responses': resolve(__dirname, './src/responses'),
      '@/valt': resolve(__dirname, './src/valt'),
      '@/adi': resolve(__dirname, './src/adi'),
    },
  },
});