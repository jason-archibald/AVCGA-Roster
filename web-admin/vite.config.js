import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // This is the critical fix. It tells Vite to build the application with
  // all asset paths relative to the `/admin/` sub-directory.
  base: '/admin/',
  plugins: [react()],
  server: {
    proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } }
  }
});
