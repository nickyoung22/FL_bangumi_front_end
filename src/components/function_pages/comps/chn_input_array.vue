<template>
  <div class="inputs">
    <template v-for="(item, index) in my_array">
      <div class="inputs-row">
        <el-input v-model="my_array[index]" placeholder="Please input" ref="inputs" />
        <span class="button-placehodler">
          <span class="button-hidden">
            <el-button
              @click="deleteItem(index)"
              type="danger"
              :icon="CloseBold"
              size="small"
              circle></el-button>
          </span>
        </span>
      </div>
    </template>

    <div class="inputs-row2 clearfix">
      <div class="add-button-wrapper float-right">
        <el-button
          class="add-button"
          @click="addItem"
          type="primary"
          :icon="Plus"
          size="small"
          circle></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { CloseBold, Plus } from '@element-plus/icons-vue'
  export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],

    setup() {
      return {
        CloseBold,
        Plus
      }
    },

    data() {
      return {
        // prop应为单向数据流， 像下面这样做就使 prop 和后续更新无关了
        my_array: this.modelValue
      }
    },

    watch: {
      my_array: {
        handler() {
          this.$emit('update:modelValue', this.my_array)
        },
        deep: true
      }
    },

    methods: {
      deleteItem(index) {
        this.my_array.splice(index, 1)
      },
      addItem() {
        this.my_array.push('')
        // 添加新的一项后，聚焦
        this.$nextTick().then(() => {
          //   console.log(this.$refs.inputs)
          this.$refs.inputs[this.$refs.inputs.length - 1].focus()
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .inputs {
    .el-input {
      flex: 1;
      margin-right: 8px;
    }

    .inputs-row {
      display: flex;

      .button-placehodler {
        width: 20px;

        .button-hidden {
          display: none;

          &:hover {
            display: inline-block;
          }
        }

        &:hover .button-hidden {
          display: inline-block;
        }
      }
    }
  }
</style>
