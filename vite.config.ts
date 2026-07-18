import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Site published at https://jgemanuel.github.io/PipocaGym/
export default defineConfig({
  base: '/PipocaGym/',
  plugins: [react(), tailwindcss()],
})
