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

      <span class="artist artist_highlight float-right">
        {{ list_item_data.artist.join(' -- ') }}
      </span>
    </div>

    <div class="tags-box tags_highlight">
      <span class="date">{{ list_item_data.date }}</span>
      {{ list_item_data.tags.join(' ') }}
    </div>

    <div class="prev-box-wrapper">
      <div class="prev-box">
        <img
          class="hover-active"
          v-bind:src="
            store.api_server +
            '/static/' +
            list_item_data.type +
            '/' +
            encodeURIComponent(list_item_data.storeName + '/' + file_names_not_need_show[0])
          "
          @error="handle_cover_img_error" />
        <!-- <img v-bind:src="store.api_server + '/static/' + type + '/' + list_item_data.storeName + '/cover.jpeg'" />
        <img v-bind:src="store.api_server + '/static/' + type + '/' + list_item_data.storeName + '/cover.png'" /> -->

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
      </div>
      <div class="info-box">
        <div class="info-items">
          <div class="original_highlight" v-if="list_item_data.original.length">
            原作: {{ list_item_data.original.join(' ') }}
          </div>
          <div class="character_highlight" v-if="list_item_data.character.length">
            角色: {{ list_item_data.character.join(' ') }}
          </div>
        </div>

        <div class="filenames-box-wrapper clearfix">
          <div class="filenames-box float-right">
            <!-- 所有图片文件不要全部一齐展示，表明 有多少个即可 -->

            <span class="img-info display-inline-block">
              <File_icon
                class="file-names click-active hover-active"
                @click="open_in_chnMangaReader"
                v-bind="{
                  file_obj: {
                    name: '22.jpg',
                    type: 'file'
                  },
                  option: {
                    tooltip_appoint: '在漫画阅读器中打开'
                  }
                }"></File_icon>
              <span>× {{ file_names_not_need_show.length }}</span>
            </span>

            <template v-for="file in file_names_need_show">
              <File_icon
                class="file-names click-active hover-active"
                @click="open(list_item_data.type, list_item_data.storeName, file.name)"
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

    props: ['list_item_data'],

    components: {
      File_icon
    },

    data() {
      return {
        ComponentName: 'main.vue  infinite_list.vue  manga.vue',
        IMG_LOAD_ERROR
      }
    },

    computed: {
      // 需要展示的文件，即 非图片
      file_names_need_show() {
        if (!this.list_item_data.file_names) {
          return []
        }
        return this.list_item_data.file_names.filter(e => this.file_name_need_show(e))
      },

      // 不需要展示的文件，即 图片
      file_names_not_need_show() {
        if (!this.list_item_data.file_names) {
          return []
        }
        return this.list_item_data.file_names
          .filter(e => !this.file_name_need_show(e))
          .map(e => e.name)
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
        // console.log('出错啦~~~~~~~~~~~~~~~~~~~~', e)
        // e.target.src = e.target.src.replace('.jpg', '.png')
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
      },

      file_name_need_show(file) {
        return !(/.jpg$/.test(file.name) || /.png$/.test(file.name) || /.JPG$/.test(file.name))
      },

      open_in_chnMangaReader() {
        // console.log('在chnMangaReader打开：', this.list_item_data)
        this.store.temp_data.manga_reading = this.list_item_data
        this.store.temp_data.manga_reading_pics = this.file_names_not_need_show

        this.$router.push({ name: 'chnMangaReader' })
      }
    },

    created() {},
    mounted() {
      console.log(222, '\n', this._.vnode)
    }
  }
</script>

<style scoped lang="less">
  .list-item {
    --info-font-color: #e3db39;

    .title-box {
      .name,
      .other-name {
        color: var(--a-hover-color);
        font-size: calc(var(--body-font-size) * 1);
        font-weight: 900;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .tags-box {
      .date {
        margin-right: 20px;
        color: #9ddbff;
      }

      color: rgb(227, 219, 57);
      font-weight: 700;
      font-size: calc(var(--body-font-size) * 0.8);
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
          border: 1px solid #25edff82;

          cursor: pointer;
        }
      }

      .info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info-items {
          color: var(--info-font-color);
        }

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
          height: 36px;
          margin: 5px;
          text-align: right;
        }
      }
    }
  }
</style>
