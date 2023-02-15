<template>
  <div class="plugin-box">
    <h3 class="title clearfix" @click="show = !show">
      <span class="float-left">{{ ComponentName_show }} in {{ type_showName }}</span>
      <span class="float-right" v-if="show">↓</span>
      <span class="float-right" v-else>↑</span>
    </h3>

    <div v-show="show" class="plugin-main">
      <el-button type="primary" @click="generate_playlist('all')">生成总表 playlist</el-button>
      <el-button type="warning" @click="generate_playlist('temp')">生成临时表 playlist</el-button>
    </div>
    <div v-show="show" @click="show = false" class="fold-triangle"></div>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },
    props: ['type', 'type_showName'],
    data() {
      return {
        ComponentName: 'generate_mmddplaylist.vue',
        ComponentName_show: 'mmdd-playlist 生成器',

        show: false
      }
    },

    methods: {
      alert_success(message) {
        console.log(`${message}！！`)
        ElMessage({
          message: `${message}！！`,
          ['custom-class']: 'message-success',
          type: 'success',
          duration: 3000,
          showClose: true
        })
      },
      alert_error(message) {
        console.log(`${message}！！`)
        ElMessage({
          message: `${message}！！`,
          type: 'error',
          ['custom-class']: 'message-error',
          duration: 0,
          showClose: true
        })
      },
      generate_playlist(operation) {
        this.$axios
          .get(this.store.api_server + `/generate_playlist/${this.type}/${operation}`)
          .then(() => {
            this.alert_success('生成list成功')
          })
          .catch(err => {
            this.alert_error('生成list失败')
          })
      }
    }
  }
</script>

<style scoped lang="less">
  .plugin-box {
    max-height: 70vh;

    .title {
      font-size: var(--body-font-size);
      color: rgb(255, 138, 5);
      border-radius: 6px;
      position: sticky;
      top: 0px;
      background-color: var(--header-background-color);
      z-index: 1;

      &:hover {
        cursor: pointer;
        background-color: var(--active-list-item);
      }
    }

    .plugin-main {
    }

    .fold-triangle {
      width: 0;
      height: 0;
      border-left: calc(var(--right-sider-width) * 0.4) solid transparent;
      border-right: calc(var(--right-sider-width) * 0.4) solid transparent;
      border-bottom: 18px solid rgb(26, 186, 255);
      margin: 0 auto;
      cursor: pointer;
      position: sticky;
      bottom: 0;

      &:hover {
        border-bottom: 18px solid rgb(111, 209, 251);
      }
    }
  }
</style>
