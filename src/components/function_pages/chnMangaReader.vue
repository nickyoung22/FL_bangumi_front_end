<template>
  <div class="container" ref="rootEle">
    <div class="chn-manga-reader" @selectstart.prevent>
      <div class="header" v-if="show_header">
        <span class="info1">
          {{ store.temp_data.manga_reading.name }}
        </span>
        <span class="info2">
          第 {{ img_info.index_now + 1 }} / {{ store.temp_data.manga_reading_pics.length }} 页
        </span>
      </div>
      <div class="main">
        <div class="sider" :class="{ 'muti-mode': muti_mode }" ref="siderEle" v-show="show_sider">
          <template v-for="(item, i) in store.temp_data.manga_reading_pics" :key="item">
            <div class="small-img-wrapper" :class="{ now: i === img_info.index_now }">
              <img
                class="hover-active click-active"
                loading="lazy"
                @click="clickPrev(i)"
                draggable="false"
                :data-index="i"
                :src="
                  store.api_server +
                  '/static/' +
                  store.temp_data.manga_reading.type +
                  '/' +
                  encodeURIComponent(store.temp_data.manga_reading.storeName + '/' + item)
                " />
            </div>
          </template>
        </div>
        <div class="img-wrapper" ref="mainEle">
          <img
            ref="imgEle"
            loading="lazy"
            @load="load_handle"
            :src="
              store.api_server +
              '/static/' +
              store.temp_data.manga_reading.type +
              '/' +
              encodeURIComponent(
                store.temp_data.manga_reading.storeName +
                  '/' +
                  store.temp_data.manga_reading_pics[img_info.index_now]
              )
            "
            draggable="false" />
          <img
            v-if="
              double_page_mode && img_info.index_now < store.temp_data.manga_reading_pics.length - 1
            "
            ref="imgEle2"
            loading="lazy"
            @load="load_handle"
            :src="
              store.api_server +
              '/static/' +
              store.temp_data.manga_reading.type +
              '/' +
              encodeURIComponent(
                store.temp_data.manga_reading.storeName +
                  '/' +
                  store.temp_data.manga_reading_pics[img_info.index_now + 1]
              )
            "
            draggable="false" />

          <div v-if="!muti_mode" class="previous" @click="previous">
            <el-icon>
              <ArrowLeftBold />
            </el-icon>
          </div>
          <div v-if="!muti_mode" class="next" @click="next">
            <el-icon>
              <ArrowRightBold />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="footer"></div>

      <div class="menu" :class="{ unfolding: menu_show }" @mouseover="Show" @mouseleave="offShow">
        <el-icon class="icon" :class="{ 'unfolding-icon': menu_show }">
          <ArrowDown />
        </el-icon>
        <Transition @after-enter="transition_finished = true">
          <div class="menu-list" :class="{ unfolding: menu_show }" v-show="menu_show">
            <span
              class="hover-active click-active"
              :class="{ active: show_header }"
              @click="header_toggle">
              标题栏
            </span>
            <hr />
            <span
              class="hover-active click-active"
              :class="{ active: show_sider && !muti_mode }"
              @click="sider_toggle">
              侧边栏
            </span>
            <hr />
            <span
              class="hover-active click-active"
              :class="{ active: muti_mode }"
              @click="muti_mode_toggle">
              多图预览
            </span>
            <hr />
            <hr />
            <span v-if="!muti_mode" class="hover-active click-active" @click="open_in_local">
              本地打开
            </span>
            <hr />
            <span
              v-if="!muti_mode"
              class="hover-active click-active"
              :class="{ active: double_page_mode }"
              @click="double_page_mode_toggle">
              双页模式
            </span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    onMounted,
    onUnmounted,
    nextTick,
    getCurrentInstance
  } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from '@/stores/store.js'
  import _throttle from '@/utils/_throttle.js'
  const store = useStore()
  const { proxy } = getCurrentInstance()
  // 获取一些元素dom
  const rootEle = ref(null)
  const imgEle = ref(null)
  const imgEle2 = ref(null)
  const mainEle = ref(null)

  // 图片相关信息
  const img_info = reactive({
    index_now: 0
  })

  // 前一页、下一页 点击事件
  //键盘快捷键
  const handle_keyup = e => {
    if (!muti_mode.value) {
      if (e.keyCode === 37) {
        previous()
      } else if (e.keyCode === 39) {
        next()
      }
    }
  }
  onMounted(() => {
    document.addEventListener('keyup', handle_keyup)
  })
  onUnmounted(() => {
    document.removeEventListener('keyup', handle_keyup)
  })

  const previous = () => {
    if (img_info.index_now === 0) {
      ElMessage({
        message: '这是第一张图片~',
        duration: 1000,
        ['custom-class']: 'manga-reader-message',
        appendTo: rootEle.value
      })
      return
    }
    img_info.index_now--
    sider_navigate()
  }
  const next = () => {
    if (img_info.index_now === store.temp_data.manga_reading_pics.length - 1) {
      ElMessage({
        message: '已经是最后一张了~',
        duration: 1000,
        ['custom-class']: 'manga-reader-message',
        appendTo: rootEle.value
      })
      return
    }
    img_info.index_now++
    sider_navigate()
  }

  // 图片 缩放功能 与 拖拽移动功能
  /**
   * 元素缩放、拖拽
   * @param {string | HTMLBaseElement} imgEle 元素选择器或者一个元素
   * @param {object} [option] 其他选项
   * @param {number} [option.scale = 1] 初始化的缩放比
   * @param {number} [option.scale_delta = 0.1] 每次叠加的间隔数
   * @param {number} [option.minScale = undefined] 最小缩放 默认不限制
   * @param {number} [option.maxScale = undefined] 最大缩放 默认不限制
   * @param {number} [option.disabledZoom = false] 是否禁用缩放，默认 否
   * @param {number} [option.disabledDrag = false] 是否禁用拖拽，默认 否
   * @param {number} [option.slopOverParent = true] 是否可以超出父容器边界，默认 是
   * @param {number} [option.DoubleClick_init = true] 是否双击复原
   *
   */
  function IMG_enhance_zoom_drag(imgEle, option = {}) {
    console.log('------------- init (first time) -------------', imgEle)
    if (typeof imgEle === 'string') {
      imgEle = document.querySelector(imgEle)
    }
    let {
      scale = 1,
      scale_delta = 0.2,
      minScale = undefined,
      maxScale = undefined,
      slopOverParent = true,
      disabledZoom = false,
      disabledDrag = false,
      DoubleClick_init = true
    } = option

    // 记录 Translate 的坐标值
    let prevTranslate = {
      x: 0,
      y: 0
    }
    let newsetWidth, // 拖动容器最新的宽度
      newsetHeight, // 拖动容器最新的高度
      firstMoveFlag = false // 第一次移动标记，防止用户第一次按下和松开鼠标但并未移动，第二次移动时 dom 出现闪现的情况

    imgEle.style.transformOrigin = '0 0'
    // 获取最初始的宽高
    let { width: initWidth, height: initHeight } = imgEle.getBoundingClientRect()
    const pDom = imgEle.parentElement

    // 缩放事件
    if (!disabledZoom) {
      // 滚动事件兼容文章（https://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/）
      imgEle.addEventListener('mousewheel', ev => {
        // 鼠标坐标
        const { x: mouseX, y: mouseY } = ev
        // 元素当前宽高
        const { height, width } = imgEle.getBoundingClientRect()
        const { top: pTop, left: pLeft } = pDom.getBoundingClientRect()
        if (ev.wheelDelta > 0) {
          // 放大
          scale += scale_delta
          if (maxScale && scale > maxScale) {
            scale = maxScale
          }
        } else {
          // 缩小
          scale -= scale_delta
          if (minScale && scale < minScale) {
            scale = minScale
          }
        }
        // 获取比例
        let yRate = (mouseY - pTop - prevTranslate.y) / height
        let xRate = (mouseX - pLeft - prevTranslate.x) / width
        // 放大后的宽高
        const ampWidth = initWidth * scale
        const ampHeight = initHeight * scale
        // 需要重新运算的 translate 坐标
        const translateY = prevTranslate.y - yRate * (ampHeight - height)
        const translateX = prevTranslate.x - xRate * (ampWidth - width)
        // 更新css
        imgEle.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
        // 记录这次的值
        prevTranslate = {
          x: translateX,
          y: translateY
        }
      })
    }

    // 拖拽移动事件
    if (!disabledDrag) {
      let x0, // 记录鼠标按下时的 x 坐标
        y0 // 记录鼠标按下时的 y 坐标
      let Trans_x = prevTranslate.x, // 最后设置的 translateX 值
        Trans_y = prevTranslate.y // 最后设置的 translateY 值
      const mousedown = ev => {
        x0 = ev.x
        y0 = ev.y
        const clientRect = imgEle.getBoundingClientRect()
        newsetWidth = clientRect.width
        newsetHeight = clientRect.height
        imgEle.style.cursor = 'grabbing'
        // 鼠标移动
        document.addEventListener('mousemove', mousemove)
        // 鼠标松开
        document.addEventListener('mouseup', mouseup)
      }
      const mousemove = ev => {
        firstMoveFlag = true
        Trans_y = prevTranslate.y + (ev.y - y0)
        Trans_x = prevTranslate.x + (ev.x - x0)
        if (!slopOverParent) {
          if (Trans_y < 0) Trans_y = 0
          if (Trans_x < 0) Trans_x = 0
          const rightBoundary = pDom.offsetWidth - newsetWidth // 右边边界
          const bottomBoundary = pDom.offsetHeight - newsetHeight // 下边边界
          if (Trans_y > bottomBoundary) Trans_y = bottomBoundary
          if (Trans_x > rightBoundary) Trans_x = rightBoundary
        }
        // 设置样式
        imgEle.style.cssText += `transform: translate(${Trans_x}px, ${Trans_y}px) scale(${scale})`
      }
      const mouseup = () => {
        if (firstMoveFlag) {
          prevTranslate = {
            x: Trans_x,
            y: Trans_y
          }
        }
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)

        imgEle.style.cursor = 'auto'
      }
      // 鼠标按下去
      imgEle.addEventListener('mousedown', mousedown)
    }

    // 初始化函数 清理闭包内容的函数，方便img元素url更新后，css样式复原。上一个图片和新图片不影响
    let init = () => {
      console.log('------------- init ------------- ')
      imgEle.style = null
      imgEle.style.transformOrigin = '0 0'

      prevTranslate = {
        x: 0,
        y: 0
      }
      firstMoveFlag = false
      ;({ width: initWidth, height: initHeight } = imgEle.getBoundingClientRect())
      ;({
        scale = 1,
        scale_delta = 0.2,
        minScale = undefined,
        maxScale = undefined,
        slopOverParent = true,
        disabledZoom = false,
        disabledDrag = false,
        DoubleClick_init = true
      } = option)
    }

    // 是否双击复原
    if (DoubleClick_init) {
      imgEle.addEventListener('dblclick', () => {
        init()
      })
    }

    // 返回初始化函数
    return init
  }

  let first_load = true
  let _re = null
  const load_handle = () => {
    // 第一次加载图片时（组件初始化时）调用 IMG_enhance，随后每次更改图片url时 只需调整即可
    if (first_load) {
      _re = IMG_enhance_zoom_drag(imgEle.value, {
        minScale: 0.1
      })

      first_load = false
    } else {
      _re()
    }
  }

  //右上角菜单
  const menu_show = ref(false)
  const transition_finished = ref(false)
  const Show = () => {
    menu_show.value = true
  }
  const offShow = () => {
    if (menu_show.value) {
      menu_show.value = false
      transition_finished.value = false
    }
  }

  // 是否显示header
  const show_header = ref(true)
  const header_toggle = () => {
    show_header.value = !show_header.value
    nextTick(() => {
      if (_re) {
        _re()
      }
    })
  }

  // 侧边栏 toggle
  const sider_toggle = () => {
    if (muti_mode.value) {
      muti_mode.value = false
      show_sider.value = true
    } else {
      show_sider.value = !show_sider.value
    }
    sider_navigate()
    nextTick(() => {
      if (_re) {
        _re()
      }
    })
  }
  // 侧边栏自动滚动到当前页
  const show_sider = ref(true)
  const siderEle = ref(null)
  function sider_navigate() {
    if (show_sider.value) {
      nextTick(() => {
        let imgs = siderEle.value.querySelectorAll('img')
        imgs.forEach(img => {
          // console.log(img.dataset.index, img_info.index_now)
          if (parseInt(img.dataset.index) === img_info.index_now) {
            // console.log(img)
            img.scrollIntoViewIfNeeded()
          }
        })
      })
    }
  }

  // 多图预览模式
  const muti_mode = ref(true)
  // 多图预览 toggle
  const muti_mode_toggle = () => {
    muti_mode.value = !muti_mode.value
    show_sider.value = muti_mode.value
    sider_navigate()
    nextTick(() => {
      if (_re) {
        _re()
      }
    })
  }
  const clickPrev = i => {
    img_info.index_now = i
    if (muti_mode.value) {
      muti_mode.value = false
      show_sider.value = false
    }

    nextTick(() => {
      if (_re) {
        _re()
      }
    })
  }

  // 本地打开
  const open_in_local = () => {
    proxy.$axios.get(`${store.api_server}/open/${store.temp_data.manga_reading.type}`, {
      params: {
        path: JSON.stringify(
          (
            store.temp_data.manga_reading.storeName +
            '\\' +
            store.temp_data.manga_reading_pics[img_info.index_now]
          ).split('\\')
        )
      }
    })
  }

  // 双页模式
  const double_page_mode = ref(false)
  // 双页模式 toggle
  const double_page_mode_toggle = () => {
    double_page_mode.value = !double_page_mode.value
    nextTick(() => {
      if (_re) {
        _re()
      }
    })
  }
  const img_width = computed(() => {
    return double_page_mode.value ? '50%' : '100%'
  })
