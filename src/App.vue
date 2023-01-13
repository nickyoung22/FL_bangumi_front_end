<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from '@/stores/store.js'
  import { defineAsyncComponent } from 'vue'

  import modify_console_log from '@/utils/modify_console_log.js'
  import _throttle from '@/utils/_throttle.js'

  const store = useStore()
  const route = useRoute()

  // header组件 以异步形式
  const Header = defineAsyncComponent(() => import('./components/header.vue'))

  // 改写console.log方法，使其带时间显示
  // modify_console_log()

  // websocket连接 判断服务器是否持续正在正常运行
  ;(() => {
    let ws = new WebSocket(store.api_server.replace('http', 'ws') + '/socket/connect')
    ws.onopen = () => {
      ws.send('hello server')
      setInterval(() => {
        ws.send('hello server')
      }, 1000)
    }
    ws.onmessage = ev => {
      // console.log(ev.data)
      // console.log('websocket 检查连接状态： 正常~~')
    }
    ws.onerror = () => {
      console.log('WebSocket  连接错误')
      ElNotification({
        type: 'error',
        title: 'WebSocket  连接错误',
        dangerouslyUseHTMLString: true,
        message:
          '请检查后端服务器是否在正常运行   <hr> 尝试<button onclick="location.reload(true)">刷新</button>',
        duration: 0
      })
    }
    ws.onclose = e => {
      console.log(`WebSocket  连接断开`, e)
      ElNotification({
        type: 'error',
        title: 'WebSocket  连接断开',
        dangerouslyUseHTMLString: true,
        message:
          '请检查后端服务器是否在正常运行   <hr> 尝试<button onclick="location.reload(true)">刷新</button>',
        duration: 0
      })
    }
  })()

  // 一开始直接请求 所有数据
  store.init()

  // 是否全屏相关
  const full_screen = ref(false)
  ;(() => {
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
  ;(() => {
    document.addEventListener(
      'scroll',
      _throttle(() => {
        console.log('滚动位置记录相关', route.fullPath)
        if (!store.temp_data.savedPosition) {
          store.temp_data.savedPosition = {}
        }

        store.temp_data.savedPosition[route.fullPath] = { top: document.documentElement.scrollTop }
      }, 22)
    )
  })()

  // 从localstorage中
  // 初始化 顺序设置
  ;(() => {
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
  <router-view
    class="container-wrapper"
    :class="{ 'full-screen': full_screen }"
    v-slot="{ Component }">
    <!-- 这里强制：相同路由 也不复用 -->
    <keep-alive
      :exclude="[
        'NotFoundPage_name_for_keep-alive_exclude',
        'Add_Resources_detail_name_for_keep-alive_exclude',
        'chnMangaReader',
        'RouteLoading_name_for_keep-alive_exclude'
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
