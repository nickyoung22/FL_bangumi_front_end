<template>
  <div class="main" ref="main">
    <div class="left">
      <!-- <Infinite_list :list_data="store[`_${$route.meta.type}_list_data`]"> -->
      <!-- 这里不能按上述这么写，因为有keepalive ，而失活前route已经变到目标路由了，所以数据也会跟着变成目标路由的列表数据 -->

      <!-- 这样写，保持不变 -->
      <!-- <Infinite_list :list_data="store[`_${type}_list_data`]"> -->

      <Infinite_list :type="type" :list_data="list_data_filtered_from_store">
        <template v-slot:list_item_component="slot_data">
          <component
            :is="item_component_name"
            :list_item_data="slot_data.list_item_data"></component>
        </template>
      </Infinite_list>
    </div>
    <div class="right">
      <div class="slide-bar" ref="slideBar"></div>
      <Filter_info :type="type"></Filter_info>
      <Tags_filter :type="type" :tags_cssSelector="`.tags_highlight`"></Tags_filter>
      <Field_filter
        v-for="field in filter_fields"
        :key="field.name"
        :type="type"
        :type_showName="type_showName"
        :field="field.name"
        :field_showName="field.showName"
        :field_cssSelector="`.${field.name}_highlight`"></Field_filter>
    </div>
  </div>
</template>

<script>
  const _list_items = import.meta.glob('./main_components/list_item_components/*.vue')
  const list_items = {}
  for (let path of Object.keys(_list_items)) {
    let name = path.match(/.\/main_components\/list_item_components\/(.*)\.vue/)[1]
    list_items[name] = defineAsyncComponent(_list_items[path])
  }

  import { defineAsyncComponent } from 'vue'

  import Infinite_list from './main_components/infinite_list.vue'
  import loading_item_component from './main_components/list_item_components/loading.vue'

  import Filter_info from './main_components/list_filter_components/filter_info.vue'
  import Tags_filter from './main_components/list_filter_components/tags_filter.vue'
  import Field_filter from './main_components/list_filter_components/field_filter.vue'

  import { useStore } from '@/stores/store.js'

  import main_page_resize_fun from '@/utils/main_page_resize.js'

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

      loading_item_component,

      ...list_items // 将所有列表项组件以异步组件的形式加载
    },
    data() {
      return {
        ComponentName: 'main.vue',

        item_component_name: 'loading_item_component',

        type: '',
        type_showName: '',
        filter_fields: []
      }
    },

    computed: {
      list_data_filtered_from_store() {
        return this.store['list_data_filtered'][this.type]
          ? this.store['list_data_filtered'][this.type]
          : []
      }
    },
    methods: {},

    created() {
      this.type = this.$route.params.route2

      // 只有设置好route信息后，才能才能去遍历
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
      if (this.store.temp_data.routes) {
        set_typeName_componentName()
      } else {
        this.store.get_system_info().then(res => {
          set_typeName_componentName()
        })
      }

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
    },
    mounted() {
      // 设置横向拖动大小的功能
      main_page_resize_fun.call(this)
    }
  }
</script>

<style scoped></style>
