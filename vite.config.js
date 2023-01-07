import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// element-ui plus
// 实现自动按需引入的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 用来调试vite插件 的插件，访问：http://localhost:5174/__inspect/#/
import Inspect from 'vite-plugin-inspect'

// 类似webpack-bundle-analyzer打包分析插件
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
    Inspect(),
    // ...
    AutoImport({
      dts: true, // 会自动生成 auto-imports.d.ts
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: true, // 会自动生成 components.d.ts
      // dirs: ['src/components'],
      // 默认的配置，会使得自己的组件也被自动引入，而我们只想自动引入第三方组件库(elementplus)的组件
      dirs: [],
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    host: '0.0.0.0'
  }
})
