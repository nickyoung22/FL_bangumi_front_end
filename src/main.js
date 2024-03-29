console.log('----> main.js 的第一行代码')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 导入路由
import router from './router/router.js'

import { mixin } from './mixin/mixin.js'

// element-ui 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.less'

// https://blog.csdn.net/yjl13598765406/article/details/125496865
// import 'default-passive-events'

const pinia = createPinia()
const app = createApp(App)

import axios from './utils/axios.js'
// 向 app.config.globalProperties 中添加一些全局实例属性或方法
app.config.globalProperties.$axios = axios

// app.mixin(mixin)

app.use(pinia) // 使用 pinia 全局状态管理

app.use(router) // 使用 vue router@4

console.log('app实例:  ', app) //

console.log(`---------- app.mount('#app')`)
app.mount('#app')
