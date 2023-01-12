<template>
  <div class="infinite-list-class">
    <h2 class="info" ref="infoDOM">
      列表已展示{{ render_list_data.length }}/{{ list_data.length }} 条数据，
      <span v-if="more_data_to_render">下滑产生更多数据</span>
      <span v-else>全部已展示~</span>
    </h2>

    <ul ref="ulDOM">
      <template v-for="item in render_list_data">
        <slot name="list_item_component" :list_item_data="item"></slot>
      </template>
    </ul>

    <el-divider />
    <div v-if="more_data_to_render" class="render-more-notify notify">
      <div class="icons">
        <el-progress :percentage="100" :format="() => ``" :indeterminate="true" :duration="0.8" />
      </div>
    </div>
    <div v-else class="render-finished-notify notify">
      <div class="icons">
        <el-progress class="warn-bar" :percentage="100" :format="() => `加载完毕-----无更多数据`" />
      </div>
    </div>
  </div>
</template>

<script>
  import _throttle from '@/utils/_throttle.js'
  import { useStore } from '@/stores/store.js'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },

    props: ['list_data', 'initial_render_num', 'add_render_num'],
    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue',
        render_num: 0
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
        console.log(`监听到 向下滚了~~~~~~~~~~~~`)

        let html = document.documentElement
        // 距离底部的距离
        let distance_to_bottom = html.scrollHeight - (html.scrollTop + html.clientHeight)
        // console.log(distance_to_bottom, html.clientHeight / 2)//
        if (distance_to_bottom < html.clientHeight / 2) {
          console.log('即将滚动到底部')
          this.renderMore()
        }
      }, 50)
    },
    created() {
      this.render_num = this.initial_render_num
    },
    mounted() {
      // info改为绝对定位
      const infoDOM = this.$refs.infoDOM
      const top = infoDOM.offsetTop
      const left = infoDOM.offsetLeft
      infoDOM.style.position = 'fixed'
      infoDOM.style.top = top + 'px'
      infoDOM.style.left = left + 'px'

      const ulDOM = this.$refs.ulDOM
      ulDOM.style.marginTop = window.getComputedStyle(infoDOM).height
    },
    activated() {
      document.addEventListener('wheel', this.wheelHandler)
    },
    deactivated() {
      document.removeEventListener('wheel', this.wheelHandler)
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
