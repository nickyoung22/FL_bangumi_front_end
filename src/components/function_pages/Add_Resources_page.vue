<template>
  <div class="main_func">
    <div class="left">
      <el-menu
        active-text-color="var(--active-color)"
        text-color="var(--text-color)"
        background-color="var(--bg-color)"
        @select="handle_select"
        :default-openeds="default_openeds">
        <template v-for="item1 in routes">
          <el-sub-menu :index="item1.code">
            <template #title>
              <span>{{ item1.name }}</span>
            </template>
            <el-menu-item v-for="item2 in item1.children" :index="item2.code">
              {{ item2.name }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>

    <div class="right">
      <div class="add-many">
        <el-switch v-model="isAddMany" size="large" active-text="批量添加" />

        <template v-if="isAddMany">
          <div class="float-right">
            已选中
            <span>{{ store.temp_data.toAddMany ? store.temp_data.toAddMany.length : 0 }}</span>
            项
            <el-button
              type="primary"
              :disabled="!store.temp_data.toAddMany || store.temp_data.toAddMany.length === 0"
              @click="addMany(type_now)">
              添加所选中的项
            </el-button>
            <el-button type="warning" @click="selectAll">全选</el-button>
            <el-button type="info" @click="clearSelectedAll">清空</el-button>
          </div>
        </template>
      </div>
      <Infinite_list
        v-if="list_show"
        class="ul-container"
        :list_data="render_data"
        :initial_render_num="30"
        :add_render_num="18">
        <template v-slot="{ list_item_data }">
          <li :key="list_item_data.path">
            <template v-if="isAddMany">
              <el-button
                class="add-many-select-button"
                :type="
                  store.temp_data.toAddMany &&
                  store.temp_data.toAddMany.includes(list_item_data.path)
                    ? 'primary'
                    : 'info'
                "
                circle
                size="small"
                @click="addToManyList(list_item_data.path)" />
            </template>
            <a class="hover-active click-active" @click="handle_click(list_item_data)">
              <File_icon
                class="icon"
                v-bind="{
                  file_obj: list_item_data,
                  option: {
                    tooltip_disabled: true
                  }
                }"></File_icon>
              <span>{{ list_item_data.name }}</span>
              <span class="inner-num">{{ list_item_data.innerNum }}</span>
            </a>
            <div v-if="list_item_data.type === 'folder'" class="buttons">
              <el-button
                type="primary"
                @click="add(type_now, list_item_data.path)"
                :disabled="list_item_data.name.startsWith('#')">
                添加
              </el-button>
              <el-button
                type="info"
                @click="open(type_now, ...pathStr_2_pathArr(list_item_data.path))">
                打开
              </el-button>
            </div>
          </li>
        </template>
      </Infinite_list>
    </div>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'

  import File_icon from '@/components/small_components/file_icon.vue'

  // 无限列表组件
  import Infinite_list from '../main_components/infinite_list.vue'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },

    components: {
      File_icon,
      Infinite_list
    },
    data() {
      return {
        ComponentName: 'Add_Resources_page.vue',

        routes: this.store.temp_data.routes,
        list_show: false,

        isAddMany: false,

        type_now: '',
        path_now: [],
        render_data: []
      }
    },
    computed: {
      default_openeds() {
        return this.routes.map(e => e.code)
      }
    },

    methods: {
      handle_select(type) {
        this.type_now = type
        this.$router.push({
          name: 'Add_Resources_page',
          query: {
            type: this.type_now,
            storePath: '/'
          }
        })
      },
      handle_click(item) {
        // 如果点击的是文件夹，就导航到 文件夹下目录
        if (item.type === 'folder') {
          this.path_now.push(item.name)
          this.$router.push({
            name: 'Add_Resources_page',
            query: {
              type: this.type_now,
              storePath: this.pathArr_2_pathStr(this.path_now)
            }
          })
        }
        // 如果点击的是文件，就直接打开
        else {
          this.open(this.type_now, ...this.pathStr_2_pathArr(item.path))
        }
      },

      open(type, ...path_arr) {
        this.$axios.get(`${this.store.api_server}/open/${type}`, {
          params: {
            path: JSON.stringify(path_arr)
          }
        })
      },
      add(type, storeName) {
        this.$router.push({
          name: 'Add_Resources_detail',
          params: { type, storeName, operation: 'add' }
        })
      },
      addMany(type) {
        this.$router.push({
          name: 'Add_Resources_detail',
          params: { type, storeName: '  ', operation: 'addMany' }
        })
      },

      addToManyList(storePath) {
        if (!this.store.temp_data.toAddMany) {
          this.store.temp_data.toAddMany = []
        }

        if (!this.store.temp_data.toAddMany.includes(storePath)) {
          this.store.temp_data.toAddMany.push(storePath)
        } else {
          let index = this.store.temp_data.toAddMany.indexOf(storePath)
          this.store.temp_data.toAddMany.splice(index, 1)
        }
      },

      selectAll() {
        this.store.temp_data.toAddMany = this.render_data.map(e => e.path)
      },
      clearSelectedAll() {
        this.store.temp_data.toAddMany = []
      },

      pathStr_2_pathArr(pathStr) {
        return pathStr === '/' ? [] : pathStr.slice(1).split('/')
      },
      pathArr_2_pathStr(pathArr) {
        return pathArr.length === 0 ? '/' : '/' + pathArr.join('/')
      }
    },

    created() {
      this.$watch(
        () => this.$route.query,
        () => {
          // 除了进入资源详情页 其他都清空
          if (this.$route.meta.name !== '资源详情页') {
            this.store.temp_data.toAddMany = []
          }

          if (!this.$route.query.storePath) {
            this.render_data = []
            this.list_show = false
            return
          }

          this.list_show = true
          // 对路由变化做出响应...
          this.type_now = this.$route.query.type
          this.path_now = this.pathStr_2_pathArr(this.$route.query.storePath)

          // 依据此时的 type 和 path ，请求文件夹数据
          this.$axios
            .get(`${this.store.api_server}/list_to_add/${this.type_now}`, {
              params: {
                path: JSON.stringify(this.path_now)
              }
            })
            .then(r => {
              this.render_data = r

              console.log('toadd 数据请求完毕')
              // 加载状态反馈
              this.$nextTick(() => {
                console.log('列表dom渲染完毕')
              })
            })
        },
        {
          immediate: true
        }
      )
    },

    updated() {}
  }
