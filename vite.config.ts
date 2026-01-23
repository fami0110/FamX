import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: '127.0.0.1',
    // port: 8080,
    // proxy: {
    //   '/api/suggest': {
    //     target: 'https://suggestqueries.google.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/suggest/, ''),
    //     secure: true, 
    //   },
    //   '/api/ip': {
    //     target: 'https://ipwho.is/',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/ip/, ''),
    //     secure: true, 
    //   },
    //   '/api/weather': {
    //     target: 'https://api.open-meteo.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/weather/, ''),
    //     secure: true, 
    //   },
    // },
  },
})


