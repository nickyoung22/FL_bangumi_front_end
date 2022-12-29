<template>
  <div class="searcher">
    <Transition @after-enter="input_onAfterEnter">
      <div class="input-and-result" v-if="input_show" @click.stop @mousedown.stop>
        <el-input ref="inputEle" class="search-input" v-model="search_text" @input="startSearching(), search()"
          placeholder="请输入搜索内容" />
        <div class="progress-bars">
          <!-- 正在搜索进度条 -->
          <el-progress v-if="isSearching" :percentage="100" :format="() => `正在搜索...`" :indeterminate="true"
            :duration="0.8" />
          <!-- 搜索结果为空提示条 -->
          <el-progress class="warn-bar" v-if="isEmptyResult" :percentage="100" :format="() => `结果为空`" />
          <!-- 搜索报错警示条 -->

          <el-progress class="error-bar" v-if="isError" :percentage="100" :format="() => `${ErrorMsg}`" />
        </div>
        <ul v-if="this.search_text.trim() !== ''" class="result">
          <li class="item result-info">
            共 <span class="num">{{ resultList.length }}</span> 条搜索结果
          </li>
          <div class="result-list">
            <li v-for="item in resultList" :key="item.type + item.storeName" class="item">
              <span class="type">种类： {{ item.type }} <br> </span>
              <span class="hover-active highlight">名称： {{ item.name }} <br> </span>
              <span class="hover-active highlight" v-if="item.other_name.length">别名： {{ item.other_name.join(',') }}
                <br> </span>
              <span class="hover-active highlight">存储名称： {{ item.storeName }}</span>
            </li>
          </div>
        </ul>
      </div>
    </Transition>

    <el-icon @click.stop="toggleShow" class="icon" :class="{ 'searching-icon': input_show }">
      <Search />
    </el-icon>
  </div>
</template>

<script>
import _debounce from '@/utils/_debounce.js'
import { useStore } from '@/stores/store.js'

export default {
  setup() {
    const store = useStore()
    return { store }
  },
  data() {
    return {
      ComponentName: 'header.vue  searcher.vue',
      input_show: false,
      search_text: '',
      isSearching: false,
      // isEmptyResult: false,
      isError: false,
      ErrorMsg: '',
      resultList: []
    }
  },
  computed: {
    isEmptyResult() {
      // 结果为空标志，仅在 结果数组为0，并且搜索过程已经结束时，并且搜索框内容不为空，并且没有出错
      return (
        this.resultList.length === 0 &&
        !this.isSearching &&
        this.search_text.trim() !== '' &&
        this.isError === false
      )
    }
  },
  methods: {
    toggleShow() {
      this.input_show = !this.input_show
    },
    offShow() {
      if (this.input_show) {
        this.input_show = false
      }
    },
    startSearching() {
      console.log('startSearching');

      if (this.search_text.trim() === '') return

      this.isSearching = true
      this.isError = false
      if (this.search_text.trim() === '') this.isSearching = false
    },
    search: _debounce(function () {
      if (this.search_text.trim() === '') {
        this.resultList = []
        this.isSearching = false
        return
      }

      const text = this.search_text.trim()


      console.log(`开始搜索 ${text}`)
      this.isSearching = true
      // 暂时不进行多关键词搜索
      // let search_text_arr = text.split(/\ +/) 
      let search_text_arr = [text]
      let reg = new RegExp('(' +

        search_text_arr.join('|')
          .replaceAll('(', '\\(')
          .replaceAll(')', '\\)')
          .replaceAll('[', '\\[')
          .replaceAll(']', '\\]')
          .replaceAll('.', '\\.')
          .replaceAll('*', '\\*')
          .replaceAll('?', '\\?')

        + ')', 'gi')

      // 模拟搜索的网络请求操作
      let doSearch = () => {
        return new Promise((resolve, reject) => {

          // 分别管理 数据库内的搜索结果 todo的数据的结果
          let result = []
            , result2 = []

          let { list_data: list_data_all } = this.store
          for (let type of Object.keys(list_data_all)) {
            let list_data_type = list_data_all[type]
            list_data_type.forEach(data_obj => {
              let TEXT = ''
              for (let key of Object.keys(data_obj)) {
                if (!/^(name|other_name|storeName)$/.test(key)) continue
                TEXT += `${(typeof data_obj[key]) === 'object' ? data_obj[key].join(' ') : data_obj[key]}\n`
              }

              if (reg.test(TEXT)) {
                result.push(data_obj)
              }
            })

          }

          // console.log(result)

          resolve(result)
        })


      }
      doSearch()
        .then(r => {
          this.resultList = r
          //高亮 highlight
          let HighLight = html => {
            return html.replace(reg, function (item) {
              return '<mark>' + item + '</mark>'
            })
          }
          let unHighLight = html => {
            var reg = new RegExp('(<mark>|</mark>)', 'g')
            return html.replace(reg, function (item) {
              return ''
            })
          }
          this.$nextTick(() => {
            console.log('渲染后的列表 条目个数：', document.querySelectorAll('.result .result-list li').length)
              ;[...document.querySelectorAll('.result .result-list li span.highlight')].forEach(e => {
                e.innerHTML = HighLight(unHighLight(e.innerHTML))
              })
          })
        })
        .catch(err => {
          this.isError = true
          this.ErrorMsg = err
          throw new Error(err)
        })
        .finally(() => {
          this.isSearching = false
          // 这里是防止 滞后的请求结果使得当前已经空的列表又被渲染出了内容
          if (this.search_text.trim() === '') {
            this.resultList = []

            this.isSearching = false
            return
          }
        })
    }),
    input_onAfterEnter(el) {
      // 打开后 自动聚焦输入框
      this.$refs.inputEle.focus()
    }
  },

  created() { },
  mounted() {
    // 点击页面其他地方 搜索组件消失
    document.addEventListener('mousedown', this.offShow)
  }
}
</script>

