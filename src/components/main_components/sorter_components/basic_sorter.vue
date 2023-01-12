<template>
  <div class="sorter-box">
    <el-radio-group v-model="store.order_mode" @change="order_change_handler">
      <el-radio-button label="最新" />
      <el-radio-button label="最早" />
      <el-radio-button label="随机" />
    </el-radio-group>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'
  import NProgress from 'nprogress'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },
    data() {
      return {
        ComponentName: 'basic_sorter.vue',
        ComponentName_show: '排序器'
      }
    },

    methods: {
      order_change_handler() {
        NProgress.start()
        this.$nextTick(() => {
          NProgress.done()
        })

        this.store.execute_filters()

        // 从localstorage中
        // 初始化 顺序设置
        window.localStorage.setItem('顺序设置', this.store.order_mode)
      }
    }
  }
</script>

<style scoped lang="less"></style>
