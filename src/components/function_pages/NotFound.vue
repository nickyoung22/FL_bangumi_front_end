<template>
  <div class="container">
    <div class="not-found-page clearfix">
      <h1>{{ sorry }}</h1>
      <h1>{{ title1 }}</h1>
      <h2>{{ title2 }}</h2>
      <h3>{{ timeLeft }}秒后自动返回首页。</h3>
      <div class="btn-box">
        <el-button @click="goHome" size="large" type="warning">{{ buttonText }}</el-button>
      </div>
    </div>
    <h2>错误信息：{{ $route.params }}</h2>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage_name_for_keep-alive_exclude',
  data() {
    return {
      ComponentName: 'NotFound.vue',
      sorry: '抱歉!',
      title1: '当前页面不存在...',
      title2: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
      buttonText: '返回首页',
      timer: null,
      timeLeft: 1000
    }
  },

  methods: {
    goHome() {
      this.$router.push('/')
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.timeLeft -= 1

      if (this.timeLeft === 0) {
        this.$router.push('/')
      }
    }, 1000)
  }
}
</script>

<style scoped lang="less">
.not-found-page {
  width: 66vw;
  margin: 0 auto;
}
</style>
