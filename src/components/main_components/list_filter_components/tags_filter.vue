<template>
  <div class="filter-box">
    <h3 class="title clearfix" @click="show = !show">
      <span class="float-left">标签选择器</span>

      <span class="float-right" v-if="show">↓</span>
      <span class="float-right" v-else>↑</span>

      <svg @click.stop="refresh" class="float-right hover-active click-active" :class="{ is_filtering: is_filtering }"
        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2666" width="200" height="200">
        <path
          d="M936.571429 603.428571q0 2.857143-0.571429 4-36.571429 153.142857-153.142857 248.285714t-273.142857 95.142857q-83.428571 0-161.428571-31.428571t-139.142857-89.714286l-73.714286 73.714286q-10.857143 10.857143-25.714286 10.857143t-25.714286-10.857143-10.857143-25.714286l0-256q0-14.857143 10.857143-25.714286t25.714286-10.857143l256 0q14.857143 0 25.714286 10.857143t10.857143 25.714286-10.857143 25.714286l-78.285714 78.285714q40.571429 37.714286 92 58.285714t106.857143 20.571429q76.571429 0 142.857143-37.142857t106.285714-102.285714q6.285714-9.714286 30.285714-66.857143 4.571429-13.142857 17.142857-13.142857l109.714286 0q7.428571 0 12.857143 5.428571t5.428571 12.857143zm14.285714-457.142857l0 256q0 14.857143-10.857143 25.714286t-25.714286 10.857143l-256 0q-14.857143 0-25.714286-10.857143t-10.857143-25.714286 10.857143-25.714286l78.857143-78.857143q-84.571429-78.285714-199.428571-78.285714-76.571429 0-142.857143 37.142857t-106.285714 102.285714q-6.285714 9.714286-30.285714 66.857143-4.571429 13.142857-17.142857 13.142857l-113.714286 0q-7.428571 0-12.857143-5.428571t-5.428571-12.857143l0-4q37.142857-153.142857 154.285714-248.285714t274.285714-95.142857q83.428571 0 162.285714 31.714286t140 89.428571l74.285714-73.714286q10.857143-10.857143 25.714286-10.857143t25.714286 10.857143 10.857143 25.714286z"
          p-id="6286" fill="#ff8a05"></path>
      </svg>

    </h3>
    <Transition>
      <div v-show="show" class="tags-box--buttons-box">
        <div class="tags-box">
          <el-checkbox-group v-model="selected_tag">
            <!-- 如果待选项是一维数组 -->
            <template v-if="typeof tags[0] === 'string'">
              <el-checkbox-button v-for="tag in tags" :key="tag" :label="tag">
                {{ tag }}
              </el-checkbox-button>
            </template>
            <!-- 如果待选项是二维数组 -->
            <template v-else>
              <p class="tags-row" v-for="tags in tags">
                <el-checkbox-button v-for="tag in tags" :key="tag" :label="tag">
                  {{ tag }}
                </el-checkbox-button>
              </p>
            </template>
          </el-checkbox-group>
        </div>
        <div class="buttons-box clearfix">
          <div class="float-left">
            <el-switch v-model="AND_logic" active-text="∩" inactive-text="∪" />
          </div>
          <div class="float-right">
            <el-button class="add-button" @click="filter" type="primary" :icon="Select" size="large" circle></el-button>
            <el-button class="add-button" @click="refresh" type="warning" :icon="Refresh" size="large" circle>
            </el-button>
          </div>
        </div>
      </div>
    </Transition>
    <div v-show="show" @click="show = false" class="fold-triangle"></div>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'
import { Select, Refresh } from '@element-plus/icons-vue'

