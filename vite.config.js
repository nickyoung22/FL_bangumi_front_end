import path from 'path'

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// element-ui plus
// 实现自动按需引入的插件
// https://juejin.cn/post/7012446423367024676
// https://github.com/antfu/unplugin-auto-import
// https://github.com/antfu/unplugin-vue-components
// https://github.com/antfu/unplugin-icons#auto-importing
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// 用来调试vite插件 的插件，访问：http://localhost:5174/__inspect/#/
import Inspect from 'vite-plugin-inspect'

// 类似webpack-bundle-analyzer打包分析插件
import { visualizer } from 'rollup-plugin-visualizer'

import { VitePWA } from 'vite-plugin-pwa'

// ----------------------------------------------------------------------->
// vite-vue3优化配置  https://zhuanlan.zhihu.com/p/440890930
// vite打包配置(静态资源合并打包/清除log/gzip压缩/ENV配置等) https://blog.csdn.net/shinjie1210/article/details/122473024

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // 这是以前的默认拆包策略，现在不采用。（现在是以异步组件为分割点）
    // https://juejin.cn/post/7135671174893142030
    // splitVendorChunkPlugin(),

    // VitePWA(),

    Inspect(),

    // 自动导入相关
    AutoImport({
      dts: true, // 会自动生成 配置文件 auto-imports.d.ts

      imports: [
        // {
        //   'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        // }
      ],

      resolvers: [
        // 自动导入 Element Plus 相关函数 及其样式，如：ElMessage, ElMessageBox...
        ElementPlusResolver()
        // Auto import icon components
        // 自动导入图标组件
        // IconsResolver({
        //   prefix: 'Icon'
        // })
      ]
    }),
    Components({
      dts: true, // 会自动生成 配置文件 components.d.ts

      // 指定被自动导入的组件位置,默认是 dirs: ['src/components'],
      // 默认的配置，会使得自己的组件也被自动引入，而我们只想自动引入第三方组件库(elementplus)的组件
      dirs: [],

      resolvers: [
        // 自动导入 Element Plus 组件 及其样式
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

      open: false,

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
    port: 5174,
    host: '0.0.0.0'
  },

  build: {
    rollupOptions: {
      output: {
        // https://cn.vitejs.dev/guide/build.html#chunking-strategy
        // manualChunks: {
        //   'element-plus-Chunk': ['element-plus']
        // }
        // manualChunks(id) {
        //   if (id.includes('element-plus')) {
        //     // console.log(id)
        //     return 'element-plus-Chunk'
        //   }
        // },
        entryFileNames: 'assets/[name]-[hash].js',

        chunkFileNames: 'assets/js/[name]-[hash].js',
        // chunkFileNames: chunkInfo => {
        //   // console.log(chunkInfo)

        //   const src_path = path.resolve('./src')
        //   const node_modules_path = path.resolve('./node_modules')
        //   const file_path = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1].replace(/\//g, '\\')

        //   if (file_path) {
        //     // 自定义组件
        //     if (file_path.startsWith(src_path)) {
        //       let path = file_path.replace(src_path + '\\', '')
        //       let arr = path.split('\\')
        //       arr.pop()

        //       return `assets/${arr.join('\\')}/[name]-[hash].js`
        //     }
        //     // 第三方
        //     else if (file_path.startsWith(node_modules_path)) {
        //       let path = file_path.replace(node_modules_path + '\\', '')
        //       let arr = path.split('\\')

        //       return `assets/${arr[0]}/[name]-[hash].js`
        //     } else {
        //       return 'assets/[name]-[hash].js'
        //     }
        //   }
        // },

        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        // assetFileNames: assetInfo => {
        //   console.log(assetInfo)

        //   // const src_path = path.resolve('./src')
        //   // const node_modules_path = path.resolve('./node_modules')
        //   // const file_path = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1].replace(/\//g, '\\')

        //   // console.log(file_path)
        //   // console.log(src_path)
        //   // console.log(node_modules_path)

        //   console.log('---------------------------------')

        //   return 'assets/[ext]/[name]-[hash].[ext]'
        // }
      }
    },

    minify: 'esbuild' // 默认

    // https://cn.vitejs.dev/config/build-options.html#build-sourcemap
    // sourcemap: true
  },

  // vite 构建移除 console https://www.cnblogs.com/guangzan/p/16633753.html
  esbuild: {
    // drop: ['console', 'debugger']
    // drop: mode === 'production' ? ['console', 'debugger'] : []
  }
})
