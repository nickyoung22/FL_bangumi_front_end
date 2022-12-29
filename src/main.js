import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 导入路由
import router from './router/router.js'

import { mixin } from './mixin/mixin.js'

import './assets/main.css'

// https://blog.csdn.net/yjl13598765406/article/details/125496865
import 'default-passive-events'

// element-ui 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 导入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axios from './utils/axios.js'

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$axios = axios

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

console.log('app实例:  ', app) //

app.mixin(mixin)

app.use(pinia) // 使用 pinia 全局状态管理

app.use(router) // 使用 vue router@4

app.mount('#app')
