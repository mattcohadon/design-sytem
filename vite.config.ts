import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [tailwindcss()],
  // Les composants SortUI importent « @/components/ui/... » comme dans un projet shadcn.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app/client/sortui', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // « use client » (Base UI, SortUI) n’a pas de sens hors React Server Components.
      onwarn(warning, warn) {
        if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') warn(warning);
      },
    },
  },
  server: { host: '127.0.0.1' },
});