</script>

<style scoped lang="less">
  .main_func {
    --bg-color: #373737;
    --text-color: var(--a-color);
    --active-color: var(--a-hover-color);

    // 侧边栏宽度
    --left-width: 200px;

    .left {
      width: var(--left-width);
      position: fixed;

      :deep(.el-menu) {
        .el-sub-menu {
          .el-sub-menu__title {
            font-size: calc(var(--body-font-size) * 1.2);
            font-weight: 660;
            border-bottom: 3px solid var(--a-color);

            .el-icon {
              font-size: calc(var(--body-font-size) * 1.2);
              font-weight: 600;
            }
          }

          .el-menu-item {
            font-size: var(--body-font-size);
            border-bottom: 1px solid #ffffff63;
          }
        }
      }
    }

    .right {
      margin-left: calc(var(--left-width) + 5px);

      .ul-container {
        li {
          position: relative;
          font-size: calc(var(--body-font-size) * 0.8);
          line-height: 1.8;
          padding: 5px;

          &:nth-child(even) {
            background-color: var(--my-gray2);
          }

          &:hover {
            background-color: var(--active-list-item);

            .buttons {
              display: block;
            }
          }

          .add-many-select-button {
            margin-right: 6.8px;
          }
          a {
            text-decoration: underline;
            cursor: pointer;

            :deep(.icon) {
              height: calc(var(--body-font-size) * 1);
            }

            .inner-num {
              color: #fbbf24;
              margin-left: 10px;
            }
          }

          .buttons {
            position: absolute;
            top: 2%;
            right: 2%;
            display: none; // button直到hover时才显示
          }
        }

        // 调整加载状态反馈框的位置
        :deep(.el-loading-mask) {
          z-index: 1;

          .el-loading-spinner {
            position: fixed;
            width: calc(100% - var(--left-width));
            right: 0;
            top: 50%;
          }
        }
      }
    }
  }
</style>
