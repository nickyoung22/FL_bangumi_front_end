import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useStore } from '@/stores/store.js'

import NProgress from 'nprogress'

const main = () => import('@/components/main.vue')

const RouteLoading = () => import('@/components/function_pages/RouteLoading.vue')
const NotFound = () => import('@/components/function_pages/NotFound.vue')

const Add_Resources_page = () => import('@/components/function_pages/Add_Resources_page.vue')
const Add_Resources_detail = () => import('@/components/function_pages/Add_Resources_detail.vue')
const System_Info_page = () => import('@/components/function_pages/System_Info_page.vue')

const chnMangaReader = () => import('@/components/function_pages/chnMangaReader.vue')

const routes = [
  {
    path: '/',
    redirect: { path: '/main' }
  },

  {
    path: '/main',
    redirect: to => {
      console.log('---------------------redirect 1--------------------')
      console.log('from  ' + to.fullPath)

      const store = useStore()
      let history = store.temp_data.my_route_history

      if (!store.temp_data.routes) {
        return {
          name: 'RouteLoading',
          query: {
            path: to.fullPath
          }
        }
      }

      if (history) {
        console.log('有history记录')

        // 寻找最近的
        console.log('to  ' + history[history.length - 1])
        return { path: history[history.length - 1] }
      } else {
        console.log('无history记录')

        // 默认子路由中第一个
        if (store.temp_data.routes.length === 0) {
          let message = '还没有添加任何资源，快去添加一种资源吧！'
          console.log(message)
          ElMessage({
            message: `${message}！！`,
            ['custom-class']: 'message-success',
            type: 'success',
            duration: 0,
            showClose: true
          })
          return { name: 'System_Info_page' }
        } else {
          console.log('默认 to  ' + '/main/' + store.temp_data.routes[0].code)
          return { path: '/main/' + store.temp_data.routes[0].code }
        }
      }
    }
  },
  {
    path: '/main/:route1',
    redirect: to => {
      console.log('---------------------redirect 2--------------------')
      console.log('from  ' + to.fullPath)

      const store = useStore()
      let history = store.temp_data.my_route_history

      if (!store.temp_data.routes) {
        // 通常到这里都已经有routes信息了，但不排除用户直接输入'/main/2CY'访问的情况
        return {
          name: 'RouteLoading',
          query: {
            path: to.fullPath
          }
        }
      }

      if (history) {
        // 寻找最近的 以to.fullPath 为前缀的 若没有 则重定向到默认的
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].startsWith(to.fullPath)) {
            console.log('to  ' + history[i])
            return { path: history[i] }
          }
        }
      }

      // 默认是 当前类别下，第一个子路由
      for (let route of store.temp_data.routes) {
        if (route.code === to.params.route1) {
          console.log('to  ' + '/main/' + route.code + '/' + route.children[0].code)
          return { path: '/main/' + route.code + '/' + route.children[0].code }
        }
      }
    }
  },

  {
    path: '/main/:route1/:route2',
    name: 'main_page',
    component: main
  },

  {
    path: '/Add_Resources_page',
    name: 'Add_Resources_page',
    meta: {
      name: '添加资源'
    },
    component: Add_Resources_page
  },
  {
    // https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
    path: '/Add_Resources_detail/:operation/:type/:storeName ',
    name: 'Add_Resources_detail',
    meta: {
      name: '资源详情页'
    },
    component: Add_Resources_detail
  },
  {
    path: '/System_Info_page',
    name: 'System_Info_page',
    meta: {
      name: '系统信息'
    },
    component: System_Info_page
  },

  {
    path: '/chnMangaReader',
    name: 'chnMangaReader',
    meta: {
      name: '漫画阅读器',
      full_screen: true
    },
    component: chnMangaReader,
    beforeEnter: (to, from) => {
      const store = useStore()
      if (!store.temp_data.manga_reading) {
        router.back()
      }
    }
  },

  ///
  {
    path: '/route_loading',
    name: 'RouteLoading',
    meta: {
      name: '等待加载路由'
    },
    component: RouteLoading
  },
  {
    path: '/:errorMsg(.*)*',
    name: 'NotFound',
    meta: {
      name: '未找到任何页面'
    },
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    console.log('--------------------scrollBehavior-------------------')

    // 修正滚动行为
    function my_scroll_to(position) {
      console.log('滚动位置 开始修正')
      if (!position) return
      let timer = setInterval(() => {
        window.scrollTo(0, position.top)
        document.dispatchEvent(
          new WheelEvent('wheel', {
            deltaY: 2
          })
        )

        if (Math.abs(document.documentElement.scrollTop - position.top) < 5) {
          console.log('滚动位置 修正完毕 ~~~~')
          clearInterval(timer)
          NProgress.done()
        }
      }, 8)

      setTimeout(() => {
        clearInterval(timer)
        NProgress.done()
      }, 800)
    }

    const store = useStore()

    if (savedPosition) {
      my_scroll_to(savedPosition)
    } else {
      let sp = store.temp_data.savedPosition
        ? store.temp_data.savedPosition[to.fullPath]
        : { top: 0 }
      console.log('to', sp)
      if (sp) {
        my_scroll_to({ top: sp.top })
      } else {
        my_scroll_to({ top: 0 })
      }
    }
  },
  routes
})

router.beforeEach((to, from) => {
  // console.log(`全局前置守卫:   from '${from.path}' to '${to.path}'`)
  // console.log(from)
  // console.log(to)
  NProgress.start()

  const store = useStore()

  if (to.name !== 'RouteLoading' && !store.temp_data.routes) {
    console.log('======全局前置钩子 拦截======')
    return {
      name: 'RouteLoading',
      query: {
        path: to.fullPath,
        ...to.query
      }
    }
  }

  return true
})

router.afterEach((to, from) => {
  console.log(`全局路由后置钩子: from '${from.path}' to '${to.path}'`)

  const store = useStore()

  // 更改网页title
  if (to.meta.name) {
    // 功能页面
    document.title = to.meta.name + ' - ' + import.meta.env.VITE_APP_TITLE
  } else if (to.name === 'main_page') {
    // 主页面
    let flag = false
    for (let item1 of store.temp_data.routes) {
      for (let item2 of item1.children) {
        if (item2.code === to.params.route2) {
          document.title = item2.name + ' - ' + import.meta.env.VITE_APP_TITLE
          flag = true
          break
        }
      }
      if (flag) break
    }
  }

  // 记录访问过的路由 方便重定向到最近访问过的子路由
  // 只记录主页的路由
  if (to.name === 'main_page') {
    if (!store.temp_data.my_route_history) {
      store.temp_data.my_route_history = []
    }
    store.temp_data.my_route_history.push(to.fullPath)
  }
})

export default router
