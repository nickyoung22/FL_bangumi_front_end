<template>
  <div class="plugin-box">
    <h3 class="title clearfix" @click="show = !show">
      <span class="float-left">{{ ComponentName_show }} in {{ type_showName }}</span>

      <span class="float-right" v-if="show">↓</span>
      <span class="float-right" v-else>↑</span>
    </h3>

    <div v-show="show" class="plugin-main">
      <div class="list">
        <div class="selected-list">
          <span>临时列表：{{ selected_list.length }}</span>
          <li v-for="item in selected_list">
            {{ item }}
          </li>
        </div>
        <div class="not-found-list" v-if="list_not_found.length > 0">
          <hr />
          <span>异常数据：{{ list_not_found.length }}</span>
          <li v-for="item in list_not_found">
            {{ item }}
          </li>
        </div>
        <hr />
        <el-popconfirm
          confirm-button-text="确认清空"
          confirm-button-type="danger"
          cancel-button-text="取消"
          cancel-button-type="info"
          title="你确认要清空临时表吗？"
          @confirm="clear_templist">
          <template #reference>
            <el-button type="danger">清空临时表</el-button>
          </template>
        </el-popconfirm>
      </div>
      <hr />
      <div class="other">
        <!-- 仅舞蹈出现的功能 -->
        <div v-if="type === '3CY_dance'">
          <el-button type="primary" @click="generate_playlist('all')">生成总表 playlist</el-button>
          <el-button type="warning" @click="generate_playlist('temp')">
            生成临时表 playlist
          </el-button>
        </div>
      </div>
    </div>

    <div v-show="show" @click="show = false" class="fold-triangle"></div>
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
    props: ['type', 'type_showName'],

    components: {},

    data() {
      return {
        ComponentName: 'selected.vue',
        ComponentName_show: '临时列表选择器',

        show: false,

        list_not_found: []
      }
    },
    computed: {
      overflow() {
        return this.show ? 'auto' : 'hidden'
      },
      selected_list() {
        if (
          this.store.temp_data.list_data_selected &&
          this.store.temp_data.list_data_selected[this.type]
        ) {
          return Object.keys(this.store.temp_data.list_data_selected[this.type]).filter(e => {
            if (e === '_id') return false
            else return true
          })
        } else {
          return []
        }
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

      clear_templist() {
        NProgress.start()
        this.$nextTick(() => {
          NProgress.done()
        })

        if (!this.store.temp_data.list_data_selected) {
          this.store.temp_data.list_data_selected = {}
        }
        if (!this.store.temp_data.list_data_selected[this.type]) {
          this.store.temp_data.list_data_selected[this.type] = {}
        }

        this.store.temp_data.list_data_selected[this.type] = {}

        // 将临时选择列表发送到后端
        this.$axios
          .post(
            this.store.api_server + `/selected/set/${this.type}`,
            this.store.temp_data.list_data_selected[this.type]
          )
          .then(() => {
            this.alert_success('清空成功')
          })
          .catch(err => {
            this.alert_error('清空失败')
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
    },

    created() {
      //请求临时选择列表，并在store中设置
      this.$axios.post(this.store.api_server + `/selected/get/${this.type}`).then(res => {
        let { selected_list, list_not_found } = res

        if (!this.store.temp_data.list_data_selected) {
          this.store.temp_data.list_data_selected = {}
        }
        if (!this.store.temp_data.list_data_selected[this.type]) {
          this.store.temp_data.list_data_selected[this.type] = {}
        }

        this.store.temp_data.list_data_selected[this.type] = selected_list
        this.list_not_found = Object.keys(list_not_found)
      })
    }
  }
</script>

<style scoped lang="less">
  .plugin-box {
    max-height: 70vh;
    overflow: v-bind(overflow);

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
      .list {
        .selected-list {
          li {
            border: 1.8px solid rgb(69, 134, 255);
            &:nth-child(even) {
              background-color: var(--my-gray2);
            }
            &:hover {
              background-color: var(--active-list-item);
            }
          }
        }
      }

      .other {
      }
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
