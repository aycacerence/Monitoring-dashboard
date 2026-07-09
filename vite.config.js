/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const nodeEnv = process.env.NODE_ENV || 'development';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  },
  optimizeDeps: {
    rolldownOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.jsx'],
    exclude: ['e2e/**', 'node_modules/**'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        '**/*.d.ts',
        'src/main.jsx',
        'src/router/',
      ],
    },
  },
});
