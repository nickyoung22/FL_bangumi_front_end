<template>
  <div class="list-item">
    <div class="title-box clearfix">
      <span class="name float-left">
        {{ list_item_data.name }}
      </span>

      <template v-if="list_item_data.other_name.length > 0">
        <span class="other-name-space float-left">&ensp;&ensp;&ensp;</span>
        <span class="other-name float-left">
          (别名： {{ list_item_data.other_name.join(' , ') }})
        </span>
      </template>

      <span v-if="list_item_data.actress" class="actress actress_highlight float-right">
        {{ list_item_data.actress.join(' -- ') }}
      </span>
    </div>
    <div class="tags-box tags_highlight">
      {{ list_item_data.tags.join(' ') }}
    </div>
    <div class="prev-box-wrapper">
      <div class="prev-box">
        <!-- hots -->
        <template v-for="hot_item in list_item_data.hots">
          <template
            v-if="
              hot_item.includes('.mp4') || hot_item.includes('.MP4') || hot_item.includes('.mkv')
            ">
            <video
              class="hover-active"
              controls
              controlsList="nodownload"
              disablePictureInPicture="true">
              <source
                v-bind:src="
                  store.api_server +
                  '/static/' +
                  list_item_data.type +
                  '/' +
                  encodeURIComponent(list_item_data.storeName + '/hots/' + hot_item)
                " />
              您的浏览器不支持 video 标签。
            </video>
          </template>
          <template
            v-if="
              hot_item.includes('.jpg') || hot_item.includes('.jpeg') || hot_item.includes('.png')
            ">
            <img
              class="hover-active"
              v-bind:src="
                store.api_server +
                '/static/' +
                list_item_data.type +
                '/' +
                encodeURIComponent(list_item_data.storeName + '/hots/' + hot_item)
              " />
          </template>
        </template>

        <hr />

        <!-- files -->
        <template v-for="file_item in list_item_data.file_names">
          <template
            v-if="
              file_item.name.includes('.mp4') ||
              file_item.name.includes('.MP4') ||
              file_item.name.includes('.mkv')
            ">
            <video
              class="hover-active"
              controls
              controlsList="nodownload"
              disablePictureInPicture="true">
              <source
                v-bind:src="
                  store.api_server +
                  '/static/' +
                  list_item_data.type +
                  '/' +
                  encodeURIComponent(list_item_data.storeName + '/' + file_item.name)
                " />
              您的浏览器不支持 video 标签。
            </video>
          </template>
          <template
            v-if="
              file_item.name.includes('.jpg') ||
              file_item.name.includes('.jpeg') ||
              file_item.name.includes('.png')
            ">
            <img
              class="hover-active"
              v-bind:src="
                store.api_server +
                '/static/' +
                list_item_data.type +
                '/' +
                encodeURIComponent(list_item_data.storeName + '/' + file_item.name)
              " />
          </template>
        </template>

        
      </div>
      <div class="info-box">
        <div class="filenames-box-wrapper clearfix">
          <div class="filenames-box float-right">
            <!-- files-icons -->
            <template v-for="file in list_item_data.file_names">
              <File_icon
                @click="open(list_item_data.type, list_item_data.storeName, file.name)"
                class="file-names click-active hover-active"
                v-bind="{
                  file_obj: file
                }"></File_icon>
            </template>

            <File_icon
              class="file-names last click-active hover-active"
              @click="open(list_item_data.type, list_item_data.storeName)"
              v-bind="{
                file_obj: {
                  name: '打开所在文件夹',
                  type: 'folder'
                }
              }"></File_icon>
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
  import File_icon from '@/components/small_components/file_icon.vue'
  import IMG_LOAD_ERROR from '@/assets/myPictures/other/图片加载失败.png'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },

    components: {
      File_icon
    },

    props: ['list_item_data'],

    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue  anime_movie.vue',
        IMG_LOAD_ERROR
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
      },

      handle_cover_img_error(e) {
        let temp_img = new Image()
        temp_img.src = e.target.src.replace('.jpg', '.png')
        temp_img.addEventListener('load', () => {
          // console.log('加载成功了！！！！！！！！')
          e.target.src = temp_img.src
        })
        temp_img.addEventListener('error', () => {
          // console.log('加载失败了！！！！！！！！')
          e.target.src = IMG_LOAD_ERROR
        })
      }
    }
  }
</script>

<style scoped lang="less">
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

          cursor: pointer;
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
          height: 36px;
          margin: 5px;
          text-align: right;
        }
      }
    }
  }

  // video 样式设置
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
