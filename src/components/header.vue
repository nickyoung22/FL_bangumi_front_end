<template>
  <div class="header">
    <div class="left">
      <Back></Back>
      <Home></Home>
      <Logo></Logo>
    </div>

    <RouterLinks></RouterLinks>

    <div class="right">
      <Searcher></Searcher>
      <Menu></Menu>
    </div>
  </div>
</template>

<script>
  // 导航栏 左边
  import Back from './header_components/back.vue'
  import Logo from './header_components/logo.vue'
  import Home from './header_components/home.vue'
  // 导航栏 中间
  import RouterLinks from './header_components/routerLinks.vue'
  // 导航栏 右边
  import Searcher from './header_components/searcher.vue'
  import Menu from './header_components/menu.vue'

  export default {
    setup() {},
    components: {
      // 导航栏 左边
      Back,
      Logo,
      Home,
      // 导航栏 中间
      RouterLinks,
      // 导航栏 右边
      Searcher,
      Menu
    },
    data() {
      return {
        ComponentName: 'header.vue'
      }
    },

    methods: {},

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less">
  .header {
    display: flex;
    z-index: 2;
    position: fixed;
    top: 0;

    width: 100%;
    height: var(--header-height);
    min-height: var(--min-header-height);

    background-color: var(--header-background-color);

    border-bottom: 5px solid;
    border-image: linear-gradient(to right, #552eff, #e63ae3) 1;

    .left > div,
    .right > div {
      display: inline-block;
      vertical-align: top;
    }

    .routerLinks {
      flex: 1;
    }
  }
</style>
