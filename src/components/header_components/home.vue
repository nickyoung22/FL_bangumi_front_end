<template>
  <div class="home">
    <el-icon @click="goHome" class="icon">
      <House />
    </el-icon>
  </div>
</template>

<script>
import _throttle from '@/utils/_throttle.js'
export default {
  data() {
    return {
      ComponentName: 'header.vue  home.vue'
    }
  },
  computed: {},
  methods: {
    goHome: _throttle(function () {
      console.log('goHome!')
      this.$router.push('/')
    }, 180)
  },

  created() { },
  mounted() { }
}
</script>

<style scoped lang="less">
.home {
  width: calc(var(--header-height) - 2px);
  height: calc(var(--header-height) - 4px);
  margin-right: 2px;
  margin-top: 3px;

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
}
</style>
