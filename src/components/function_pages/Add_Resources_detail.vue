<template>
  <div class="main_func">
    <div class="form-box">
      <template v-for="item in format" :key="item.name">
        <!-- 是否是要show的字段，例如hots等是后台自动生成的字段，在详情页不展示。但这些字段每次和别的字段一样初始化设置，一起发到后端 -->
        <template v-if="item.show">
          <div
            class="form-box-row"
            :class="{
              empty:
                (item.type === 'String' && item.value === '') ||
                (item.type === 'Array:String' && item.value.length === 0) ||
                (item.type === 'Date' && (item.value === '' || item.value === null))
            }">
            <p class="showName">{{ item.showName }}</p>
            <!-- 字符串类型的资源 -->
            <template v-if="item.type === 'String'">
              <el-input :disabled="item.readonly" v-model="item.value" :placeholder="item.name" />
            </template>

            <!-- 数组类型的资源 -->
            <template v-else-if="item.type === 'Array:String'">
              <!-- 如果有待选项 -->
              <template v-if="item.selection">
                <el-checkbox-group v-model="item.value">
                  <!-- 如果待选项是一维数组 -->
                  <template v-if="typeof item.selection[0] === 'string'">
                    <el-checkbox-button v-for="tag in item.selection" :key="tag" :label="tag">
                      {{ tag }}
                    </el-checkbox-button>
                  </template>
                  <!-- 如果待选项是二维数组 -->
                  <template v-else>
                    <p class="tags-row" v-for="tags in item.selection">
                      <el-checkbox-button v-for="tag in tags" :key="tag" :label="tag">
                        {{ tag }}
                      </el-checkbox-button>
                    </p>
                  </template>
                </el-checkbox-group>
              </template>
              <!-- 如果没有待选项 -->
              <template v-else>
                <chn_input_array v-model="item.value"></chn_input_array>
              </template>
            </template>

            <!-- 日期类型的资源 -->
            <template v-else-if="item.type === 'Date'">
              <el-config-provider :locale="zhCn">
                <el-date-picker
                  v-model="item.value"
                  type="date"
                  placeholder="陈浩楠，请Pick a day"
                  format="YYYY/MM/DD"
                  value-format="YYYY/MM/DD" />
              </el-config-provider>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div class="submit-box">
      <el-popconfirm
        confirm-button-text="确认"
        cancel-button-text="取消"
        cancel-button-type="info"
        title="你确认要添加本资源吗？"
        @confirm="submit">
        <template #reference>
          <el-button type="primary">提交</el-button>
        </template>
      </el-popconfirm>

      <template v-if="operation === 'modify'">
        <el-popconfirm
          confirm-button-text="确认删除"
          confirm-button-type="danger"
          cancel-button-text="取消"
          cancel-button-type="info"
          title="你确认要从数据库删除本资源吗？"
          @confirm="delete_from_db">
          <template #reference>
            <el-button type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>

      <el-button type="info" @click="goback">返回</el-button>
    </div>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'
  import chn_input_array from './comps/chn_input_array.vue'
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'

  export default {
    name: 'Add_Resources_detail_name_for_keep-alive_exclude',
    setup() {
      const store = useStore()
      return { store }
    },

    components: { chn_input_array },
    data() {
      return {
        ComponentName: 'Add_Resources_detail.vue',
        operation: '',

        zhCn,

        // format 是依托后端设定好的数据格式，渲染相应的表单组件，并且依靠value字段建立响应式数据联系
        // 如果是add ，那么就 依照format中各字段的默认值，进行初始化各字段value
        // 如果是modify ，那么就 按照数据{}，修改format中value值
        format: {},

        modify_data_copy: {}
      }
    },
    computed: {
      //最终提交的数据格式，add modify，最终都是将此数据 提交到数据库，代表每个数据
      final_data() {
        let obj = {}

        this.format.forEach(e => {
          let type = e.type,
            value = e.value,
            name = e.name

          // trim
          if (type === 'String') {
            value = value.trim()
          }
          if (type === 'Array:String') {
            value = value.concat()
            value.forEach((e_, i) => {
              value[i] = e_.trim()
            })
          }

          obj[name] = value
        })

        return obj
      }
    },

    methods: {
      submit() {
        this.$axios.post(this.store.api_server + `/${this.operation}`, this.final_data).then(() => {
          this.store.get_list_data(this.final_data.type, false).then(() => {
            //提交之后 请求新数据 得到新数据之后 再返回
            console.log('已经得到了新数据~~  即将返回资源展示页')

            // 根据从服务器得到的新数据，把 filter_data_list中数据作相应更新修改 ，否则前端无法及时反映数据的修改情况
            this.store.update_list_data_filtered(this.final_data, {
              operation: this.operation
            })

            this.$router.back()
          })
        })
      },
      delete_from_db() {
        this.$axios.post(this.store.api_server + `/delete`, this.final_data).then(() => {
          this.store.get_list_data(this.final_data.type, false).then(() => {
            //提交之后 请求新数据 得到新数据之后 再返回
            console.log('已经得到了新数据~~  即将返回资源展示页')

            // 根据从服务器得到的新数据，把 filter_data_list中数据作相应更新修改 ，否则前端无法及时反映数据的修改情况
            this.store.update_list_data_filtered(this.final_data, {
              operation: 'delete'
            })

            this.$router.back()
          })
        })
      },

      goback() {
        if (this.operation === 'modify') {
          let names = Object.keys(this.store.temp_data.modify_data)
          names.forEach(name => {
            this.store.temp_data.modify_data[name] = this.modify_data_copy[name]
          })
        }

        this.$router.back()
      }
    },

    created() {
      // this.type = this.$route.params.type
      // this.storeName = this.$route.params.storeName
      this.operation = this.$route.params.operation

      this.$axios.get(this.store.api_server + '/format/' + this.$route.params.type).then(res => {
        this.format = res

        // format --> 如果是 add ，那么就 依照  各字段的默认值 ，进行初始化各字段value
        if (this.operation === 'add') {
          this.format.forEach(e => {
            switch (e.type) {
              case 'String':
                e.value = ''
                break
              case 'Array:String':
                e.value = []
                break
              case 'Date':
                e.value = ''
                break

              default:
                e.value = '未知格式数据'
            }
          })
          // 随后，根据传进来的type、storeName，改其format中相应的值
          // add中，初始name 默认为 storeName
          this.format.forEach(e => {
            if (e.name === 'type') {
              e.value = this.$route.params.type
            } else if (e.name === 'name') {
              // 默认名字 ：storeName的后两块的组合
              let storeName_arr = this.$route.params.storeName.slice(1).split('\\')
              if (storeName_arr.length === 1) {
                e.value = storeName_arr[0]
              } else {
                let len = storeName_arr.length
                e.value = storeName_arr[len - 2] + ' > ' + storeName_arr[len - 1]
              }
            } else if (e.name === 'storeName') {
              e.value = this.$route.params.storeName
            }
          })
        }

        // format -->  如果是modify ，那么就 按照 store中 数据{}，修改format中value值
        else if (this.operation === 'modify') {
          this.modify_data_copy = JSON.parse(JSON.stringify(this.store.temp_data.modify_data))

          this.format.forEach(e => {
            e.value = this.store.temp_data.modify_data[e.name]
          })
        }
      })
    },
    mounted() {},
    unmounted() {}
  }
</script>

<style scoped lang="less">
  .form-box-row {
    border-bottom: 2px solid rgb(28, 225, 255);
    padding: 0.5rem;

    .showName {
      font-weight: 600;
      color: var(--my-light-white);
    }

    &.empty {
      opacity: 0.8;
      background-color: rgba(255, 247, 0, 0.268);
    }
  }

  .tags-row {
    border-bottom: 1px solid rgb(255, 138, 5);
  }

  .submit-box {
    padding: 10px;
    text-align: right;
    margin-right: 12vw;
  }
</style>
