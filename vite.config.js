import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
// import { defineConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import cssInJs from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VRegion',
      formats: ['es', 'umd'],
      fileName: 'v-region'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    cssInJs()
  ]
})