<style scoped  lang="less">
.searcher {
  position: relative;
  text-align: right;
  width: calc(var(--header-height) - 2px);
  height: calc(var(--header-height) - 4px);

  margin-right: 2px;
  margin-top: 2px;


  .input-and-result {
    position: absolute;
    right: 100%;
    margin-right: 2px;
    top: calc(var(--header-height) * 0.02);

    height: 100%;
    width: 60vw;

    background-color: transparent;

    font-size: calc(var(--search-font-size) * 0.8);

    text-align: left;

    .search-input {
      height: 90%;

      :deep(input) {
        font-size: var(--search-font-size);
        padding-left: 12px;
      }
    }


    .result {
      height: 80vh;
      background-color: #181818;
      border: 1.8px solid rgba(250, 128, 114, 0.575);

      .result-info {
        font-weight: 600;
        border-bottom: 2px solid #c1c1c1;

        .num {
          color: #ff6b21;
        }
      }

      .result-list {
        .item {
          border-bottom: 1.8px solid rgba(0, 170, 255, 0.575);
          word-wrap: break-word;

          &:nth-child(even) {
            background-color: var(--my-gray2);
          }

          &:hover {
            background-color: var(--active-list-item);
          }

          span {
            &.type {
              font-size: calc(var(--search-font-size) * 0.68);
              color: rgb(255, 213, 2);
            }
          }
        }
      }



      overflow-y: scroll;
    }

  }


  .icon {

    &,
    svg {
      color: var(--my-gray);
      display: block;

      width: 95%;
      height: 95%;
    }

    svg {
      &:hover {
        transition: all 0.15s ease;
        color: var(--my-light-white);
        cursor: pointer;
      }
    }
  }



  @keyframes animated-border {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(1.05);
      color: var(--my-light-white);
    }
  }


  :deep(.searching-icon svg) {
    animation: animated-border 0.3s alternate-reverse infinite;
  }

}








.v-enter-from,
.v-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.22s;
}
</style>
