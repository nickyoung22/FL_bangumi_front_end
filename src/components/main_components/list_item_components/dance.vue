<template>
  <div class="list-item">
    <div class="title-box clearfix">
      <span class="name float-left  click-active hover-active"
        @click="open(list_item_data.type, list_item_data.storeName)">
        {{ list_item_data.name }}
      </span>

      <template v-if="list_item_data.other_name.length > 0">
        <span class="other-name-space float-left">&ensp;&ensp;&ensp;</span>
        <span class="other-name float-left">
          (别名： {{ list_item_data.other_name.join(' , ') }})
        </span>
      </template>

      <span class="dancer float-right">{{ list_item_data.dancer.join(' -- ') }}</span>
    </div>
    <div class="tags-box tags_highlight">
      {{ list_item_data.tags.join(' ') }}
    </div>
    <div class="prev-box-wrapper">
      <div class="prev-box">
        <template v-for="hot_item in list_item_data.hots">
          <template v-if="
            hot_item.includes('.mp4') || hot_item.includes('.MP4') || hot_item.includes('.mkv')
          ">
            <video class="hover-active" controls controlsList="nodownload" disablePictureInPicture="true">
              <source v-bind:src="
                store.api_server +
                '/static/' +
                list_item_data.type +
                '/' +
                list_item_data.storeName +
                '/hots/' +
                encodeURIComponent(hot_item)
              " />
              您的浏览器不支持 video 标签。
            </video>
          </template>
          <template v-if="
            hot_item.includes('.jpg') || hot_item.includes('.jpeg') || hot_item.includes('.png')
          ">
            <img class="hover-active" v-bind:src="
              store.api_server +
              '/static/' +
              list_item_data.type +
              '/' +
              list_item_data.storeName +
              '/hots/' +
              encodeURIComponent(hot_item)
            " />
          </template>
        </template>
      </div>
      <div class="info-box">
        <div class="filenames-box-wrapper clearfix">
          <div class="filenames-box float-right">
            <!-- 文件不展示 -->

            <File_icon class="file-names last click-active hover-active"
              @click="open(list_item_data.type, list_item_data.storeName)" v-bind="{
                fileName: list_item_data.storeName,
                type_appoint: 'folder'
              }">
            </File_icon>

          </div>
        </div>

        <div class="buttons-box">
          <el-button type="warning" @click="modify(list_item_data)">修改信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/store.js'

export default {
  setup() {
    const store = useStore()
    return { store }
  },

  props: ['list_item_data'],

  data() {
    return {
      ComponentName: 'main.vue  infinite_list.vue  dance.vue'
    }
  },
  methods: {
    open(type, ...path_arr) {
      console.log(path_arr)

      this.$axios.get(`${this.store.api_server}/open/${type}`, {
        params: {
          path: JSON.stringify(path_arr)
        }
      })
    },
    modify(item_data) {
      // // 这里要深拷贝。因为不想详情页数据和列表页项数据产生联系
      // this.store.temp_data.modify_data = JSON.parse(JSON.stringify(item_data))

      this.store.temp_data.modify_data = item_data
      this.$router.push({
        name: 'Add_Resources_detail',
        params: { type: item_data.type, storeName: item_data.storeName, operation: 'modify' }
      })
    }
  },

  created() { },
  mounted() { }
}
</script>

<style scoped  lang="less">
.list-item {
  .title-box {

    .name,
    .other-name {
      color: var(--a-hover-color);
      font-size: calc(var(--body-font-size) * 1.2);
      font-weight: 900;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }



  }

  .tags-box {
    color: rgb(227, 219, 57);
    font-weight: 700;
  }


  .prev-box-wrapper {
    display: flex;

    .prev-box {
      flex: 1;

      img,
      video {
        display: inline-block;
        height: 220px;
        vertical-align: top;
        margin-left: 5px;
        border: 1px solid #25edff82;

        &:hover {
          cursor: pointer;
        }
      }
    }


    .info-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .filenames-box-wrapper {
        .filenames-box {
          height: 100px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          writing-mode: vertical-lr;
          margin: 5px;
          font-size: calc(var(--body-font-size) * 1);

          .img-info {
            writing-mode: lr;
            color: var(--info-font-color);
            font-weight: 660;
            font-size: calc(var(--body-font-size) * .6);
          }


          :deep(.file-names) {
            height: calc(var(--body-font-size) * 1.68);
            width: calc(var(--body-font-size) * 1.68);
            writing-mode: horizontal-tb;
            display: inline-block;
          }

          :deep(.last) {
            border: 2px solid #d7d7d7a9;
            border-radius: 6px;
            margin-top: 2px;
          }

        }
      }



      .buttons-box {
        margin: 5px;
        text-align: right;
      }
    }


  }

}

.prev-box {

  /* 播放按钮  进度条  全屏按钮 */
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-fullscreen-button {
    transform: scale(0.6) !important;
  }

  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-fullscreen-button {
    margin-top: 50px;
  }

  /* 观看的当前时间 */
  video::-webkit-media-controls-current-time-display {
    display: none;
  }

  /* 剩余时间 */
  video::-webkit-media-controls-time-remaining-display {
    display: none;
  }

  /* 音量按钮 */
  // video::-webkit-media-controls-mute-button {
  //   display: none;
  // }

  video::-webkit-media-controls-toggle-closed-captions-button {
    display: none;
  }
}
</style>
