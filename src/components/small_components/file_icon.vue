<template>
  <el-tooltip
    effect="dark"
    :content="option_.tooltip_appoint ? option_.tooltip_appoint : file_obj.name"
    :placement="option_.tooltip_direction"
    :hide-after="0"
    :disabled="option_.tooltip_disabled">
    <img v-bind="$attrs" :src="src" draggable="false" />
  </el-tooltip>
</template>

<script>
  // 文件
  // // 网页文件
  import twitter from '@/assets/myPictures/web-icons/twitter.png'
  import youtube from '@/assets/myPictures/web-icons/youtube.png'
  import instagram from '@/assets/myPictures/web-icons/instagram.png'
  import bilibili from '@/assets/myPictures/web-icons/bilibili2.png'
  import exhentai from '@/assets/myPictures/web-icons/exhentai.png'

  import internet_web from '@/assets/myPictures/web-icons/internet_web.png'
  // // 图片文件
  import picture from '@/assets/myPictures/web-icons/picture.png'
  // // 视频文件
  import video from '@/assets/myPictures/web-icons/video.png'
  // // excel文件
  import excel from '@/assets/myPictures/web-icons/excel.png'
  // // 未知文件
  import file from '@/assets/myPictures/web-icons/file.png'
  // 文件夹
  import folder from '@/assets/myPictures/web-icons/folder.png'

  export default {
    props: {
      file_obj: {
        type: Object
        // default: {
        //   name: '文件的名字',
        //   type: 'file or folder',
        //   content:'www.abc.com'
        // }
      },
      option: {
        type: Object
      }
    },

    created() {
      this.option_ = {
        // 默认值
        ...this.option_,
        ...this.option
      }
    },

    data() {
      return {
        // ComponentName: 'small_components  url_icon',
        option_: {
          // 默认值
          tooltip_direction: 'left-end',
          tooltip_disabled: false,
          tooltip_appoint: undefined
        }
      }
    },
    computed: {
      src() {
        let { name, type } = this.file_obj
        // 如果是文件
        if (type === 'file') {
          // 如果是网页文件
          if (/.url$/.test(name)) {
            let { content } = this.file_obj
            // 从url判断是具体哪个网站
            switch (true) {
              case /twitter\.com/.test(content):
                return twitter
              case /youtube\.com/.test(content):
                return youtube
              case /instagram\.com/.test(content):
                return instagram
              case /bilibili\.com/.test(content):
                return bilibili
              case /(exhentai|e-hentai)\.org/.test(content):
                return exhentai

              default:
                return internet_web
            }
          } else {
            // 非网页文件，依靠后缀判定类别
            switch (true) {
              // 如果是图片文件
              case new RegExp(`(${['.jpg', '.jpeg', '.png', '.gif'].join('|')})`).test(
                name.toLowerCase()
              ):
                return picture
              // 如果是视频文件
              case new RegExp(`(${['.avi', '.mp4', '.mkv', '.wmv', '.wov'].join('|')})`).test(
                name.toLowerCase()
              ):
                return video
              // 如果是excel文件
              case new RegExp(`(${['.xlsx', '.xls'].join('|')})`).test(name.toLowerCase()):
                return excel
              // 未知类型文件
              default:
                return file
            }
          }
        }
        // 如果是 文件夹（无后缀）
        else if (type === 'folder') {
          return folder
        } else {
          throw new Error('file_icon 组件: 未知文件类型')
        }
      }
    }
  }
</script>
