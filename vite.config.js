import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // 使用相对资源路径，便于直接打开 dist/index.html（file://）或部署到任意子目录
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5500,
    strictPort: false,
    open: true
  },
  preview: {
    port: 5500,
    strictPort: false
  }
})