export default {
  setup() {
    const store = useStore()
    return { store, Select, Refresh }
  },
  props: ['type', 'tags_cssSelector'],
  data() {
    return {
      ComponentName: 'tags_filter.vue',
      is_filtering: false,

      show: false,

      tags: [],
      selected_tag: [],

      AND_logic: true,

    }
  },

  methods: {
    filter() {

      this.is_filtering = true

      console.log(
        `<${this.type}  tags过滤器>  ${this.AND_logic ? '交' : '并'}逻辑查询：
          ${this.selected_tag} `
      )


      // 这里注意，如果什么标签都不选，理论上应该查不出任何结果
      // 但在这里，我们姑且认为，查一个空数组，意思就是，看有没有tags为空的
      // 即，没有添加任何tag信息的资源
      if (this.selected_tag.length === 0) {
        console.log('查一个空数组，意思就是，看有没有tags为空的')

        // 把过滤判断函数 传入store ，然后在store内 遍历所有filter相应的判断函数，产生新的filterd data
        if (!this.store.filters[this.type]) {
          this.store.filters[this.type] = {}
        }
        this.store.filters[this.type]['tags_filter'] = e => {
          return e.tags.length === 0
        }
        this.store.execute_filters(this.type)


        this.highlight(true)
        return
      }

      // this.store.list_data_filtered[this.type] = this.store.list_data[this.type].slice(3, 18)

      // 把过滤判断函数 传入store ，然后在store内 遍历所有filter相应的判断函数，产生新的filterd data
      if (!this.store.filters[this.type]) {
        this.store.filters[this.type] = {}
      }
      this.store.filters[this.type]['tags_filter'] = e => {
        let flag,
          etags = e.tags
        if (this.AND_logic) {
          // 交集逻辑
          flag = true
          for (let tag of this.selected_tag) {
            if (!etags.includes(tag)) {
              flag = false
              break
            }
          }
        } else {
          // 并集逻辑
          flag = false
          for (let tag of this.selected_tag) {
            if (etags.includes(tag)) {
              flag = true
              break
            }
          }
        }

        return flag
      }
      this.store.execute_filters(this.type)
      this.highlight()
    },
    refresh() {
      this.is_filtering = false

      console.log(`<${this.type} tags过滤器>  刷新过滤逻辑`)
      this.selected_tag = []
      if (!this.store.filters[this.type]) {
        this.store.filters[this.type] = {}
      }
      this.store.filters[this.type]['tags_filter'] = e => {
        return true
      }

      this.store.execute_filters(this.type)
      this.highlight(true)
    },
    highlight(refresh) {
      if (!this.store.highlights[this.type]) {
        this.store.highlights[this.type] = {}
      }


      this.store.highlights[this.type]['tags_highlight'] = refresh
        ? [
          `不可能匹配得到的啦`,
          this.tags_cssSelector
        ]
        : [
          new RegExp('(' + this.selected_tag.join('|') + ')', 'g'),
          this.tags_cssSelector
        ]
    }
  },

  created() {
    this.$axios.get(this.store.api_server + '/format/' + this.type).then(r => {
      for (let i of r) {
        if (i.name === 'tags') {
          this.tags = i.selection
        }
      }
    })
  }
}
</script>

<style scoped lang="less">
.filter-box {
  max-height: 70vh;
  overflow: auto;

  .title {
    position: sticky;
    top: 0px;
    z-index: 1;
    font-size: var(--body-font-size);
    color: rgb(255, 138, 5);
    border-radius: 6px;
    background-color: var(--header-background-color);

    &:hover {
      cursor: pointer;
      background-color: var(--active-list-item);
    }

    svg {
      margin: 2px;
      width: calc(var(--body-font-size)*1.3);
      display: inline-block;
      height: calc(var(--body-font-size)*1.3);
      opacity: .6;
    }

    @keyframes rotate_ {
      0% {
        transform: rotate(0deg)
      }

      100% {
        transform: rotate(180deg)
      }
    }

    .is_filtering {
      opacity: 1;
      animation: rotate_ .6s linear infinite;
    }

  }

  .tags-box--buttons-box {

    .tags-box {
      .tags-row {
        border-bottom: 1px solid rgb(255, 138, 5);

        :deep(.el-checkbox-button__inner) {
          font-size: calc(var(--body-font-size)*1);
          font-weight: 580;
          line-height: 35%;
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
