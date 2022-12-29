<template>
  <div class="filter-box">
    <h2 class="info">
      当前过滤后数据{{ store.list_data_filtered[type].length }}/{{ store.list_data[type].length }}
    </h2>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'
export default {
  setup() {
    const store = useStore()
    return { store }
  },
  props: ['type'],
  data() {
    return {
      ComponentName: 'filter_info.vue'
    }
  },

  methods: {},

  created() { }
}
</script>

<style scoped lang="less">
.info {
  font-size: calc(var(--body-font-size) * 1.2);
  color: aqua;
  border-bottom: 2px dashed orange;
}
</style>
