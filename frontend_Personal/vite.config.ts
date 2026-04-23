import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8081,
    proxy: {
      // เมื่อ Frontend เรียก /api จะถูกโอนไปหา Backend (3000)
      '/api': {
        target: 'http://35.221.184.206:3000',
        changeOrigin: true,
        // สำคัญมาก: เอาไว้จัดการเรื่อง Cookie ตอน Proxy
        cookieDomainRewrite: "localhost",
      }
    }
  }
})
