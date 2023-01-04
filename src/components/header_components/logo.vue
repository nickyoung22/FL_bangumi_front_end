<template>
  <div class="logo"></div>
</template>

<script>
  export default {
    setup() {},
    components: {},
    data() {
      return {
        ComponentName: 'header.vue  logo.vue'
      }
    },

    methods: {},

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less">
  .logo {
    width: calc(var(--header-height) - 2px);
    min-width: calc(var(--min-header-height) - 2px);
    height: calc(var(--header-height) - 2px);
    min-height: calc(var(--min-header-height) - 2px);

    background: linear-gradient(to right, #d100bc, #00abda);
    border-radius: 0.6rem;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.2) translate(10%, 10%);
      cursor: pointer;
    }
  }
</style>
