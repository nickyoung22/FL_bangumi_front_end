<template>
  <div class="container">
    <el-skeleton :rows="10" animated />
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'

  export default {
    name: 'RouteLoading_name_for_keep-alive_exclude',

    setup() {
      const store = useStore()
      return { store }
    },
    created() {
      let goback = () => {
        let q = this.$route.query
        let { path } = q
        delete q.path
        this.$router.replace({
          path,
          query: {
            ...q
          }
        })
      }

      if (this.store.temp_data.routes) {
        goback()
      } else {
        this.store.get_system_info().then(() => {
          goback()
        })
      }
    }
  }
</script>

<style scoped lang="less"></style>
