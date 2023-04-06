<template>
  <div class="list-item">
    <div class="title-box clearfix">
      <span
        class="name float-left click-active hover-active"
        @click="open(list_item_data.type, list_item_data.storeName)">
        {{ list_item_data.name }}
      </span>

      <template v-if="list_item_data.other_name.length > 0">
        <span class="other-name-space float-left">&ensp;&ensp;&ensp;</span>
        <span class="other-name float-left">
          (别名： {{ list_item_data.other_name.join(' , ') }})
        </span>
      </template>

      <span class="original original_highlight float-right">
        {{ list_item_data.original.join(' - ') }}
      </span>
    </div>
    <div class="tags-box tags_highlight">
      {{ list_item_data.tags.join(' ') }}
    </div>
    <div class="prev-box-wrapper">
      <div class="prev-box">
        <!-- youtube bilibili内嵌视频 -->
        <template v-for="file in list_item_data.file_names">
          <template
            v-if="
              file.type === 'file' &&
              /.url$/.test(file.name) &&
              (/youtube\.com\/watch\?v=/.test(file.content) || /bilibili\.com/.test(file.content))
            ">
            <template v-if="/youtube\.com/.test(file.content)">
              <div class="embed-video-box">
                <Youtube_player :id="file.content.match(/watch\?v=([-\w]+)/)[1]"></Youtube_player>
              </div>
            </template>

            <!-- b站内嵌代码不能调节音量等 故不用 -->
            <!-- <template v-if="/bilibili\.com/.test(file.content)">
                <div class="embed-video-box">
                  <iframe
                    :src="`//player.bilibili.com/player.html?bvid=${
                      file.content.match(/video\/(BV\w+)/)[1]
                    }&danmaku=0`"
                    scrolling="no"
                    border="0"
                    frameborder="no"
                    framespacing="0"
                    allowfullscreen="true"></iframe>
                </div>
              </template> -->
          </template>
        </template>
      </div>
      <div class="info-box">
        <div class="filenames-box-wrapper clearfix">
          <div class="filenames-box float-right">
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

        <div class="buttons-box" @selectstart.prevent>
          <el-button type="warning" @click="modify(list_item_data)">修改信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { useStore } from '@/stores/store.js'

  import File_icon from '@/components/small_components/file_icon.vue'
  import NProgress from 'nprogress'

  import Youtube_player from '@/components/small_components/youtube_player.vue'

  export default {
    setup() {
      const store = useStore()
      return { store }
    },

    components: {
      File_icon,
      Youtube_player
    },

    props: ['list_item_data'],

    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue  character_2cy.vue'
      }
    },

    computed: {},

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

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less">
  .list-item {
    &.selected {
      background-color: #ffee006a !important;
    }
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
          height: 260px;
          vertical-align: top;
          margin-left: 5px;
          border: 1px solid #d400ff;

          &:hover {
            cursor: pointer;
          }
        }

        .embed-video-box {
          display: inline-block;
          height: 260px;
          margin-left: 5px;
          border: 1px solid #ff00ff;
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
              font-size: calc(var(--body-font-size) * 0.6);
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
          .select-box {
            margin-bottom: 10px;
          }
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
