import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'development-react-preamble',
      apply: 'serve',
      // React 热更新需要内联前导脚本。打包页面保留严格的 CSP。
      transformIndexHtml: html => html.replace(/^\s*<meta http-equiv="Content-Security-Policy".*$/m, ''),
    },
  ],
})
