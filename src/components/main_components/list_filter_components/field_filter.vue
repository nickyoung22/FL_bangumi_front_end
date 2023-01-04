<template>
  <div class="filter-box">
    <h3 class="title clearfix" @click="show = !show">
      <span class="float-left">{{ field_showName }}选择器 in {{ type_showName }}</span>

      <span class="float-right" v-if="show">↓</span>
      <span class="float-right" v-else>↑</span>

      <svg
        @click.stop="refresh"
        class="float-right hover-active click-active"
        :class="{ is_filtering: is_filtering }"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2666"
        width="200"
        height="200">
        <path
          d="M936.571429 603.428571q0 2.857143-0.571429 4-36.571429 153.142857-153.142857 248.285714t-273.142857 95.142857q-83.428571 0-161.428571-31.428571t-139.142857-89.714286l-73.714286 73.714286q-10.857143 10.857143-25.714286 10.857143t-25.714286-10.857143-10.857143-25.714286l0-256q0-14.857143 10.857143-25.714286t25.714286-10.857143l256 0q14.857143 0 25.714286 10.857143t10.857143 25.714286-10.857143 25.714286l-78.285714 78.285714q40.571429 37.714286 92 58.285714t106.857143 20.571429q76.571429 0 142.857143-37.142857t106.285714-102.285714q6.285714-9.714286 30.285714-66.857143 4.571429-13.142857 17.142857-13.142857l109.714286 0q7.428571 0 12.857143 5.428571t5.428571 12.857143zm14.285714-457.142857l0 256q0 14.857143-10.857143 25.714286t-25.714286 10.857143l-256 0q-14.857143 0-25.714286-10.857143t-10.857143-25.714286 10.857143-25.714286l78.857143-78.857143q-84.571429-78.285714-199.428571-78.285714-76.571429 0-142.857143 37.142857t-106.285714 102.285714q-6.285714 9.714286-30.285714 66.857143-4.571429 13.142857-17.142857 13.142857l-113.714286 0q-7.428571 0-12.857143-5.428571t-5.428571-12.857143l0-4q37.142857-153.142857 154.285714-248.285714t274.285714-95.142857q83.428571 0 162.285714 31.714286t140 89.428571l74.285714-73.714286q10.857143-10.857143 25.714286-10.857143t25.714286 10.857143 10.857143 25.714286z"
          p-id="6286"
          fill="#ff8a05"></path>
      </svg>
    </h3>
    <Transition>
      <div v-show="show" class="field-data-box--buttons-box">
        <div class="field-data-box clearfix">
          <div class="tools float-left">
            <el-button type="primary" @click="uncollected_field">
              未收藏的{{ field_showName }}
            </el-button>
            <el-button type="primary" @click="empty_field_resource">
              无{{ field_showName }}的资源
            </el-button>
          </div>
          <template v-for="item in field_data">
            <div class="field-data-item float-left">
              <div class="top clearfix">
                <img
                  class="float-left"
                  v-bind:src="
                    store.api_server +
                    '/static/' +
                    type +
                    `/${encodeURIComponent(`##${field}`)}/` +
                    item.storeName +
                    '/cover.jpg'
                  " />
                <div class="icons-box float-left">
                  <template v-for="file in item.file_names">
                    <File_icon
                      class="hover-active click-active"
                      @click="open(type, `##${field}`, item.storeName, file)"
                      :fileName="file"></File_icon>
                  </template>
                </div>
              </div>
              <div class="bottom clearfix">
                <el-tooltip
                  effect="dark"
                  :content="item.name.join('-')"
                  placement="left-end"
                  :hide-after="0">
                  <span
                    @click="filter(item.name)"
                    class="name float-left click-active hover-active">
                    {{ item.name[0] }}
                  </span>
                </el-tooltip>

                <span class="count float-left">
                  {{ item.count }}
                </span>

                <span class="folder float-right">
                  <File_icon
                    class="hover-active click-active"
                    @click="open(type, `##${field}`, item.storeName)"
                    v-bind="{
                      fileName: '',
                      type_appoint: 'folder',
                      tooltip_disabled: true
                    }"></File_icon>
                </span>
              </div>
            </div>
          </template>
        </div>
        <div class="buttons-box clearfix">
          <div class="float-left"></div>
          <div class="float-right">
            <el-button
              class="add-button"
              @click="refresh"
              type="warning"
              :icon="Refresh"
              size="large"
              circle></el-button>
          </div>
        </div>
      </div>
    </Transition>
    <div v-show="show" @click="show = false" class="fold-triangle"></div>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'
  import { Refresh } from '@element-plus/icons-vue'
  import File_icon from '@/components/small_components/file_icon.vue'

  export default {
    setup() {
      const store = useStore()
      return { store, Refresh }
    },
    props: ['type', 'type_showName', 'field', 'field_showName', 'field_cssSelector'],

    components: {
      File_icon
    },

    data() {
      return {
        ComponentName: 'field_filter.vue',
        is_filtering: false,

        show: false,

        field_data: []
        // selected_data:[] // 目前field只检索一个，没有响应式数据，直接传入
      }
    },

    methods: {
      open(type, ...path_arr) {
        console.log(path_arr)

        this.$axios.get(`${this.store.api_server}/open/${type}`, {
          params: {
            path: JSON.stringify(path_arr)
          }
        })
      },

      filter(selected_data) {
        this.is_filtering = true

        console.log(
          `<${this.type}  ${this.field}过滤器> 查询：
          ${selected_data} `
        )
        console.log(selected_data)

        if (selected_data.length === 0) {
          console.log(`查一个空数组，意思就是，看有没有${this.field}为空的`)

          // 把过滤判断函数 传入store ，然后在store内 遍历所有filter相应的判断函数，产生新的filterd data
          if (!this.store.filters[this.type]) {
            this.store.filters[this.type] = {}
          }
          this.store.filters[this.type][`${this.field}_filter`] = e => {
            return e[this.field].length === 0
          }
          this.store.execute_filters(this.type)

          this.highlight(true, selected_data)
          return
        }

        // 把过滤判断函数 传入store ，然后在store内 遍历所有filter相应的判断函数，产生新的filterd data
        if (!this.store.filters[this.type]) {
          this.store.filters[this.type] = {}
        }
        this.store.filters[this.type][`${this.field}_filter`] = e => {
          let e_field = e[this.field]

          // 有selected_data中的一个就算有

          let flag = false

          for (let data of selected_data) {
            if (e_field.includes(data)) {
              flag = true
              break
            }
          }

          return flag
        }
        this.store.execute_filters(this.type)
        this.highlight(false, selected_data)
      },
      refresh() {
        this.is_filtering = false

        console.log(`<${this.type}  ${this.field}过滤器>  刷新过滤逻辑`)
        if (!this.store.filters[this.type]) {
          this.store.filters[this.type] = {}
        }
        this.store.filters[this.type][`${this.field}_filter`] = e => {
          return true
        }

        this.store.execute_filters(this.type)
        this.highlight(true)
      },
      highlight(refresh, selected_data) {
        if (!this.store.highlights[this.type]) {
          this.store.highlights[this.type] = {}
        }

        this.store.highlights[this.type][`${this.field}_highlight`] = refresh
          ? [`不可能匹配得到的啦`, this.field_cssSelector]
          : [
              new RegExp(
                '(' +
                  selected_data
                    .join('|')

                    .replaceAll('(', '\\(')
                    .replaceAll(')', '\\)')
                    .replaceAll('[', '\\[')
                    .replaceAll(']', '\\]')
                    .replaceAll('.', '\\.')
                    .replaceAll('*', '\\*')
                    .replaceAll('?', '\\?') +
                  ')',
                'gi'
              ),
              this.field_cssSelector
            ]
      },

      uncollected_field() {
        this.is_filtering = true

        // 遍历所有list_data(不是filtered数据)，找到所有field
        // 对比field_filter里的所有field，即已收藏的field，找到没有收藏的field

        let all = new Set(),
          collected = new Set(),
          uncollected = new Set()

        console.log(this.store.list_data[this.type])

        this.store.list_data[this.type].forEach(e => {
          e[this.field].forEach(ee => {
            all.add(ee)
          })
        })
        console.log(`all:  `, all)

        this.field_data.forEach(e => {
          e.name.forEach(ee => {
            collected.add(ee)
          })
        })
        console.log(`collected:  `, collected)

        for (let c of collected) {
          all.delete(c)
          // 忽略大小写 相同 也算收藏过了
          ;[...all].forEach(e => {
            if (e.toLocaleLowerCase() === c.toLocaleLowerCase()) {
              all.delete(e)
            }
          })
        }

        uncollected = all
        console.log(`uncollected:  `, [...uncollected])

        if (uncollected.size === 0) {
          console.log('没有任何可找的d93d393d 这里是因为空数组有别的特殊含义')
          this.filter(['没有任何可找的d93d393d 这里是因为空数组有别的特殊含义'])
        } else {
          this.filter([...uncollected])
        }
      },
      empty_field_resource() {
        this.is_filtering = true

        this.filter([])
      }
    },

    created() {
      this.$axios
        .get(this.store.api_server + '/data_field/' + this.type + '/' + this.field)
        .then(r => {
          this.field_data = r
        })
    }
  }
