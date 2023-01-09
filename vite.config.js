import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// element-ui plus
// 实现自动按需引入的插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// 用来调试vite插件 的插件，访问：http://localhost:5174/__inspect/#/
import Inspect from 'vite-plugin-inspect'

// 类似webpack-bundle-analyzer打包分析插件
import { visualizer } from 'rollup-plugin-visualizer'

// vite-vue3优化配置  https://zhuanlan.zhihu.com/p/440890930
// vite打包配置(静态资源合并打包/清除log/gzip压缩/ENV配置等) https://blog.csdn.net/shinjie1210/article/details/122473024

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Inspect(),
    // 自动导入相关
    AutoImport({
      dts: true, // 会自动生成 配置文件 auto-imports.d.ts

      resolvers: [
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox...
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ]
    }),
    Components({
      dts: true, // 会自动生成 配置文件 components.d.ts

      // 指定自动导入的组件位置,默认是 dirs: ['src/components'],
      // 默认的配置，会使得自己的组件也被自动引入，而我们只想自动引入第三方组件库(elementplus)的组件
      dirs: [],

      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),

        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'] // element-plus 图标库
        })
      ]
    }),

    // elementPlus自动导入图标
    // https://www.jianshu.com/p/23229850bb08
    // https://blog.csdn.net/webbirds/article/details/127283504
    Icons({
      autoInstall: true
    }),

    // https://github.com/btd/rollup-plugin-visualizer
    visualizer({
      gzipSize: true,
      brotliSize: true,

      open: true,

      // emitFile: true, // 生成到dist文件夹下
      filename: '打包体积分析.html' //分析图生成的文件名
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    host: '0.0.0.0'
  },

  build: {
    rollupOptions: {
      output: {
        // manualChunks: {
        //   'element-plus-Chunk': ['element-plus']
        // }
        // manualChunks(id) {
        //   if (id.includes('FL_bangumi_front_end/src/components/main_components')) {
        //     console.log(id)
        //     return 'main_components-Chunk'
        //   }
        // },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    minify: 'esbuild' // 默认
  },
  // vite 构建移除 console https://www.cnblogs.com/guangzan/p/16633753.html
  esbuild: {
    drop: ['console', 'debugger']
    // drop: mode === 'production' ? ['console', 'debugger'] : []
  }
})
