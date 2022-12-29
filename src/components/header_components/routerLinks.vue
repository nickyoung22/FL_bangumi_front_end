<template>
  <div class="routerLinks">
    <div class="routerLinks-wrapper">
      <div class="firstRow-wrapper">
        <div class="firstRow">
          <template v-if="$route.name === 'NotFound'"></template>
          <template v-else-if="could_match">
            <template v-for="item1 in routes">
              <router-link active-class="active-router-link" :to="item1.path">
                {{ item1.meta.name }}
              </router-link>
            </template>
          </template>
          <template v-else>功能界面</template>
        </div>
      </div>

      <div class="secondRow-wrapper">
        <div class="secondRow">
          <template v-if="$route.name === 'NotFound'"></template>
          <template v-else-if="could_match">
            <template v-for="item1 in routes">
              <template v-if="routeNow.startsWith(item1.path)">
                <router-link v-for="item2 in item1.children" active-class="active-router-link"
                  :to="item1.path + '/' + item2.path">
                  {{ item2.meta.name }}
                </router-link>
              </template>
            </template>
          </template>
          <template v-else>
            {{ $route.meta.name }}
            {{ $route.params.operation ? ' -> 操作：' + ($route.params.operation === 'add' ? '添加' : '修改') : '' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() { },
  components: {},
  data() {
    return {
      ComponentName: 'header.vue  routerLinks.vue',
      routes: this.$router.options.routes.filter(e => e.meta && e.meta.need_render_link === true)
    }
  },
  computed: {
    routeNow() {
      return this.$route.path
    },

    could_match() {
      let flag = false
      for (let r of this.routes) {
        if (this.routeNow.startsWith(r.path)) flag = true
      }

      return flag
    }
  },

  methods: {},

  created() {
    // console.log(this.$router.options.routes)
  },
  mounted() { }
}
</script>

<style scoped  lang="less">
.routerLinks {
  height: 100%;

  .routerLinks-wrapper {
    height: 100%;
    text-align: center;


    .firstRow-wrapper {
      height: calc(var(--header-height) * (3 / 5));
      border-bottom: 0.6px solid #787878;
      font-size: calc(var(--header-height) * 0.42);
      font-weight: 800;

      position: relative;

      .firstRow {
        position: absolute;
        width: 100%;
        bottom: 0;

        a {
          padding-left: 0.6rem;
          padding-right: 0.6rem;
        }
      }
    }





    .secondRow-wrapper {
      height: calc(var(--header-height) * (1.75 / 5));
      font-size: calc(var(--header-height) * 0.42 * (2 / 3));
      font-weight: 600;
      position: relative;

      .secondRow {
        position: absolute;
        width: 100%;
        bottom: 0;
      }

      a {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
    }

  }



  a {
    transition: border 0.2s;
  }

  @keyframes animated-border {
    0% {}

    100% {

      text-shadow: 0 0 10px #0ebeff, 0 0 20px #0ebeff, 0 0 50px #0ebeff, 0 0 100px #0ebeff, 0 0 200px #0ebeff;
      color: var(--my-light-white);
      transform: translateY(-2px);
    }
  }

  .active-router-link {
    border-bottom: 5px solid #009dff;
    font-weight: 900;
    animation: animated-border 0.6s alternate-reverse infinite;


  }
}
</style>
