<template>
  <div class="main" ref="main">
    <div class="left">
      <!-- <Infinite_list :list_data="store[`_${$route.meta.type}_list_data`]"> -->
      <!-- 这里不能按上述这么写，因为有keepalive ，而失活前route已经变到目标路由了，所以数据也会跟着变成目标路由的列表数据 -->

      <!-- 这样写，保持不变 -->
      <!-- <Infinite_list :list_data="store[`_${type}_list_data`]"> -->

      <Infinite_list :type="type" :list_data="list_data_filtered_from_store">
        <template v-slot:list_item_component="slot_data">
          <!-- // 需要配置的地方 -->
          <Anime_movie :list_item_data="slot_data.list_item_data"></Anime_movie>
        </template>
      </Infinite_list>
    </div>
    <div class="right">
      <div class="slide-bar" ref="slideBar"></div>
      <Filter_info :type="type"></Filter_info>
      <Tags_filter :type="type" :tags_cssSelector="`.tags_highlight`"></Tags_filter>
      <Field_filter v-for="field in filter_fields" :key="field.name" :type="type" :type_showName="type_showName"
        :field="field.name" :field_showName="field.showName" :field_cssSelector="`.${field.name}_highlight`">
      </Field_filter>
    </div>
  </div>
</template>

<script>
import Infinite_list from '../main_components/infinite_list.vue'
import Anime_movie from '../main_components/list_item_components/anime_movie.vue'  // 需要配置的地方

import Filter_info from '../main_components/list_filter_components/filter_info.vue'
import Tags_filter from '../main_components/list_filter_components/tags_filter.vue'
import Field_filter from '../main_components/list_filter_components/field_filter.vue'

import { useStore } from '@/stores/store.js'

import main_page_resize_fun from '@/utils/main_page_resize.js'

export default {
  setup() {
    const store = useStore()
    return { store }
  },
  components: {
    Infinite_list,
    Anime_movie,// 需要配置的地方
    Filter_info, Tags_filter, Field_filter
  },
  data() {
    return {
      ComponentName: 'main_3CY_movie.vue',  // 需要配置的地方
      type: '',
      filter_fields: []
    }
  },

  computed: {
    list_data_filtered_from_store() {
      return this.store['list_data_filtered'][this.type]
    }
  },
  methods: {
  },

  created() {
    this.type = this.$route.meta.type
    this.type_showName = this.$route.meta.name
    // 找出要设置过滤器的字段
    this.$axios.get(this.store.api_server + '/format/' + this.type).then(res => {
      // console.log(res.filter(e => e.is_filter_field))
      this.filter_fields = res.filter(e => e.is_filter_field).map(e => {
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

<style scoped>

</style>
