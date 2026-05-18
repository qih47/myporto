import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Tambahkan import ini

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Pasang di sini sebagai plugin Vite
  ],
})