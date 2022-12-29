import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useStore } from '@/stores/store.js'


const main_2CY_anime = () => import('@/components/main_pages/main_2CY_anime.vue')
const main_2CY_manga = () => import('@/components/main_pages/main_2CY_manga.vue')
const main_3CY_movie = () => import('@/components/main_pages/main_3CY_movie.vue')
const main_3CY_dance = () => import('@/components/main_pages/main_3CY_dance.vue')

const NotFound = () => import('@/components/function_pages/NotFound.vue')
const Add_Resources_page = () => import('@/components/function_pages/Add_Resources_page.vue')
const Add_Resources_detail = () => import('@/components/function_pages/Add_Resources_detail.vue')
const System_Info_page = () => import('@/components/function_pages/System_Info_page.vue')

const chnMangaReader = () => import('@/components/function_pages/chnMangaReader.vue')

const routes = [
  {
    path: '/',
    // redirect: '/2CY/anime'
    redirect: to => {
      console.log('---------------------redirect--------------------')
      console.log('from  ' + to.fullPath)
      const store = useStore()
      let history = store.temp_data.my_route_history

      if (history) {
        // 寻找最近的

        console.log('to  ' + history[history.length - 1])
        return { path: history[history.length - 1] }
      }

      console.log('默认 to  ' + '/2CY')
      return { path: '/2CY' }
    }
  },

  {
    path: '/2CY',
    meta: { name: '2次元', need_render_link: true },
    redirect: to => {
      console.log('---------------------redirect--------------------')
      console.log('from  ' + to.fullPath) // '/2C'

      const store = useStore()
      let history = store.temp_data.my_route_history

      if (history) {
        // 寻找最近的 以to.fullPath 为前缀的 若没有 则重定向到默认的
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].startsWith(to.fullPath)) {
            console.log('to  ' + history[i]) // '/2C'
            return { path: history[i] }
          }
        }
      }
      console.log('默认 to  ' + '/2CY/anime') // '/2C'
      return { path: '/2CY/anime' }
    },
    children: [
      {
        path: 'anime',
        meta: { name: '动漫', type: '2CY_anime' },
        component: main_2CY_anime
      },
      {
        path: 'manga',
        meta: {
          name: '漫画',
          type: '2CY_manga'
        },
        component: main_2CY_manga
      }
    ]
  },

  {
    path: '/3CY',
    meta: { name: '3次元', need_render_link: true },
    redirect: to => {
      console.log('---------------------redirect--------------------')
      console.log('from  ' + to.fullPath) // '/3C'

      const store = useStore()
      let history = store.temp_data.my_route_history

      if (history) {
        // 寻找最近的 以to.fullPath 为前缀的 若没有 则重定向到默认的
        for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].startsWith(to.fullPath)) {
            console.log('to  ' + history[i]) // '/3C'
            return { path: history[i] }
          }
        }
      }
      console.log('默认 to  ' + '/3CY/movie') // '/3C'
      return { path: '/3CY/movie' }
    },
    children: [
      { path: 'movie', meta: { name: '电影', type: '3CY_movie' }, component: main_3CY_movie },
      { path: 'dance', meta: { name: '舞蹈', type: '3CY_dance' }, component: main_3CY_dance }
    ]
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
    component: chnMangaReader
  },

  ///
  { path: '/:errorMsg(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    console.log('--------------------scrollBehavior-------------------')
    // console.log('to', to)
    // console.log('from', from)
    // console.log('savedPosition', savedPosition)

    // 修正滚动行为
    let my_scroll_to = position => {
      if (!position) return
      let timer = setInterval(() => {
        window.scrollTo(0, position.top)
        // console.log(
        //   `--------------  window.scrollTo(0, ${savedPosition.top}) ---------------------`
        // )
        // console.log(document.documentElement.scrollTop)
      }, 20)
      setTimeout(() => {
        clearInterval(timer)
      }, 300)
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
  return true
})

router.afterEach((to, from) => {
  console.log(`全局路由后置钩子: from '${from.path}' to '${to.path}'`)
  // console.log(from)
  // console.log(to)

  // console.log(`当前组件路由：${to.fullPath}`)

  // 跳转到特定的一些路由时，请求相应数据
  // if (
  //   // 第一次打开app的时候，不在此请求数据
  //   from.path !== '/' &&
  //   //  打开任意资源展示主页的时候。
  //   to.meta.need_render_link === true
  // ) {
  //   let store = useStore()
  //   let all_types_arr = []
  //   router.options.routes.forEach(route => {
  //     if (route.meta && route.meta.need_render_link) {
  //       let children = route.children
  //       children.forEach(route2 => {
  //         all_types_arr.push(route2.meta.type)
  //       })
  //     }
  //   })
  //   console.log(`由路由导航触发的 请求数据：get_list_data_ALL()`)
  //   store.get_list_data_ALL(all_types_arr, false)
  // }

  // 更改网页title
  document.title = to.meta.name + ' - ' + import.meta.env.VITE_APP_TITLE

  // 记录访问过的路由 方便重定向到最近访问过的子路由
  if (to.meta.need_render_link) {
    // 只记录主页的路由
    const store = useStore()
    if (!store.temp_data.my_route_history) {
      store.temp_data.my_route_history = []
    }
    store.temp_data.my_route_history.push(to.fullPath)
  }
})

export default router