</script>

<style scoped lang="less">
  .filter-box {
    max-height: 70vh;
    overflow: auto;

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

      svg {
        margin: 2px;
        width: calc(var(--body-font-size) * 1.3);
        display: inline-block;
        height: calc(var(--body-font-size) * 1.3);
        opacity: 0.6;
      }

      @keyframes rotate_ {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(180deg);
        }
      }

      .is_filtering {
        opacity: 1;
        animation: rotate_ 0.6s linear infinite;
      }
    }

    .field-data-box--buttons-box {
      .field-data-box {
        .tools {
          .el-button {
            display: block;
            margin: 0 auto;
            margin-top: 5px;
            font-size: 0.5em;
            line-height: 0.6;
            padding: 2px;
          }
        }

        .field-data-item {
          /* inline-block is ignored due to the float. If 'float' has a value other than 'none', the box is floated and 'display' is treated as 'block' */
          /* display: inline-block; */
          border: 1px solid #ff27f177;
          border-radius: 6px;
          margin: 2px;

          &:hover {
            border: 1px solid #ff39f2;
          }

          .top {
            img {
              height: 90px;
              border-radius: 3px;
              cursor: pointer;
            }

            .icons-box {
              height: 90px;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              writing-mode: vertical-lr;
              border: 2px solid rgba(235, 255, 12, 0.366);

              :deep(img) {
                // 使弹性布局内纵向排列的盒子也可以 横向撑开盒子
                writing-mode: horizontal-tb;
                display: inline-block;
                height: 18px;
                width: 18px;
              }
            }
          }

          .bottom {
            .name {
              font-size: calc(var(--body-font-size) * 0.8);
              color: var(--a-hover-color);
              font-weight: 800;
              cursor: pointer;

              &:hover {
                text-decoration: underline;
              }
            }

            .count {
              font-size: calc(var(--body-font-size) * 0.8);
              color: rgb(227, 219, 57);
              font-weight: 720;
              margin-left: 2.8px;
            }

            .folder {
              height: 18px;
              width: 18px;

              :deep(img) {
                display: inline-block;
                height: 18px;
                width: 18px;
                vertical-align: text-top;
              }
            }
          }
        }
      }

      .buttons-box {
        position: sticky;
        bottom: 8px;

        div {
          margin: 2px;
        }

        .el-button {
          &:hover {
            background-color: aqua;
          }
        }
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

  .v-enter-from,
  .v-leave-to {
    /* transform: translateY(-100%); */
    opacity: 0;
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.15s;
  }
</style>
