<template>
  <el-tooltip
    effect="dark"
    :content="fileName"
    :placement="this.tooltip_direction"
    :hide-after="0"
    :disabled="tooltip_disabled">
    <img v-bind="$attrs" @click="deliverClick" :src="srcLink" draggable="false" />
  </el-tooltip>
</template>

<script>
  // 文件
  // // 网页文件
  import twitter from '@/myPictures/web-icons/twitter.png'
  import youtube from '@/myPictures/web-icons/youtube.png'
  import instagram from '@/myPictures/web-icons/instagram.png'
  import bilibili from '@/myPictures/web-icons/bilibili2.png'
  import internet_web from '@/myPictures/web-icons/internet_web.png'
  // // 图片文件
  import picture from '@/myPictures/web-icons/picture.png'
  // // 视频文件
  import video from '@/myPictures/web-icons/video.png'
  // // 未知文件
  import file from '@/myPictures/web-icons/file.png'
  // 文件夹
  import folder from '@/myPictures/web-icons/folder.png'

  export default {
    props: {
      fileName: {
        type: String,
        required: true
      },
      url_exact: {
        default: true
      },
      tooltip_direction: {
        default: 'left-end'
      },
      type_appoint: {
        default: undefined
      },
      tooltip_disabled: {
        default: false
      }
    },

    emits: ['click'],
    data() {
      return {
        // ComponentName: 'small_components  url_icon',
        twitter,
        youtube,
        instagram,
        bilibili,
        internet_web,
        file,
        folder,
        picture,
        video
      }
    },
    computed: {
      srcLink() {
        // 如果有指定类别
        if (this.type_appoint === 'folder') {
          return this.folder
        }
        if (this.type_appoint === 'img') {
          return this.picture
        }

        // 如果是文件  （有后缀 或  指定了是文件）
        if (this.fileName.includes('.') || this.type_appoint === 'file') {
          // 如果是网页文件
          if (this.fileName.lastIndexOf('.url') === this.fileName.length - 1 - 3) {
            if (!this.url_exact) {
              return internet_web
            }
            // 如果需要区分具体是哪个网站图标
            else {
              let filename = this.fileName.toLowerCase()
              if (/twitter\.url$/.test(filename)) {
                return this.twitter
              } else if (/youtube\.url$/.test(filename)) {
                return this.youtube
              } else if (/instagram 照片和视频\.url$/.test(filename)) {
                return this.instagram
              } else if (
                new RegExp(`(${['哔哩哔哩', 'bilibili'].join('|')})\.url$`).test(filename)
              ) {
                return this.bilibili
              } else {
                return this.internet_web
              }
            }
          }
          // 如果是图片文件
          else if (
            new RegExp(`(${['.jpg', '.jpeg', '.png', '.gif'].join('|')})`).test(
              this.fileName.toLowerCase()
            )
          ) {
            return this.picture
          }
          // 如果是视频文件
          else if (
            new RegExp(`(${['.avi', '.mp4', '.mkv', '.wmv', '.wov'].join('|')})`).test(
              this.fileName.toLowerCase()
            )
          ) {
            return this.video
          }
          // 未知文件
          else {
            return this.file
          }
        }
        // 如果是 文件夹（无后缀）
        else {
          return this.folder
        }
      }
    },
    methods: {
      deliverClick() {
        this.$emit('click')
      }
    },

    created() {},
    mounted() {}
  }
</script>

<style scoped lang="less"></style>
