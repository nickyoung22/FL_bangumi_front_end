<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import Header from './components/header.vue'
import { useStore } from '@/stores/store.js'
import { provide } from 'vue'
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import _throttle from '@/utils/_throttle.js'



const store = useStore()
const route = useRoute()
const router = useRouter()

  /*
  // 改写console.log方法，使其带时间显示
  ;(function modify_console_log() {
    // 同一时间发出的信息，相同的颜色显示
    console.original_log = console.log
  
    let now_color_index = 0,
      colors_arr = ['#e8eae0', '#f5bd00', '#937bf6', '#1ce1ff'],
      last_date_for_consoleLog = ''
  
    console.log = function (...params) {
      let dateNow = new Date().toLocaleString()
  
      if (last_date_for_consoleLog !== '') {
        if (dateNow !== last_date_for_consoleLog) {
          now_color_index = (now_color_index + 1) % colors_arr.length
        }
      }
  
      last_date_for_consoleLog = dateNow
  
      console.original_log(`[%c${dateNow}] `, `color : ${colors_arr[now_color_index]};`, ...params)
    }
  })()
  
  */

  // websocket连接 判断服务器是否持续正在正常运行
  ; (() => {
    let ws = new WebSocket(store.api_server.replace('http', 'ws') + '/socket/connect')
    ws.onopen = () => {
      ws.send('hello server')
      setInterval(() => {
        ws.send('hello server')

      }, 1000)
    };
    ws.onmessage = ev => {
      // console.log(ev.data)
      // console.log('websocket 检查连接状态： 正常~~')
    }
    ws.onerror = () => {
      console.log("WebSocket  连接错误");
      ElNotification({
        type: 'error',
        title: 'WebSocket  连接错误',
        message: '请检查后端服务器是否在正常运行',
        duration: 0,
      })
    };
    ws.onclose = (e) => {

      console.log(`WebSocket  连接断开`, e)
      ElNotification({
        type: 'error',
        title: 'WebSocket  连接断开',
        message: '请检查后端服务器是否在正常运行',
        duration: 0,
      })

    }
  })()


  // 一开始直接请求 所有数据
  // 自动从路由信息中，得到所有种类资源的type数组
  ; (() => {
    let all_types_arr = []
    router.options.routes.forEach(route => {
      if (route.meta && route.meta.need_render_link) {
        let children = route.children
        children.forEach(route2 => {
          all_types_arr.push(route2.meta.type)
        })
      }
    })
    store.get_list_data_ALL(all_types_arr, true)
  })()



// 是否全屏相关
const full_screen = ref(false)
  ; (() => {
    watch(
      () => route.path,
      () => {
        // console.log('App.vue 检测到路由发生变化：', route)
        if (route.meta.full_screen) {
          // console.log('全屏')
          full_screen.value = true
        } else {
          // console.log('不全屏')
          full_screen.value = false
        }
      },
      {
        immediate: true
      }
    )
  })()


  // 滚动位置记录相关
  ; (() => {
    document.addEventListener('scroll', _throttle(() => {
      console.log('滚动位置记录相关', route.fullPath)
      if (!store.temp_data.savedPosition) {
        store.temp_data.savedPosition = {}
      }

      store.temp_data.savedPosition[route.fullPath] = { top: document.documentElement.scrollTop }
    }, 22))
  })()


  // 从localstorage中
  // 初始化 顺序设置 
  ; (() => {

    let order = window.localStorage.getItem('顺序设置')
    if (order) {
      store.order_mode = order
    } else {
      store.order_mode = '最新'
    }

  })()

</script>

<template>
  <Header v-if="!full_screen"></Header>
  <router-view class="container-wrapper" :class="{ 'full-screen': full_screen }" v-slot="{ Component }">

    <keep-alive :exclude="[
      'NotFoundPage_name_for_keep-alive_exclude',
      'Add_Resources_detail_name_for_keep-alive_exclude',
      'chnMangaReader'
    ]">
      <component :is="Component" :key="$route.path" />
    </keep-alive>

  </router-view>
</template>

<style scoped>
.container-wrapper {
  width: 100%;
  margin-top: var(--header-height);
  /* border: 2px solid rgb(37, 237, 255); */
  overflow: hidden;
}

.full-screen {
  margin-top: 0;
}
</style>
