<template>
  <div class="menu-item">
    <el-tooltip
      :disabled="!transition_finished"
      class="box-item"
      effect="dark"
      content="添加资源"
      placement="left-start"
      :hide-after="0">
      <el-icon class="icon" @click="open_Add_Resources_page">
        <i-ep-plus />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: ['transition_finished'],
    data() {
      return {
        ComponentName: 'header.vue  menu.vue  add.vue'
      }
    },
    computed: {},
    methods: {
      open_Add_Resources_page() {
        this.$router.push({
          name: 'Add_Resources_page'
        })
      }
    },

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less">
  .icon {
    cursor: pointer;

    &,
    svg {
      transition: all 0.2s ease;
      color: var(--my-gray);
      display: block;
      width: 95%;
      height: 95%;
    }

    svg {
      &:hover {
        color: var(--my-light-white);
      }
    }
  }
</style>
