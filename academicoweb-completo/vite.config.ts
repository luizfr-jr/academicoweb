/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Base path: '/' para Vercel, '/academicoweb/' para GitHub Pages
const REPO_NAME = 'academicoweb'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? `/${REPO_NAME}/` : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
