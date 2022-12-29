<template>
  <div class="back">
    <el-icon @click="back" class="icon">
      <Back />
    </el-icon>
  </div>
</template>

<script>



import _throttle from '@/utils/_throttle.js'
export default {
  data() {
    return {
      ComponentName: 'header.vue  back.vue'
    }
  },
  computed: {},
  methods: {
    back: _throttle(function () {
      console.log('back!')
      this.$router.back()

    }, 180)
  },

  created() { },
  mounted() {

  }


}
</script>

<style scoped lang="less">
.back {
  width: calc(var(--header-height) - 2px);
  height: calc(var(--header-height) - 4px);
  margin-right: 2px;
  margin-top: 2px;

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
