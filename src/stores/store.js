// 示例文件路径：
// ./src/stores/counter.js

import { defineStore } from 'pinia'
import axios from '../utils/axios'
import order from '../utils/order'
import router from '@/router/router.js'
export const useStore = defineStore('store', {
  state: () => ({
    api_server: 'http://localhost:8023/fl_bangumi',
    // api_server: 'http://192.168.31.58:8023/fl_bangumi',

    list_data: {},
    list_data_filtered: {},

    order_mode: '',

    // 过滤器 用
    filters: {},
    // highlight 用
    highlights: {},

    temp_data: {}
  }),
  actions: {
    async get_list_data(type, first_get) {
      console.log('[get_list_data]' + ' started:  ' + `[${type}]`)

      let data_in_store_name = 'list_data'

      if (!this[data_in_store_name][type]) {
        // console.log('没有的话 就创建:   ' + data_in_store_name + ' -> ' + type)
        this[data_in_store_name][type] = []
      }
      if (!this[`list_data_filtered`][type]) {
        // console.log('没有的话 就创建:   ' + `list_data_filtered` + ' -> ' + type)
        this[`list_data_filtered`][type] = []
      }

      let res = await axios.get(this.api_server + '/list' + '/' + type)

      this[data_in_store_name][type] = res

      // 如果是第一次获取数据，拷贝一份相同的 到 list data filtered
      if (first_get) {
        this[`list_data_filtered`][type] = order(JSON.parse(JSON.stringify(res)), this.order_mode)
      }

      console.log('[get_list_data]' + ' finished:  ' + `[${type}]`)
    },

    // 第一次获取时（即打开app时），要将list_data_filtered初始化为请求来的值
    // 随后get数据到list_data，但不去改变filtered的数据，filtered的数据由 过滤器组件 进行逻辑控制，根据list_data过滤出新数据
    async get_list_data_ALL(type_arr, first_get) {
      console.log('[get_list_data_ALL]' + ' started:  ' + `[${type_arr.join(' , ')}]`)

      let promise_arr = []

      for (let type of type_arr) {
        promise_arr.push(this.get_list_data(type, first_get))
      }

      await Promise.all(promise_arr)

      console.log('[get_list_data_ALL]' + ' finished:  ' + `[${type_arr.join(' , ')}]`)
    },

    update_list_data_filtered(modify_data, option) {
      // 从 list_data 中 更新 list_data_filtered 的数据

      let { operation } = option
      let { type, storeName } = modify_data
      const alert_success = message => {
          console.log(`从 list_data 中 更新 list_data_filtered 的数据： ${message}！！`)
          ElMessage({
            message: `${message}！！`,
            ['custom-class']: 'message-success',
            type: 'success',
            duration: 3000,
            showClose: true
          })
        },
        alert_error = () => {
          console.log(`从 list_data 中 更新 list_data_filtered 的数据： ${message}！！`)
          ElMessage({
            message: `${message}！！`,
            type: 'error',
            ['custom-class']: 'message-error',
            duration: 0,
            showClose: true
          })
        }

      /**
       * modify 不会触发 infinite_list 内 list_data的监听 （某一项的修改操作）
       * delete 不会触发 infinite_list 内 list_data的监听 （splice操作）
       * add 会触发 infinite_list 内 list_data的监听 （execute_filters操作 会重新赋值）
       */

      if (operation === 'modify') {
        let new_data = null
        for (let data of this.list_data[type]) {
          if (data.storeName === storeName) {
            new_data = data
            break
          }
        }
        for (let data of this.list_data_filtered[type]) {
          if (data.storeName === storeName) {
            let names = Object.keys(data)
            names.forEach(name => {
              data[name] = new_data[name]
            })

            alert_success('更新成功')
            return
          }
        }
        alert_error('更新失败')
      } else if (operation === 'delete') {
        for (let data of this.list_data[type]) {
          if (data.storeName === storeName) {
            alert_error('删除失败')
            return
          }
        }
        for (let data of this.list_data_filtered[type]) {
          if (data.storeName === storeName) {
            this.list_data_filtered[type].splice(this.list_data_filtered[type].indexOf(data), 1)
            alert_success('删除成功')
            return
          }
        }
        alert_error('删除失败')
      } else if (operation === 'add') {
        // 添加资源后 直接重新执行一遍过滤逻辑
        this.execute_filters(type)
        alert_success('添加成功')
      }
    },

    execute_filters(type) {
      console.log('--------------execute_filters()----------------')

      window.scrollTo(0, 0)

      let types = []
      if (!type) {
        router.options.routes.forEach(route => {
          if (route.meta && route.meta.need_render_link) {
            let children = route.children
            children.forEach(route2 => {
              types.push(route2.meta.type)
            })
          }
        })
      } else {
        types = [type]
      }

      for (let type of types) {
        let filters_obj = this.filters[type]
        let filter_names
        if (!filters_obj) {
          filter_names = []
        } else {
          filter_names = Object.keys(filters_obj)
        }

        // 初始化
        let res = order(JSON.parse(JSON.stringify(this.list_data[type])), this.order_mode)
        let filters = []

        for (let filter_name of filter_names) {
          console.log('执行过滤： ' + type + '  ->  ' + filter_name)
          filters.push(filters_obj[filter_name])
        }

        res = filters.reduce((prev_res, cur_f) => {
          return prev_res.filter(cur_f)
        }, res)

        this.list_data_filtered[type] = res
      }
    },

    execute_highlights(type) {
      if (!this.highlights[type]) {
        this.highlights[type] = {}
      }

      let highlights_obj = this.highlights[type]
      let highlight_names = Object.keys(highlights_obj)

      if (!highlight_names.length) return

      let highlights = []
      for (let highlight_name of highlight_names) {
        console.log('执行高亮： ' + type + '  ->  ' + highlight_name)
        highlights.push(highlights_obj[highlight_name])
      }

      let exec_highlight_arr = arr => {
        let reg = arr[0],
          CSS_selector = arr[1]

        let unHighLight = html => {
          var reg = new RegExp('(<mark>|</mark>)', 'g')
          return html.replace(reg, function (item) {
            return ''
          })
        }
        let HighLight = html => {
          return html.replace(reg, function (item) {
            return '<mark>' + item + '</mark>'
          })
        }

        ;[...document.querySelectorAll(CSS_selector)].forEach(e => {
          e.innerHTML = HighLight(unHighLight(e.innerHTML))
        })
      }

      highlights.forEach(e => {
        exec_highlight_arr(e)
      })
    }
  }
})
