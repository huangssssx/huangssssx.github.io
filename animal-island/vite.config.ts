import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    dedupe: ['gsap'],
    alias: {
      gsap: path.resolve('./node_modules/gsap'),
    },
  },
})
