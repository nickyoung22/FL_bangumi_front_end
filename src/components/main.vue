<template>
  <div class="main" ref="main">
    <div class="left">
      <!-- <Infinite_list :list_data="store[`_${$route.meta.type}_list_data`]"> -->
      <!-- 这里不能按上述这么写，因为有keepalive ，而失活前route已经变到目标路由了，所以数据也会跟着变成目标路由的列表数据 -->

      <!-- 这样写，保持不变 -->
      <!-- <Infinite_list :list_data="store[`_${type}_list_data`]"> -->

      <Infinite_list
        :list_data="list_data_filtered_from_store"
        :initial_render_num="10"
        :add_render_num="6"
        @list_updated="list_updated">
        <template v-slot:list_item_component="slot_data">
          <component
            :is="item_component_name"
            :list_item_data="slot_data.list_item_data"
            :key="`${slot_data.list_item_data.storeName}`"></component>
        </template>
      </Infinite_list>
    </div>
    <div class="right" ref="right">
      <div class="slide-bar" ref="slideBar"></div>
      <Basic_sorter></Basic_sorter>
      <Filter_info :type="type"></Filter_info>
      <hr />
      <Tags_filter :type="type" :tags_cssSelector="`.tags_highlight`"></Tags_filter>
      <hr />
      <Field_filter
        v-for="field in filter_fields"
        :key="field.name"
        :type="type"
        :type_showName="type_showName"
        :field="field.name"
        :field_showName="field.showName"
        :field_cssSelector="`.${field.name}_highlight`"></Field_filter>
      <hr />
      <template v-for="plugin_name in plugin_names" :key="plugin_name">
        <component :is="plugin_name" :type="type" :type_showName="type_showName"></component>
      </template>
    </div>
  </div>
</template>

<script>
  import { defineAsyncComponent } from 'vue'
  import { useStore } from '@/stores/store.js'

  // 侧边栏调整宽度行为
  import main_page_resize_side_bar_fun from '@/utils/main_page_resize_side_bar.js'

  // 无限列表组件
  import Infinite_list from './main_components/infinite_list.vue'

  // 侧边栏内的一些组件 
  import Filter_info from './main_components/filter_components/filter_info.vue'
  import Tags_filter from './main_components/filter_components/tags_filter.vue'
  import Field_filter from './main_components/filter_components/field_filter.vue'
  import Basic_sorter from './main_components/sorter_components/basic_sorter.vue'

  // 侧边栏内的插件
  const _plugins = import.meta.glob('./main_components/plugins_components/*.vue')
  const plugins = {}
  for (let path of Object.keys(_plugins)) {
    let name = path.match(/.\/main_components\/plugins_components\/(.*)\.vue/)[1]
    plugins[name] = defineAsyncComponent(_plugins[path])
  }

  // 列表项组件
  import loading_item_component from './main_components/list_item_components/loading.vue'
  const _list_items = import.meta.glob('./main_components/list_item_components/*.vue')
  const list_items = {}
  for (let path of Object.keys(_list_items)) {
    let name = path.match(/.\/main_components\/list_item_components\/(.*)\.vue/)[1]
    list_items[name] = defineAsyncComponent(_list_items[path])
  }

  export default {
    setup() {
      const store = useStore()
      return { store }
    },
    components: {
      Infinite_list,

      Filter_info,
      Tags_filter,
      Field_filter,

      Basic_sorter,

      loading_item_component,

      ...list_items, // 将所有 列表项组件 以异步组件的形式加载

      ...plugins // 将所有 插件组件 以异步组件的形式加载
    },

    data() {
      return {
        ComponentName: 'main.vue',

        item_component_name: 'loading_item_component',

        type: '',
        type_showName: '',
        filter_fields: [],
        plugin_names: []
      }
    },

    computed: {
      list_data_filtered_from_store() {
        return this.store['list_data_filtered'][this.type]
          ? this.store['list_data_filtered'][this.type]
          : []
      }
    },
    methods: {
      list_updated() {
        // highlight
        this.store.execute_highlights(this.type)
      }
    },

    created() {
      this.type = this.$route.params.route2

      // 设置 种类名称 列表项组件
      let set_typeName_componentName = () => {
        for (let item1 of this.store.temp_data.routes) {
          for (let item2 of item1.children) {
            if (item2.code === this.type) {
              this.type_showName = item2.name
              const componentName = item2.componentName
              this.item_component_name = componentName
            }
          }
        }
      }
      set_typeName_componentName()

      // 找出要设置过滤器的字段
      this.$axios.get(this.store.api_server + '/format/' + this.type).then(res => {
        // console.log(res.filter(e => e.is_filter_field))
        this.filter_fields = res
          .filter(e => e.is_filter_field)
          .map(e => {
            return {
              name: e.name,
              showName: e.showName
            }
          })
      })

      // 找出要设置的插件
      let set_plugins = () => {
        for (let item1 of this.store.temp_data.routes) {
          for (let item2 of item1.children) {
            if (item2.code === this.type) {
              const plugin_names = item2.plugins
              this.plugin_names = plugin_names
            }
          }
        }
      }
      set_plugins()
    },
    mounted() {
      // 设置横向拖动大小的功能
      main_page_resize_side_bar_fun.call(this)
    },
    updated() {
      console.log('updated -------------------------')
    }
  }
</script>

<style scoped lang="less">
  /* 右侧边栏宽度 */

  .main {
    --right-sider-width: 350px;
    /* --right-sider-width: 10px; */

    .left {
      /* flex: 1; */
      margin-right: calc(var(--right-sider-width) + 10px);
    }

    .right {
      .slide-bar {
        position: absolute;
        top: 0;
        left: -12px;
        width: 15px;
        height: 100%;
        border-radius: 8px;
        background-color: rgb(124, 1, 255);

        &:hover {
          cursor: e-resize !important;
          background-color: rgb(244, 42, 255);
        }
        &:active {
          background-color: rgb(199, 34, 208);
        }
      }

      position: fixed;
      right: 2px;
      background-color: var(--header-background-color);
      top: var(--header-height);

      // 响应式布局
      display: none;
      @media (min-width: 400px) {
        & {
          display: block;
        }
      }

      width: var(--right-sider-width);
      padding-left: 2px;
      /* border: 2px solid rgb(37, 237, 255); */
      height: 85vh;

      /* 侧边栏滚动 */
      /* overflow: auto; */

      .filter-box,
      .plugin-box,
      .sorter-box {
        border: 2px solid rgba(250, 128, 114, 0.747);
        border-radius: 15px;
        margin: 2px;
        padding-left: 2.8px;
      }
    }
  }
</style>
