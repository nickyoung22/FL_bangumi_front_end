<template>
  <div class="infinite-list-class" ref="infinite-list-DOM">
    <h2 class="info" ref="infoDOM">
      列表已展示{{ render_list_data.length }}/{{ list_data.length }} 条数据，
      <span v-if="more_data_to_render">下滑产生更多数据</span>
      <span v-else>全部已展示~</span>
    </h2>

    <ul ref="ulDOM">
      <template v-for="item in render_list_data">
        <slot :list_item_data="item"></slot>
      </template>
    </ul>

    <el-divider />
    <div v-if="more_data_to_render" class="render-more-notify notify">
      <div class="icons">
        <el-progress :percentage="100" :format="() => ``" :indeterminate="true" :duration="0.8" />
      </div>
    </div>
    <div v-else class="render-finished-notify notify progress-bars">
      <el-progress class="warn-bar" :percentage="100" :format="() => `加载完毕-----无更多数据`" />
    </div>
  </div>
</template>

<script>
  // 【Vue 移动端企业级实战 - 长列表虚拟滚动高阶插件封装】 https://www.bilibili.com/video/BV1ab4y127Hp
  // 长列表优化之虚拟列表 - 爱搞事的程序鱼的文章 - 知乎 https://zhuanlan.zhihu.com/p/444778554

  import _throttle from '@/utils/_throttle.js'
  import { useStore } from '@/stores/store.js'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },

    props: {
      list_data: {
        type: Array
      },
      initial_render_num: {
        type: Number
      },
      add_render_num: {
        type: Number
      },
      scroll_mode: {
        type: String,
        default: 'document'
      }
    },

    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue',
        render_num: 0,
        containerDOM: null,
        containerDOM_bind: null,

        // 使用 passive 改善滚屏性能
        // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD
        passiveIfSupported: null
      }
    },
    computed: {
      render_list_data() {
        return this.list_data.slice(0, this.render_num)
      },
      more_data_to_render() {
        return this.render_num < this.list_data.length && this.list_data.length !== 0
      }
    },
    watch: {
      list_data: {
        handler(old_value, new_value) {
          console.log(
            '==================检测到list_data发生变化（代表过滤器逻辑生效了）================='
          )

          // 数据变化，意味着 filtered_data 变化了

          // 只要过滤器生效，那么回到初始渲染数量
          this.render_num = this.initial_render_num
        },
        // 这里不深度监听
        // 因为对单个数据项的修改，例如modify data后，应保持页面不变，即渲染内容不变。
        // 选项式api watch 默认是浅层的
        deep: false
      }
    },
    methods: {
      renderMore() {
        if (this.render_num >= this.list_data.length) {
          console.log('没有新数据可供加载...')
          return
        }

        console.log('开始加载...')
        this.render_num += this.add_render_num
        if (this.render_num > this.list_data.length) {
          this.render_num = this.list_data.length
        }
        console.log('加载完毕...')
      },
      wheelHandler: _throttle(function (e) {
        if (e.deltaY < 0) return

        console.log(this.scroll_mode)
        console.log(`监听到 向下滚了~~~~~~~~~~~~`)

        // 距离底部的距离
        let distance_to_bottom =
          this.containerDOM.scrollHeight -
          (this.containerDOM.scrollTop + this.containerDOM.clientHeight)
        // console.log(distance_to_bottom, html.clientHeight / 2)//
        if (distance_to_bottom < this.containerDOM.clientHeight / 2) {
          console.log('触发条件 加载新数据 --> --> --> --> --> -->')
          this.renderMore()
        }
      }, 50)
    },
    created() {
      this.render_num = this.initial_render_num

      try {
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: () => {
              // 注意this 用箭头函数
              this.passiveIfSupported = { passive: true }
            }
          })
        )
      } catch (err) {}
    },
    mounted() {
      const infoDOM = this.$refs.infoDOM
      const top = infoDOM.offsetTop
      const left = infoDOM.offsetLeft
      const ulDOM = this.$refs.ulDOM

      switch (this.scroll_mode) {
        case 'document':
          this.containerDOM = document.documentElement
          this.containerDOM_bind = document
          break

        case 'box':
          this.containerDOM = this.$refs['infinite-list-DOM']
          this.containerDOM_bind = this.$refs['infinite-list-DOM']
          break
      }

      if (this.scroll_mode === 'document') {
        // info改为 绝对定位
        infoDOM.style.position = 'fixed'
      } else if (this.scroll_mode === 'box') {
        // info改为 粘性定位
        infoDOM.style.position = 'sticky'
      }

      infoDOM.style.top = top + 'px'
      infoDOM.style.left = left + 'px'

      ulDOM.style.marginTop = window.getComputedStyle(infoDOM).height

      // console.log(`!!!!!!!!!!!!!!!!!!! 绑定`)
      // console.log(this.containerDOM_bind)
      // console.log(this.wheelHandler)
      this.containerDOM_bind.addEventListener('scroll', this.wheelHandler, this.passiveIfSupported)
    },
    activated() {
      if (this.scroll_mode !== 'box') {
        // console.log(`!!!!!!!!!!!!!!!!!!! 绑定`)
        // console.log(this.containerDOM_bind)
        // console.log(this.wheelHandler)
        this.containerDOM_bind.addEventListener(
          'scroll',
          this.wheelHandler,
          this.passiveIfSupported
        )
      }
    },
    deactivated() {
      // console.log(` 解绑`)
      this.containerDOM_bind.removeEventListener('scroll', this.wheelHandler)
    },
    unmounted() {
      // console.log(` 解绑`)
      this.containerDOM_bind.removeEventListener('scroll', this.wheelHandler)
    },
    updated() {
      this.$emit('list_updated')
    }
  }
</script>

<style lang="less">
  .infinite-list-class {
    .info {
      z-index: 1;
      font-size: calc(var(--body-font-size) * 1.2);
      color: aqua;
      border-bottom: 2px dashed orange;
      background-color: var(--header-background-color);
    }

    ul {
      .list-item {
        border-bottom: 0.8px solid #25edff7f;
        margin: 3px;

        &:nth-child(even) {
          background-color: var(--my-gray2);
        }

        &:hover {
          background-color: var(--active-list-item);
        }
      }
    }
  }
</style>
