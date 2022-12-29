<template>
  <!-- mouseout 冒泡的 很麻烦， 用mouseleave -->
  <div class="menu" :class="{ unfolding: menu_show }" @mouseover="Show" @mouseleave="offShow">
    <el-icon class="icon" :class="{ 'unfolding-icon': menu_show }" @click.stop>
      <ArrowDown />
    </el-icon>
    <Transition @after-enter="transition_finished = true">
      <div class="menu-list" :class="{ unfolding: menu_show }" v-show="menu_show" @click.stop>
        <Add :transition_finished="transition_finished"></Add>
        <System_info :transition_finished="transition_finished"></System_info>
      </div>
    </Transition>
  </div>
</template>

<script>
import Add from './menu_components/add.vue'
import System_info from './menu_components/system_info.vue'

export default {
  components: {
    Add, System_info
  },
  data() {
    return {
      ComponentName: 'header.vue  menu.vue',
      menu_show: false,
      transition_finished: false
    }
  },
  computed: {},
  methods: {
    Show() {
      this.menu_show = true
    },

    offShow() {
      if (this.menu_show) {
        this.menu_show = false
        this.transition_finished = false
      }
    }
  },

  created() { },
  mounted() {
  },


}
</script>

<style scoped lang="less">
.menu {
  /* position: relative; */
  text-align: right;
  width: calc(var(--header-height) - 2px);
  margin-right: 2px;
  margin-top: 2px;

  .icon {
    cursor: pointer;

    &:hover {
      background-color: var(--my-gray2);
    }

    &,
    svg {
      transition: all 0.2s ease;
      color: var(--my-gray);
      display: block;
      width: 95%;
      height: calc((var(--header-height) - 4px) * 95%);

    }

    svg {
      &:hover {
        color: var(--my-light-white);
      }
    }

  }

  .menu-list {
    background-color: var(--header-background-color);
    border: 2px solid var(--my-gray);

    .menu-item {
      width: calc(var(--header-height) - 2px);
      height: calc(var(--header-height) - 4px);
    }
  }

}





:deep(.unfolding-icon svg) {
  transform: rotate(180deg);
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.22s;
}
</style>