</script>

<style lang="less" scoped>
  :deep(.manga-reader-message) {
    background-color: rgba(43, 43, 43, 0.652);
  }

  .container {
    height: 100%;
    width: 100%;

    .chn-manga-reader {
      display: flex;
      flex-direction: column;
      height: 99.2vh;
      width: 100%;

      overflow: hidden;

      .header {
        display: flex;

        .info1 {
          font-size: calc(var(--body-font-size) * 0.6);
          font-weight: 660;
        }

        .info2 {
          flex: 1;
          text-align: center;
          font-size: calc(var(--body-font-size) * 0.8);
          font-weight: 660;

          white-space: nowrap;
        }
      }

      .main {
        display: flex;
        flex-direction: row;
        flex: 1;
        overflow: hidden;

        .sider {
          --sider-width: 220px;
          width: var(--sider-width);
          overflow: scroll;

          ::-webkit-scrollbar {
            width: 1.8px !important;
          }

          &.muti-mode {
            width: 100%;

            .small-img-wrapper {
              height: 330px;
              width: auto;
              padding-left: 3px;
              padding-right: 3px;
              border: 1px solid rgba(4, 238, 255, 0.712);

              img {
                height: 100%;
                width: auto;
              }
            }
          }

          .small-img-wrapper {
            display: inline-block;
            width: 100%;
            padding-top: 3px;
            padding-bottom: 3px;
            border-bottom: 1px solid rgba(4, 238, 255, 0.792);
            text-align: center;

            &.now {
              padding-top: 6px;
              padding-bottom: 6px;
              border: 2px solid rgb(255, 123, 0);
              border-radius: 5px;
            }

            img {
              width: 95%;
            }
          }
        }

        .img-wrapper {
          position: relative;
          height: 100%;
          width: 100%;
          flex: 1;

          img {
            height: 100%;
            width: v-bind(img_width);
            // 图片自适应宽高
            object-fit: contain;
          }

          .previous,
          .next {
            position: absolute;
            top: 50%;
            transform: translatey(-50%);
            height: 60vh;
            cursor: pointer;

            &:hover {
              background-color: rgba(0, 0, 0, 0.135);

              .el-icon {
                color: rgba(255, 255, 255, 0.751);
                visibility: initial;
              }
            }

            &:active {
              .el-icon {
                color: rgba(255, 255, 255);
                transform: scale(1.5);
              }
            }

            .el-icon {
              visibility: hidden;
              height: 100%;
              font-size: 4.5vw;
              transform: scaleY(1.8);
            }
          }

          .previous {
            left: 0px;
          }

          .next {
            right: 0px;
          }
        }
      }

      // .footer {}
      .menu {
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
          background-color: var(--my-gray2);
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

        .icon {
          font-size: 36px;
          cursor: pointer;

          &,
          svg {
            transition: all 0.2s ease;
            color: var(--my-gray);
            display: block;
            height: calc((var(--header-height) - 4px) * 95%);
          }

          svg {
            &:hover {
              color: var(--my-light-white);
            }
          }
        }

        .menu-list {
          span {
            cursor: pointer;

            &.active {
              background-color: rgba(0, 255, 255, 0.576);
            }

            .list-icon {
              font-size: 28px;
            }
          }
        }
      }
    }
  }

  // .footer {}
</style>
