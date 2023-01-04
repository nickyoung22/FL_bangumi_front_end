<template>
  <div class="list-item"></div>
</template>

<script>
  export default {
    setup() {},

    props: ['list_item_data'],

    components: {},

    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue  loading.vue'
      }
    },

    computed: {},

    methods: {},

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less">
  .list-item {
    height: 200px;
    background-color: #282828;
  }
</style>
